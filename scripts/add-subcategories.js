const fs = require('fs');

// Anahtar kelimeleri kategoriye eşleştirme
const SUB_CATEGORY_KEYWORDS = {
  'İş Bulma Ajansları': {
    'Üst Düzey Yönetici Arama': ['yönetici', 'yönetim', 'liderlik', 'c seviyesi', 'lider', 'kafa', 'ara'],
    'Genel İşe Alım': ['genel', 'işe alım', 'işgücü', 'personel'],
    'BT & Dijital': ['bt', 'dijital', 'teknoloji', 'yazılım', 'it', 'siber', 'dijital', 'dönüşüm'],
    'Teknoloji & Mühendislik': ['teknoloji', 'mühendislik', 'mühendis', 'teknik'],
    'Finans & Hukuk': ['finans', 'hukuk', 'uyum', 'risk'],
    'Sağlık & Tıp': ['sağlık', 'tıbbi', 'tıp', 'medikal', 'tıbbi'],
    'Enerji & Mühendislik': ['enerji', 'mühendislik', 'yenilenebilir'],
    'İK Danışmanlığı': ['ık', 'ik danışmanlığı', 'kayıt', 'yerleştirme'],
    'Uluslararası': ['uluslararası', 'küresel', 'global', 'iki dilli', 'küresel'],
    'Freelance & Proje': ['freelance', 'proje', 'geçici', 'serbest'],
    'Yaratıcı & Tasarım': ['yaratıcı', 'tasarım', 'ui/ux', 'yaratıcı']
  },
  'İngilizce İşe Alan Şirketler': {
    'Tümü': [],
    'E-ticaret & Moda': ['e-ticaret', 'moda', 'giyim'],
    'Danışmanlık': ['danışmanlık', 'yönetim danışmanlığı'],
    'Fintech & Finans': ['fintech', 'finans', 'ödemeler', 'varlık', 'fintech', 'finansal'],
    'Yapay Zeka & Teknoloji': ['yapay zeka', 'ai', 'teknoloji', 'platformu'],
    'Dil Öğrenme': ['dil öğrenme', 'dil', 'öğrenim', 'bahbel', 'e-öğrenim'],
    'İK Yazılım': ['ık yazılım', 'ık teknolojisi', 'personio', 'ık'],
    'Lojistik': ['lojistik', 'kargo', 'taşıma', 'lojistik'],
    'Sağlık & Tıp Teknolojisi': ['sağlık', 'tıp', 'tıbbi', 'medikal', 'yaşam bilimleri', 'tıp'],
    'Yenilenebilir Enerji': ['enerji', 'karbon', 'yenilenebilir'],
    'Gıda Teknolojisi': ['gıda', 'temiz'],
    'E-öğrenim': ['e-öğrenim', 'elearnio', 'öğrenim'],
    'Siber Güvenlik': ['siber güvenlik', 'güvenlik', 'siber'],
    'Sigorta': ['sigorta', 'sigorta']
  }
};

function detectSubCategory(agency) {
  const { description, category } = agency;
  const subCategories = SUB_CATEGORY_KEYWORDS[category] || {};

  for (const [subCat, keywords] of Object.entries(subCategories)) {
    if (subCat === 'Tümü') continue;
    for (const keyword of keywords) {
      if (description.toLowerCase().includes(keyword.toLowerCase())) {
        return subCat;
      }
    }
  }
  return 'Genel';
}

const filePath = 'constants/recruitment-agencies.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const updatedContent = content.replace(/(\{[\s\S]*?name: '[^']*',[\s\S]*?status: 'active',[\s\S]*?category: '[^']*')/g, (match) => {
  if (match.includes('subCategory')) return match;

  const categoryMatch = match.match(/category: '([^']*)'/);
  if (!categoryMatch) return match;

  const category = categoryMatch[1];
  const descMatch = match.match(/description: '([^']*)'/);
  if (!descMatch) return match;

  const description = descMatch[1];
  const agency = {
    name: '',
    url: '',
    description,
    status: 'active',
    category
  };

  const subCategory = detectSubCategory(agency);
  return match.replace(/category: '([^']*)'/, `category: '$1',\n    subCategory: '${subCategory}'`);
});

fs.writeFileSync(filePath, updatedContent, 'utf-8');
console.log('Subcategories added successfully!');
