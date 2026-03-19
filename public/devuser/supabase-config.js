// =========================================================
// FILE: supabase-config.js
// PURPOSE: Load Supabase config from server at runtime
// =========================================================

(function () {
  'use strict';

  let config = null;

  async function loadConfig(options = {}) {
    const force = Boolean(options && options.force);
    if (config && !force) return config;

    try {
      // Calculate API path based on current page depth
      const path = window.location.pathname;
      const depth = (path.match(/\//g) || []).length - 1;
      const prefix = depth > 0 ? '../'.repeat(depth) : './';
      const apiPath = prefix + 'api/supabase-config';

      const res = await fetch(apiPath, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (!res.ok) throw new Error('Config fetch failed: ' + res.status);

      config = await res.json();
      window.ALMANYA101_SUPABASE = config;
      return config;
    } catch (e) {
      console.error('Supabase config error:', e);
      window.ALMANYA101_SUPABASE_ERROR = e.message;
      throw e;
    }
  }

  // Helper for async usage
  window.ALMANYA101 = {
    loadConfig,
    getConfig: () => config,
    isReady: () => !!config,
    waitForConfig: async (timeout = 5000) => {
      const start = Date.now();
      while (!config) {
        if (Date.now() - start < 250) {
          await loadConfig().catch(() => {});
        }
        if (Date.now() - start > timeout) throw new Error('Config timeout');
        await new Promise(r => setTimeout(r, 50));
      }
      return config;
    }
  };

  // Auto-load on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadConfig());
  } else {
    loadConfig();
  }
})();
