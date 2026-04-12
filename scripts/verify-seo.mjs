import * as cheerio from 'cheerio';

const baseUrl = (process.env.SEO_VERIFY_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

const routes = [
  {
    path: '/',
    expectedTitleLength: [50, 70],
    expectedDescriptionLength: [135, 170],
    expectedH1Count: 1,
    requiredLinks: ['/is-ilanlari', '/haberler', '/topluluk'],
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList', 'FAQPage'],
  },
  {
    path: '/haberler',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/almanyada-yasam',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/banka-secim',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/maas-hesaplama',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/sigorta-secim',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/para-transferi',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/vize-secim',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/stepstone-karsilastirma',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/hizmet-rehberi',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
  {
    path: '/vatandaslik-testi',
    expectedH1Count: 1,
    requiredSchemaTypes: ['WebPage', 'BreadcrumbList'],
  },
];

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchHtml(route) {
  const response = await fetch(`${baseUrl}${route}`);
  ensure(response.ok, `${route} için ${response.status} döndü.`);
  return response.text();
}

function extractSchemaTypes($) {
  return $('script[type="application/ld+json"]')
    .toArray()
    .flatMap((element) => {
      const raw = $(element).html();

      if (!raw) {
        return [];
      }

      try {
        const parsed = JSON.parse(raw);
        const items = Array.isArray(parsed) ? parsed : [parsed];

        return items
          .map((item) => (typeof item === 'object' && item !== null ? item['@type'] : undefined))
          .filter(Boolean);
      } catch (error) {
        throw new Error(`JSON-LD parse edilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      }
    });
}

async function verifyRoute(config) {
  const html = await fetchHtml(config.path);
  const $ = cheerio.load(html);

  if (config.expectedTitleLength) {
    const title = $('title').text().trim();
    ensure(
      title.length >= config.expectedTitleLength[0] && title.length <= config.expectedTitleLength[1],
      `${config.path} title uzunluğu beklenen aralıkta değil: ${title.length}`
    );
  }

  if (config.expectedDescriptionLength) {
    const description = $('meta[name="description"]').attr('content')?.trim() || '';
    ensure(
      description.length >= config.expectedDescriptionLength[0] && description.length <= config.expectedDescriptionLength[1],
      `${config.path} meta description uzunluğu beklenen aralıkta değil: ${description.length}`
    );
  }

  const canonical = $('link[rel="canonical"]').attr('href')?.trim();
  ensure(Boolean(canonical), `${config.path} canonical etiketi eksik.`);

  if (config.expectedH1Count) {
    ensure($('h1').length === config.expectedH1Count, `${config.path} için beklenen H1 sayısı ${config.expectedH1Count}, bulunan ${$('h1').length}.`);
  }

  if (config.requiredLinks) {
    const hrefs = new Set(
      $('a[href]')
        .toArray()
        .map((element) => $(element).attr('href'))
        .filter(Boolean)
    );

    for (const href of config.requiredLinks) {
      ensure(hrefs.has(href), `${config.path} sayfasında gerekli link eksik: ${href}`);
    }
  }

  if (config.requiredSchemaTypes) {
    const types = new Set(extractSchemaTypes($));

    for (const type of config.requiredSchemaTypes) {
      ensure(types.has(type), `${config.path} sayfasında gerekli schema eksik: ${type}`);
    }
  }
}

try {
  for (const route of routes) {
    await verifyRoute(route);
  }

  console.log(`SEO doğrulaması başarılı: ${baseUrl}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}