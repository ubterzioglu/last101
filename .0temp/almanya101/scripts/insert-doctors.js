// Quick script to insert doctors using Supabase JS client
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const doctors = [
  // Genel Pratisyenler ve Dahiliye
  {"type":"doctor","display_name":"Dr. Süleyman Soytürk - İç Hastalıkları Uzmanı ve Aile Hekimi","city":"Dortmund","address":"Münsterstraße 17, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Turkan Aygül - Dahiliye Uzmanı","city":"Dortmund","address":"Münsterstraße 45, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Ibrahim Güngör - Genel Pratisyen","city":"Dortmund","address":"Rahmer Str. 6, 44369 Dortmund","phone":null,"website":null,"status":"active"},
  // Nöroloji
  {"type":"doctor","display_name":"Berrin Çetin - Nöroloji Uzmanı","city":"Dortmund","address":"Münsterstraße 40, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Ozcan Aslan - Nöroloji","city":"Essen","address":null,"phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Hakan Orbasli - Nervenheilkunde","city":"Bochum","address":null,"phone":null,"website":null,"status":"active"},
  // Ortopedi
  {"type":"doctor","display_name":"Dr. Bülent Ünükür - Ortopedi Uzmanı","city":"Dortmund","address":"Saarlandstraße 86, 44139 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Bahadır Ozaynaci - Ortopedi","city":"Schwelm","address":null,"phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Abdul Rahman Ahmed - Ortopedi Uzmanı","city":"Dortmund","address":"Münsterstraße 40, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  // Göz Hastalıkları
  {"type":"doctor","display_name":"Dr. Deniz Koyuncu - Göz Hastalıkları Uzmanı","city":"Dortmund","address":"Münsterstraße 40, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Salih Cihat Yalman - Göz Hastalıkları Uzmanı","city":"Dortmund","address":"Rheinische Str. 36, 44137 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Aykut Gultekin - Göz Doktoru","city":"Dortmund","address":"Geiststraße","phone":null,"website":null,"status":"active"},
  // Psikiyatri ve Psikoterapi
  {"type":"doctor","display_name":"Dipl. Psych. A. Yavuz - Psikoterapist","city":"Dortmund","address":"Körner Hellweg 91-93, 44143 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Emine Top-Kischewski - Psikoterapist","city":"Dortmund","address":"Alte Benninghofer Str. 13, 44263 Dortmund","phone":null,"website":null,"status":"active"},
  // Kadın Hastalıkları ve Doğum
  {"type":"doctor","display_name":"Dr. Hüseyin Aynur - Kadın Doğum Uzmanı","city":"Dortmund","address":"Oesterholzstraße 71, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Antje Huster-Sinemillioğlu - Kadın Doğum Uzmanı","city":"Dortmund","address":"Wilhelmpl. 6, 44149 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Hakan Türk - Jinekoloji","city":"Bochum","address":null,"phone":null,"website":null,"status":"active"},
  // Kulak Burun Boğaz (KBB)
  {"type":"doctor","display_name":"Dr. Ceyhun Doğan - KBB Uzmanı","city":"Dortmund","address":"Münsterstraße 17, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Ender Öztürk - HNO","city":"Schwerte","address":null,"phone":null,"website":null,"status":"active"},
  // Diş Hekimleri
  {"type":"doctor","display_name":"Dr. Ali Osman - Diş Hekimi","city":"Dortmund","address":"Münsterstraße 205, 44145 Dortmund","phone":"0231 53226767","website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Muammer Çetin - Diş Hekimi","city":"Dortmund","address":"Münsterstraße 40, 44145 Dortmund","phone":null,"website":null,"status":"active"},
  // Üroloji
  {"type":"doctor","display_name":"Dr.med. H.Zenginli - Hausarzt/Urologie & Privatpraxis","city":"Dortmund-Eving","address":null,"phone":null,"website":null,"status":"active"},
  {"type":"doctor","display_name":"Dr. Celik - Specialist in General Medicine and Urologie","city":"Dortmund","address":"Oesterholzstraße 34, 44145 Dortmund","phone":null,"website":null,"status":"active"}
];

async function insertDoctors() {
  try {
    console.log('🚀 Starting doctor insertion...');
    
    const { data, error } = await supabase
      .from('providers')
      .insert(doctors)
      .select();

    if (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }

    console.log('✅ Successfully inserted', data.length, 'doctors!');
    console.log('📊 Inserted doctors:', data.map(d => d.display_name).join('\n'));
    
  } catch (err) {
    console.error('❌ Exception:', err);
    process.exit(1);
  }
}

insertDoctors();
