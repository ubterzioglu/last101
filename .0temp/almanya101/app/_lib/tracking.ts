const CLARITY_SCRIPT_PREFIX = 'https://www.clarity.ms/tag/';
const GOATCOUNTER_SCRIPT_URL = 'https://gc.zgo.at/count.js';

type TrackingScript = {
  id: string;
  src: string;
  attrs?: Record<string, string>;
};

export function getClarityProjectId(): string {
  return String(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || process.env.CLARITY_PROJECT_ID || '').trim();
}

export function getClarityScriptUrl(): string {
  const projectId = getClarityProjectId();
  if (!projectId) return '';
  return `${CLARITY_SCRIPT_PREFIX}${encodeURIComponent(projectId)}`;
}

export function getContentsquareScriptUrl(): string {
  return String(
    process.env.NEXT_PUBLIC_CONTENTSQUARE_SCRIPT_URL ||
    process.env.CONTENTSQUARE_SCRIPT_URL ||
    ''
  ).trim();
}

export function getGoatcounterEndpoint(): string {
  return String(
    process.env.NEXT_PUBLIC_GOATCOUNTER_ENDPOINT ||
    process.env.GOATCOUNTER_ENDPOINT ||
    'https://almanya101de.goatcounter.com/count'
  ).trim();
}

export function getTrackingScripts(): TrackingScript[] {
  const scripts: TrackingScript[] = [];
  
  const clarityScriptUrl = getClarityScriptUrl();
  if (clarityScriptUrl) {
    scripts.push({ id: 'microsoft-clarity', src: clarityScriptUrl });
  }

  const goatcounterEndpoint = getGoatcounterEndpoint();
  if (goatcounterEndpoint) {
    scripts.push({
      id: 'goatcounter',
      src: GOATCOUNTER_SCRIPT_URL,
      attrs: { 'data-goatcounter': goatcounterEndpoint }
    });
  }

  const contentsquareScriptUrl = getContentsquareScriptUrl();
  if (contentsquareScriptUrl) {
    scripts.push({ id: 'contentsquare-tag', src: contentsquareScriptUrl });
  }

  return scripts;
}

export function injectTrackingScripts(html: string): string {
  const scripts = getTrackingScripts().filter((script) => {
    const src = script.src.trim();
    const protocolRelative = src.replace(/^https?:/, '');
    return !html.includes(src) && !html.includes(protocolRelative);
  });
  if (scripts.length === 0) return html;

  const scriptTags = scripts.map((script) => {
    const attrs = script.attrs
      ? ' ' + Object.entries(script.attrs).map(([key, val]) => `${key}="${val}"`).join(' ')
      : '';
    return `<script async src="${script.src}"${attrs}></script>`;
  }).join('');

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${scriptTags}</head>`);
  }

  return `${scriptTags}${html}`;
}
