import { describe, expect, it } from 'vitest';
import { buildIlikeOrFilter } from '@/lib/news/search';
import {
  buildArrayContainsOrFilter,
  buildIlikeOrFilter as buildIlikeOrFilterEdge,
} from '../supabase/functions/get-users/search';

const CURATED_INPUTS = [
  'plain',
  '',
  'a,status.eq.published',
  'x),or(id.neq.0',
  'x"),or(id.neq.0',
  '(a,b)',
  'say "hi" \\ bye',
  'trailing\\',
  '\\"',
  '\\\\%',
  '50%_off*',
  '**',
  '{c++}',
  'a}b{c',
  'null',
  '  spaced  out  ',
  'line\nbreak\ttab',
  'İstanbul Köln Düsseldorf',
  'Straße ğüşıöç',
  '日本語 😀',
];

// Every ordered pair of special characters: catches escaping-order bugs such as `\%`, `"\` or `\*`.
const SPECIAL_CHARS = [',', '(', ')', '"', '\\', '%', '_', '*', '{', '}', '.', ':', ' ', 'ş', '😀', 'a'];
const PAIR_INPUTS = SPECIAL_CHARS.flatMap((first) => SPECIAL_CHARS.map((second) => first + second));
const TRICKY_INPUTS = [...CURATED_INPUTS, ...SPECIAL_CHARS, ...PAIR_INPUTS];

interface ParsedCondition {
  column: string;
  operator: string;
  value: string;
}

const unescapeBackslashes = (value: string) => value.replace(/\\(.)/gsu, '$1');

// The subset of PostgREST's `or=(...)` grammar these helpers emit: comma-separated
// `column.operator."value"` conditions; inside quotes `\x` → `x`; a closing quote is followed by `,` or the end.
function parseOrFilter(filter: string): ParsedCondition[] {
  const condition = /^([a-z_]+)\.([a-z]+)\."((?:[^"\\]|\\.)*)"(,|$)/su;
  const conditions: ParsedCondition[] = [];
  let rest = filter;
  while (rest.length > 0) {
    const match = condition.exec(rest);
    if (!match) throw new Error(`Unparseable filter: ${rest}`);
    conditions.push({ column: match[1], operator: match[2], value: unescapeBackslashes(match[3]) });
    rest = rest.slice(match[0].length);
    if (match[4] === ',' && rest.length === 0) throw new Error('Filter ends with a comma');
  }
  return conditions;
}

// Decodes a LIKE pattern with the default `\` escape; returns null if it contains an unescaped wildcard.
function decodeLikeLiteral(pattern: string): string | null {
  let literal = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const char = pattern[i];
    if (char === '%' || char === '_') return null;
    if (char === '\\') {
      i += 1;
      if (i >= pattern.length) return null;
      literal += pattern[i];
    } else {
      literal += char;
    }
  }
  return literal;
}

describe('get-users search.ts copy', () => {
  it.each([[['title', 'summary']], [['sehir']], [['name', 'description', 'url']]])(
    'matches lib/news/search.ts output (%j)',
    (columns) => {
      for (const input of TRICKY_INPUTS) {
        expect(buildIlikeOrFilterEdge(columns, input), JSON.stringify(input)).toBe(buildIlikeOrFilter(columns, input));
      }
    }
  );
});

describe('buildIlikeOrFilter', () => {
  it('never adds conditions and searches the term as plain text', () => {
    const columns = ['agency_name', 'report_text'];
    for (const input of TRICKY_INPUTS) {
      const conditions = parseOrFilter(buildIlikeOrFilter(columns, input));
      expect(conditions.map(({ column, operator }) => `${column}.${operator}`)).toEqual([
        'agency_name.ilike',
        'report_text.ilike',
      ]);
      for (const { value } of conditions) {
        expect(value.startsWith('%') && value.endsWith('%'), JSON.stringify(input)).toBe(true);
        // PostgREST turns `*` into `%` in like/ilike values, so none may survive.
        expect(value.includes('*'), JSON.stringify(input)).toBe(false);
        expect(decodeLikeLiteral(value.slice(1, -1)), JSON.stringify(input)).toBe(input.replace(/\*/g, ''));
      }
    }
  });
});

describe('buildArrayContainsOrFilter', () => {
  it('quotes the array value for both Postgres and PostgREST', () => {
    expect(buildArrayContainsOrFilter(['programlama_dilleri', 'devops_cloud'], 'c++')).toBe(
      String.raw`programlama_dilleri.cs."{\"c++\"}",devops_cloud.cs."{\"c++\"}"`
    );
    expect(buildArrayContainsOrFilter(['tags'], 'a"b\\c')).toBe(String.raw`tags.cs."{\"a\\\"b\\\\c\"}"`);
  });

  it('never adds conditions or array elements and keeps the element intact', () => {
    const columns = ['programlama_dilleri', 'framework_platformlar', 'devops_cloud'];
    for (const input of TRICKY_INPUTS) {
      const conditions = parseOrFilter(buildArrayContainsOrFilter(columns, input));
      expect(conditions.map(({ column, operator }) => `${column}.${operator}`)).toEqual(
        columns.map((column) => `${column}.cs`)
      );
      for (const { value } of conditions) {
        // Postgres array literal: exactly one quoted element; inside it `\x` → `x`.
        const element = /^\{"((?:[^"\\]|\\.)*)"\}$/su.exec(value);
        expect(element, JSON.stringify(input)).not.toBeNull();
        expect(unescapeBackslashes(element?.[1] ?? ''), JSON.stringify(input)).toBe(input);
      }
    }
  });
});
