/* =========================================================
   ZGEN – Supabase Data Loader
   Bu dosya Supabase'den veriyi çeker ve ZGEN_DATA formatına dönüştürür
   ========================================================= */

(async function loadZGENDataFromSupabase() {
  // Supabase config kontrolü
  const cfg = window.ALMANYA101_SUPABASE || {};
  if (!cfg.url || !cfg.anonKey) {
    console.warn('ZGEN: Supabase config bulunamadı, fallback olarak zgen-data.js kullanılacak');
    return false;
  }

  // Supabase kütüphanesi kontrolü
  if (typeof supabase === 'undefined') {
    console.warn('ZGEN: Supabase kütüphanesi yüklenemedi, fallback olarak zgen-data.js kullanılacak');
    return false;
  }

  try {
    const supabaseClient = supabase.createClient(cfg.url, cfg.anonKey);

    // 1. Generations verisini çek
    const { data: generations, error: genError } = await supabaseClient
      .from('zgen_generations')
      .select('*')
      .order('range_start', { ascending: true });

    if (genError) {
      console.error('ZGEN: Generations yüklenirken hata:', genError);
      return false;
    }

    // 2. Profiles verisini çek
    const { data: profiles, error: profError } = await supabaseClient
      .from('zgen_profiles')
      .select('*');

    if (profError) {
      console.error('ZGEN: Profiles yüklenirken hata:', profError);
      return false;
    }

    // 3. Compatibility verisini çek
    const { data: compat, error: compatError } = await supabaseClient
      .from('zgen_compat')
      .select('*');

    if (compatError) {
      console.error('ZGEN: Compatibility yüklenirken hata:', compatError);
      return false;
    }

    // Veriyi ZGEN_DATA formatına dönüştür
    const ZGEN_DATA = {
      generations: generations.map(g => ({
        id: g.id,
        name: g.name,
        range: [g.range_start, g.range_end],
        avatars: {
          m: g.avatar_m 
            ? (g.avatar_m.startsWith('../') || g.avatar_m.startsWith('/') || g.avatar_m.startsWith('http')) 
              ? g.avatar_m 
              : `../img/generations/${g.avatar_m}`
            : "../img/generations/gen_silent_m.jpg",
          f: g.avatar_f 
            ? (g.avatar_f.startsWith('../') || g.avatar_f.startsWith('/') || g.avatar_f.startsWith('http'))
              ? g.avatar_f
              : `../img/generations/${g.avatar_f}`
            : "../img/generations/gen_silent_f.jpg"
        },
        avatarAlt: g.avatar_alt || g.name + " avatarı"
      })),
      profiles: {},
      compat: {}
    };

    // Profiles'ı dönüştür
    profiles.forEach(p => {
      ZGEN_DATA.profiles[p.gen_id] = {
        traits: p.traits || [],
        vibes: p.vibes || []
      };
    });

    // Compatibility'yi dönüştür
    compat.forEach(c => {
      if (!ZGEN_DATA.compat[c.from_gen_id]) {
        ZGEN_DATA.compat[c.from_gen_id] = {};
      }
      ZGEN_DATA.compat[c.from_gen_id][c.to_gen_id] = {
        dos: c.dos || [],
        donts: c.donts || []
      };
    });

    // Global'e ata
    window.ZGEN_DATA = ZGEN_DATA;

    console.log('ZGEN: Veriler Supabase\'den başarıyla yüklendi');
    return true;

  } catch (error) {
    console.error('ZGEN: Supabase yükleme hatası:', error);
    return false;
  }
})();
