import type { ToolPrimitive, ToolState } from '@/lib/tools/types';

export function getFact<T extends ToolPrimitive>(
  state: ToolState,
  key: string,
  fallback: T
): T {
  const value = state.facts[key];
  return (value ?? fallback) as T;
}

export function getScore(state: ToolState, key: string) {
  return state.scores[key] ?? 0;
}

export function pickHighestScore(
  state: ToolState,
  keys: string[]
): { key: string; score: number } {
  return keys.reduce(
    (best, key) => {
      const score = getScore(state, key);
      if (score > best.score) {
        return { key, score };
      }

      return best;
    },
    { key: keys[0] ?? '', score: Number.NEGATIVE_INFINITY }
  );
}

export function pickTopScores(
  state: ToolState,
  keys: string[],
  limit = 3
): Array<{ key: string; score: number }> {
  return keys
    .map((key) => ({ key, score: getScore(state, key) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
