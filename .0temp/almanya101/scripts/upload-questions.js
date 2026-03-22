
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Config from local file logic (hardcoded for script reliability based on previous read)
const SUPABASE_URL = "https://ldptefnpiudquipdsezr.supabase.co";
const SUPABASE_KEY = "sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadFile(filePath) {
    console.log(`Reading file: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(rawData);

    console.log(`Found ${questions.length} questions. Uploading...`);

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

        console.log(`Upserting question: ${dbItem.eyalet} | ${dbItem.soru_almanca.substring(0, 40)}...`);
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
