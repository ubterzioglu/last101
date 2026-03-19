// Stepstone Gehaltsreport 2026 Verileri
// Source: Stepstone Gehaltsreport 2026 (PDF)

export const STEPSTONE_2026 = {
  overall: { median: 53900, mean: 59100 },

  // Median by experience (page 5)
  experience: {
    "<1": 46250,
    "1-2": 48400,
    "3-5": 51700,
    "6-10": 55500,
    "11-25": 59500,
    ">25": 60000
  },

  // Median by state for all employees (page 7)
  states: {
    SH: 51750,
    MV: 47750,
    HH: 60000,
    BB: 49250,
    HB: 55750,
    BE: 56500,
    NI: 52750,
    ST: 48250,
    NRW: 55250,
    SN: 49000,
    RP: 53250,
    TH: 48500,
    SL: 52750,
    HE: 58250,
    BW: 58500,
    BY: 57750
  },

  // Median by city (page 9)
  cities: {
    "Berlin": 56500,
    "Bremen": 56000,
    "Dresden": 51000,
    "Düsseldorf": 59750,
    "Erfurt": 49500,
    "Hamburg": 60000,
    "Hannover": 56750,
    "Kiel": 54000,
    "Magdeburg": 49500,
    "Mainz": 57250,
    "München": 64750,
    "Potsdam": 52750,
    "Saarbrücken": 55500,
    "Schwerin": 49500,
    "Stuttgart": 63750,
    "Wiesbaden": 60750,
    "Bielefeld": 56000,
    "Bochum": 54000,
    "Dortmund": 55500,
    "Duisburg": 54750,
    "Essen": 55750,
    "Frankfurt am Main": 64000,
    "Köln": 58500,
    "Leipzig": 51250,
    "Nürnberg": 58000,
    "Wuppertal": 55250
  },

  // Median by company size (page 10)
  companySize: {
    "1-50": 48800,
    "51-500": 54100,
    "501-5000": 59750,
    ">5000": 63000
  },

  // Median by education background (page 5)
  education: {
    yes: 68250, // mit Hochschulabschluss
    no: 51200   // ohne Hochschulabschluss
  },

  // Median by personal responsibility (page 5)
  responsibility: {
    yes: 62000,
    no: 51300
  },

  // Median by gender (page 5)
  gender: {
    m: 55900,
    f: 50500
  },

  // Median by job group (page 12)
  jobGroups: {
    "Bildung": 60250,
    "Büromanagement": 47250,
    "Einkauf, Vertrieb & Handel": 60500,
    "Finanzen & Rechnungswesen": 59250,
    "Gaststätten, Hotellerie und Tourismus": 50500,
    "Gebäudetechnik & Versorgung": 51250,
    "Gesundheits- und Pflegeberufe": 53000,
    "Altenpflege": 52250,
    "Arzt- & Praxishilfe": 49000,
    "Human- & Zahnmedizin": 105500,
    "Pflege, Rettung und Geburtshilfe": 58000,
    "Handwerk": 48750,
    "Hoch- & Tiefbau": 54000,
    "Informationstechnologie (IT)": 66750,
    "Ingenieurwesen": 75000,
    "Lebensmittelproduktion": 46500,
    "Logistik & Verkehr": 49750,
    "Marketing, Medien & Kommunikation": 57250,
    "Maschinen- & Fahrzeugtechnik": 57250,
    "Mechatronik & Elektrotechnik": 53500,
    "Metallbau & -verarbeitung": 49500,
    "Personalwesen": 54500,
    "Recht & Verwaltung": 57500,
    "Soziale Berufe": 52500,
    "Technische Entwicklung & Konstruktion": 72250,
    "Unternehmensorganisation und Management": 66750,
    "Verkauf": 48750
  }
};

export const EXPERIENCE_OPTIONS = [
  { value: "<1", label: "< 1 yıl" },
  { value: "1-2", label: "1–2 yıl" },
  { value: "3-5", label: "3–5 yıl" },
  { value: "6-10", label: "6–10 yıl" },
  { value: "11-25", label: "11–25 yıl" },
  { value: ">25", label: "> 25 yıl" },
];

export const COMPANY_SIZE_OPTIONS = [
  { value: "1-50", label: "1–50 çalışan" },
  { value: "51-500", label: "51–500 çalışan" },
  { value: "501-5000", label: "501–5.000 çalışan" },
  { value: ">5000", label: "> 5.000 çalışan" },
];

export const EDUCATION_OPTIONS = [
  { value: "yes", label: "Yükseköğretim var" },
  { value: "no", label: "Yükseköğretim yok" },
];

export const RESPONSIBILITY_OPTIONS = [
  { value: "yes", label: "Var (Personalverantwortung)" },
  { value: "no", label: "Yok" },
];

export const GENDER_OPTIONS = [
  { value: "m", label: "Erkek" },
  { value: "f", label: "Kadın" },
];

export function getSortedJobGroups(): string[] {
  return Object.keys(STEPSTONE_2026.jobGroups).sort((a, b) => a.localeCompare(b, "de"));
}

export function getSortedCities(): string[] {
  return Object.keys(STEPSTONE_2026.cities).sort((a, b) => a.localeCompare(b, "de"));
}
