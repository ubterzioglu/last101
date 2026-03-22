
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Updated with SERVICE ROLE KEY from .env (lines 18-19 of .env)
const SUPABASE_URL = "https://ldptefnpiudquipdsezr.supabase.co";
// CAUTION: This is a secret key. In a real app we'd load from process.env, 
// but for this local agent script, we are hardcoding as requested/found.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadFile(filePath) {
    console.log(`Reading file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(rawData);

    console.log(`Found ${questions.length} questions. Uploading with Service Role...`);

    let successCount = 0;
    let failCount = 0;

    for (const q of questions) {
        // Map to DB Schema
        const dbItem = {
            soru_almanca: q.question_german,
            soru_turkce: q.question_turkish || '',
            secenekler: q.options,
            dogru_cevap: q.correct_answer,
            image_url: q.image_url,
            eyalet: q.state || 'Genel'
        };

        console.log(`Upserting: ${dbItem.eyalet} | ${dbItem.soru_almanca.substring(0, 40)}...`);
        const result = await supabase
            .from('vatandaslik_sorulari')
            .upsert(dbItem, { onConflict: 'eyalet,soru_almanca' });

        if (result.error) {
            console.error(`Error processing question: ${dbItem.soru_almanca}`, result.error);
            failCount++;
        } else {
            successCount++;
        }
    }

    console.log(`Upload complete. Success: ${successCount}, Failed: ${failCount}`);
}

const targetFile = process.argv[2];
if (!targetFile) {
    console.error("Please provide a JSON file path.");
    process.exit(1);
}

uploadFile(targetFile);
