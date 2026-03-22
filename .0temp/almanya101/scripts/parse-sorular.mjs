import fs from "fs";
import path from "path";

const root = process.cwd();
const inputPath = path.join(root, "docs", "sorular.md");
const outputPath = path.join(root, "data", "vatandaslik_sorulari.raw.json");

const raw = fs.readFileSync(inputPath, "utf8");
const lines = raw.split(/\r?\n/).map((l) => l.trim());

const UNSPLASH_PLACEHOLDER = "https://source.unsplash.com/800x450/?germany,flag";

let currentEyalet = "Genel";
let currentQuestion = null;
let questions = [];

function isSectionLine(line) {
  return line.startsWith("Teil I Allgemeine Fragen") || line.startsWith("Teil II Fragen für das Bundesland");
}

function isPageLine(line) {
  return /^Seite\s+\d+\s+von\s+\d+/i.test(line);
}

function startQuestion(text) {
  currentQuestion = {
    questionLines: text ? [text] : [],
    options: [],
    eyalet: currentEyalet,
  };
}

function finalizeQuestion() {
  if (!currentQuestion) return;
  const questionText = currentQuestion.questionLines.join(" ").replace(/\s+/g, " ").trim();
  if (!questionText || currentQuestion.options.length < 2) {
    currentQuestion = null;
    return;
  }

  const options = currentQuestion.options.slice(0, 4);
  if (options.length < 2) {
    currentQuestion = null;
    return;
  }

  const secenekler = {};
  const keys = ["a", "b", "c", "d"];
  options.forEach((opt, idx) => {
    secenekler[keys[idx]] = opt;
  });

  const hasImage = /\bBild\s*\d+\b/i.test(questionText) || options.some((opt) => /\bBild\s*\d+\b/i.test(opt));

  questions.push({
    soru_almanca: questionText,
    soru_turkce: "",
    secenekler,
    dogru_cevap: "",
    eyalet: currentQuestion.eyalet,
    image_url: hasImage ? UNSPLASH_PLACEHOLDER : null,
  });

  currentQuestion = null;
}

for (const line of lines) {
  if (!line) continue;
  if (isPageLine(line)) continue;

  if (line.startsWith("Teil I Allgemeine Fragen")) {
    finalizeQuestion();
    currentEyalet = "Genel";
    continue;
  }

  if (line.startsWith("Teil II Fragen für das Bundesland")) {
    finalizeQuestion();
    currentEyalet = line.replace("Teil II Fragen für das Bundesland", "").trim();
    continue;
  }

  if (/^Aufgabe\s+\d+/i.test(line)) {
    finalizeQuestion();
    startQuestion();
    continue;
  }

  if (line.startsWith("□")) {
    if (!currentQuestion) startQuestion();
    const opt = line.replace(/^□\s*/, "").trim();
    if (opt) currentQuestion.options.push(opt);
    if (currentQuestion.options.length >= 4) {
      finalizeQuestion();
    }
    continue;
  }

  if (!currentQuestion) {
    startQuestion(line);
  } else {
    currentQuestion.questionLines.push(line);
  }
}

finalizeQuestion();

fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), "utf8");

console.log(`Toplam soru: ${questions.length}`);
console.log(`Çıktı: ${outputPath}`);
