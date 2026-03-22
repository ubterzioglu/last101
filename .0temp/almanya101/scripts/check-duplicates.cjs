
const fs = require('fs');
const path = require('path');

const files = [
    'foradmin/jason/vatandas_page_1_ready.json',
    'foradmin/jason/vatandas_page_2_ready.json',
    'foradmin/jason/vatandas_page_3_ready.json',
    'foradmin/jason/vatandas_page_4_ready.json',
    'foradmin/jason/vatandas_page_5_ready.json',
    'foradmin/jason/vatandas_page_6_ready.json',
    'foradmin/jason/vatandas_page_7_ready.json',
    'foradmin/jason/vatandas_page_8_ready.json',
    'foradmin/jason/vatandas_page_9_ready.json',
    'foradmin/jason/vatandas_page_10_ready.json'
];

let allQuestions = [];
let questionMap = new Map();
let duplicates = [];

files.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
        const questions = JSON.parse(content);
        questions.forEach(q => {
            allQuestions.push(q);
            if (questionMap.has(q.question_german)) {
                duplicates.push({
                    text: q.question_german,
                    page1: questionMap.get(q.question_german),
                    page2: q.source_page
                });
            } else {
                questionMap.set(q.question_german, q.source_page);
            }
        });
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

console.log(`Total questions in files: ${allQuestions.length}`);

// Count occurrences
let counts = {};
allQuestions.forEach(q => {
    counts[q.question_german] = (counts[q.question_german] || 0) + 1;
});

console.log("\nHigh Frequency Questions:");
Object.keys(counts).forEach(key => {
    if (counts[key] > 1) {
        console.log(`- "${key.substring(0, 50)}...": ${counts[key]} occurrences`);
    }
});
