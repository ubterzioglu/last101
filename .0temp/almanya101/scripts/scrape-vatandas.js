
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.einbuergerungstest-online.eu/fragen/';

async function scrapePage(pageNum) {
    const url = pageNum === 1 ? BASE_URL : `${BASE_URL}${pageNum}/`;
    console.log(`Fetching ${url}...`);

    try {
        const response = await fetch(url);
        const html = await response.text();

        // Split by question blocks
        const questionBlocks = html.split('<div class="row" id="frage-');
        // Remove the first chunk (header stuff)
        questionBlocks.shift();

        const questions = [];

        for (const block of questionBlocks) {
            try {
                // 1. Extract Question Text
                // Format: <p><a href="...">TEXT</a></p> OR <p>TEXT</p>
                let questionText = '';
                const qTextMatch = block.match(/<div class="questions-question-text">[\s\S]*?<p>(?:<a[^>]*>)?(.*?)(?:<\/a>)?<\/p>/);
                if (qTextMatch) {
                    questionText = qTextMatch[1].replace(/<[^>]+>/g, '').trim(); // Remove any inner tags
                }

                // 2. Extract Image
                let imageUrl = null;
                const imgMatch = block.match(/<img[^>]*src="([^"]+)"[^>]*>/); // Simple check in the block
                // Specifically look for images inside the question text area if needed, but usually they are there.
                // The provided HTML shows: <p><a href="/img/fragen/021.png" ...>Bild anzeigen</a></p> OR just img src.
                // In temp_page_1: <a href="/img/fragen/021.png" data-lightbox="...">Bild anzeigen</a>
                // Actually the site has links to images: href="/img/fragen/021.png"
                const imgLinkMatch = block.match(/href="(\/img\/fragen\/[^"]+)"/);
                if (imgLinkMatch) {
                    imageUrl = 'https://www.einbuergerungstest-online.eu' + imgLinkMatch[1];
                }

                // 3. Extract Options and Correct Answer
                // Options are in <ul class="list-unstyled question-answers-list"> ... </ul>
                const optionsBlockMatch = block.match(/<ul class="list-unstyled question-answers-list">([\s\S]*?)<\/ul>/);
                const options = {};
                let correctLetter = '';

                if (optionsBlockMatch) {
                    const lis = optionsBlockMatch[1].split('</li>');
                    const letters = ['a', 'b', 'c', 'd'];
                    let currentOptionIdx = 0;

                    for (const li of lis) {
                        if (li.trim() === '' || currentOptionIdx > 3) continue;

                        // Check if correct
                        const isCorrect = li.includes('question-answer-right');
                        // Clean text
                        let text = li.replace(/<[^>]+>/g, '').trim();
                        // Remove leading bullets if any (regex clean)

                        if (text) {
                            const letter = letters[currentOptionIdx];
                            options[letter] = text;
                            if (isCorrect) correctLetter = letter;
                            currentOptionIdx++;
                        }
                    }
                }

                if (questionText && Object.keys(options).length > 0) {
                    questions.push({
                        question_german: questionText,
                        // question_turkish: "", // To be filled
                        image_url: imageUrl,
                        options: options,
                        correct_answer: correctLetter,
                        source_page: pageNum
                    });
                }

            } catch (err) {
                console.error("Error parsing block:", err);
            }
        }

        return questions;

    } catch (error) {
        console.error(`Failed to fetch page ${pageNum}:`, error);
        return [];
    }
}

async function run() {
    const pageArg = process.argv[2] || '1';
    const pageNum = parseInt(pageArg);
    const questions = await scrapePage(pageNum);

    console.log(`Extracted ${questions.length} questions from page ${pageNum}.`);

    const outputPath = path.resolve(process.cwd(), `foradmin/jason/vatandas_page_${pageNum}_raw.json`);
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`Saved to ${outputPath}`);
}

run();
