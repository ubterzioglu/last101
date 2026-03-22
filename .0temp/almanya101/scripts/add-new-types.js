// Database migration: Add new provider types
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addNewTypes() {
    try {
        console.log('🚀 Adding new provider types...\n');

        // Note: PostgreSQL enum types need to be altered via raw SQL
        // Supabase JS client doesn't support ALTER TYPE directly
        // We'll use the SQL editor or run via rpc

        const sql = `
      ALTER TYPE provider_type ADD VALUE IF NOT EXISTS 'surucu_kursu';
    `;

        console.log('⚠️  Note: Enum types must be altered via Supabase SQL Editor');
        console.log('📋 Run this SQL in Supabase Dashboard:\n');
        console.log(sql);
        console.log('\n🔗 https://supabase.com/dashboard/project/ldptefnpiudquipdsezr/editor\n');

        // Test if we can insert with new types (will fail if enum not updated)
        console.log('🧪 Testing new type insertion...\n');

        const testData = [
            { type: 'surucu_kursu', display_name: 'Test Sürücü Kursu', city: 'Berlin', status: 'active' }
        ];

        for (const data of testData) {
            const { error } = await supabase
                .from('providers')
                .insert([data])
                .select();

            if (error) {
                if (error.message.includes('invalid input value for enum')) {
                    console.log(`❌ ${data.type}: Enum not updated yet - run SQL first!`);
                } else {
                    console.log(`❌ ${data.type}: ${error.message}`);
                }
            } else {
                console.log(`✅ ${data.type}: Successfully inserted!`);
            }
        }

    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

addNewTypes();
