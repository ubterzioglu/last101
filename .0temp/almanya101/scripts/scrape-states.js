
import fs from 'fs';

const codeToState = {
    bw: 'Baden-Württemberg',
    by: 'Bayern',
    be: 'Berlin',
    bb: 'Brandenburg',
    hb: 'Bremen',
    hh: 'Hamburg',
    he: 'Hessen',
    mv: 'Mecklenburg-Vorpommern',
    ni: 'Niedersachsen',
    nw: 'Nordrhein-Westfalen',
    rp: 'Rheinland-Pfalz',
    sl: 'Saarland',
    sn: 'Sachsen',
    st: 'Sachsen-Anhalt',
    sh: 'Schleswig-Holstein',
    th: 'Thüringen'
};

const urls = [
    'https://www.einbuergerungstest-online.eu/fragen/bw/',
    'https://www.einbuergerungstest-online.eu/fragen/by/',
    'https://www.einbuergerungstest-online.eu/fragen/be/',
    'https://www.einbuergerungstest-online.eu/fragen/bb/',
    'https://www.einbuergerungstest-online.eu/fragen/hb/',
    'https://www.einbuergerungstest-online.eu/fragen/hh/',
    'https://www.einbuergerungstest-online.eu/fragen/he/',
    'https://www.einbuergerungstest-online.eu/fragen/mv/',
    'https://www.einbuergerungstest-online.eu/fragen/ni/',
    'https://www.einbuergerungstest-online.eu/fragen/nw/',
    'https://www.einbuergerungstest-online.eu/fragen/rp/',
    'https://www.einbuergerungstest-online.eu/fragen/sl/',
    'https://www.einbuergerungstest-online.eu/fragen/sn/',
    'https://www.einbuergerungstest-online.eu/fragen/st/',
    'https://www.einbuergerungstest-online.eu/fragen/sh/',
    'https://www.einbuergerungstest-online.eu/fragen/th/'
];

function decodeHtml(text) {
    return text
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&uuml;/g, 'ü')
        .replace(/&ouml;/g, 'ö')
        .replace(/&auml;/g, 'ä')
        .replace(/&szlig;/g, 'ß')
        .replace(/&Uuml;/g, 'Ü')
        .replace(/&Ouml;/g, 'Ö')
        .replace(/&Auml;/g, 'Ä')
        .replace(/\s+/g, ' ')
        .trim();
}

function stripTags(html) {
    return decodeHtml(html.replace(/<[^>]*>/g, ' '));
}

function getCodeFromUrl(url) {
    const parts = url.split('/').filter(Boolean);
    return parts[parts.length - 1];
}

function extractRowBlocks(html) {
    const rows = [];
    const marker = '<div class="row" id="frage-';
    const parts = html.split(marker);
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const idEnd = part.indexOf('"');
        if (idEnd < 0) continue;
        const questionId = part.slice(0, idEnd);
        let block = part.slice(idEnd + 2);

        const cutMarkers = [
            '<div class="questions-question-stats">',
            '<div class="search-box',
            '<div class="pagination">',
            '<div class="container">',
            '<div id="traffective-ad'
        ];
        let cutIndex = -1;
        for (const marker of cutMarkers) {
            const idx = block.indexOf(marker);
            if (idx !== -1 && (cutIndex === -1 || idx < cutIndex)) {
                cutIndex = idx;
            }
        }
        if (cutIndex !== -1) {
            block = block.slice(0, cutIndex);
        }

        rows.push({ questionId, block });
    }
    return rows;
}

function extractQuestionText(block) {
    const match = block.match(/questions-question-text[\s\S]*?<p>([\s\S]*?)<\/p>/);
    if (!match) return 'Unknown Question';
    return stripTags(match[1]);
}

function extractImageUrl(block) {
    const imgMatch = block.match(/<a href="([^"]+)"[^>]*data-lightbox="image-\d+"/);
    if (!imgMatch) return null;
    return `https://www.einbuergerungstest-online.eu${imgMatch[1]}`;
}

function extractOptions(block) {
    const ulMatch = block.match(/<ul class="list-unstyled question-answers-list">([\s\S]*?)<\/ul>/);
    if (!ulMatch) {
        return { options: {}, correct: null };
    }
    const optionMatches = [...ulMatch[1].matchAll(/<li>([\s\S]*?)<\/li>/g)];
    const letters = ['a', 'b', 'c', 'd'];
    const options = {};
    let correct = null;

    optionMatches.forEach((optMatch, index) => {
        if (index > 3) return;
        let raw = optMatch[1];
        if (raw.includes('question-answer-right')) {
            correct = letters[index];
            raw = raw.replace(/<span class="question-answer-right">([\s\S]*?)<\/span>/, '$1');
        }
        options[letters[index]] = stripTags(raw);
    });

    return { options, correct };
}

async function translateText(text) {
    if (!text) return '';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Translate failed: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) return '';
    return decodeHtml(data[0].map((part) => part[0]).join(''));
}

async function scrapeState(url) {
    const code = getCodeFromUrl(url);
    const name = codeToState[code] || code;
    console.log(`Scraping ${name} (${code}) from ${url}...`);

    try {
        const response = await fetch(url);
        const html = await response.text();
        const rows = extractRowBlocks(html);
        const questions = [];
        const translationCache = new Map();

        for (const { questionId, block } of rows) {
            const questionText = extractQuestionText(block);
            const imageUrl = extractImageUrl(block);
            const { options, correct } = extractOptions(block);

            let questionTurkish = translationCache.get(questionText);
            if (questionTurkish === undefined) {
                try {
                    questionTurkish = await translateText(questionText);
                } catch (error) {
                    console.error(`  -> Translate failed (${name} ${questionId}):`, error.message || error);
                    questionTurkish = '';
                }
                translationCache.set(questionText, questionTurkish);
                await new Promise((resolve) => setTimeout(resolve, 200));
            }

            questions.push({
                question_german: questionText,
                question_turkish: questionTurkish,
                image_url: imageUrl,
                options,
                correct_answer: correct,
                state: name,
                source_code: code,
                source_question_id: questionId
            });
        }

        console.log(`  -> Found ${questions.length} questions for ${name}.`);
        return questions;
    } catch (error) {
        console.error(`  -> Error scraping ${name}:`, error);
        return [];
    }
}

async function run() {
    const allStateQuestions = [];

    for (const url of urls) {
        const stateQuestions = await scrapeState(url);
        allStateQuestions.push(...stateQuestions);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    fs.writeFileSync('foradmin/jason/vatandas_states_raw.json', JSON.stringify(allStateQuestions, null, 2));
    console.log(`\nSaved ${allStateQuestions.length} state questions to foradmin/jason/vatandas_states_raw.json`);
}

run();
