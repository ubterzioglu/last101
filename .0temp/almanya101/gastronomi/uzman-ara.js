// =====================================================
// UZMAN ARA - Scope isolated version
// =====================================================

(function() {
  'use strict';

  // Supabase Configuration
  const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI';

  // Initialize Supabase client (local to this scope)
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // State
  let currentType = 'restaurant';
  let selectedCity = '';
  let selectedTags = [];
  let allProviders = [];
  let allTags = [];
  let searchQuery = '';
  let allProvidersSearch = [];
  let searchIndex = null;
  let tagsById = {};
  let searchReady = false;

  // =====================================================
  // INITIALIZATION
  // =====================================================
  document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initSearch();
    loadSearchIndex();
    loadData();
    loadStats();
  });

  // =====================================================
  // LOAD STATS (İstatistikler)
  // =====================================================
  async function loadStats() {
    try {
      const types = ['restaurant', 'market', 'kasap'];

      let total = 0;

      for (const type of types) {
        const { count, error } = await supabase
          .from('gastronomy_providers')
          .select('*', { count: 'exact', head: true })
          .eq('type', type)
          .eq('status', 'active');

        if (!error) {
          const countVal = count || 0;
          total += countVal;
          const el = document.getElementById(`stat-${type}`);
          if (el) el.textContent = countVal;
        }
      }

      const totalEl = document.getElementById('stat-total');
      if (totalEl) totalEl.textContent = total;

    } catch (error) {
      console.error('Stats error:', error);
    }
  }

  // =====================================================
  // INIT FILTERS
  // =====================================================
  function initFilters() {
    // Type selector (Gastronomi buttons)
    const typeOptions = document.querySelectorAll('.type-option');
    typeOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selected from all
        typeOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selected to clicked
        option.classList.add('selected');

        // Update current type
        currentType = option.dataset.type;

        // Reset and reload
        selectedTags = [];
        selectedCity = '';
        const citySelect = document.getElementById('citySelect');
        if (citySelect) {
          citySelect.value = '';
        }
        loadData();
      });
    });

    // City selector
    const citySelect = document.getElementById('citySelect');
    citySelect.addEventListener('change', (e) => {
      selectedCity = e.target.value;
      filterAndRender();
    });
  }

  // Search input
  function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterAndRender();
    });
  }

  // =====================================================
  // LOAD DATA
  // =====================================================
  async function loadData() {
    try {
      console.log('Loading providers from Supabase...');

      let providers = [];

      // Load providers for current type
      const { data, error: providersError } = await supabase
        .from('gastronomy_providers')
        .select(`
          *,
          gastronomy_provider_tags(tag_id)
        `)
        .eq('type', currentType)
        .eq('status', 'active');

      if (providersError) {
        console.error('Error loading providers:', providersError);
        showError('Kayıtlar yüklenirken hata oluştu: ' + providersError.message);
        return;
      }

      providers = data || [];

      // Load tags for current type
      const { data: tags, error: tagsError } = await supabase
        .from('gastronomy_tags')
        .select('*')
        .eq('type', currentType);

      if (tagsError) {
        console.error('Error loading tags:', tagsError);
      } else {
        allTags = tags || [];
        console.log('Tags loaded:', allTags);
      }

      console.log('Providers loaded:', providers);
      allProviders = providers || [];

      // Populate city dropdown
      populateCityDropdown();

      // Render tags
      renderTags();

      // Render
      filterAndRender();

    } catch (error) {
      console.error('Unexpected error:', error);
      showError('Beklenmeyen bir hata oluştu: ' + error.message);
    }
  }

  // =====================================================
  // LOAD SEARCH INDEX (ALL PROVIDERS
  // =====================================================
  async function loadSearchIndex() {
    if (!window.Fuse) {
      console.warn('Fuse.js not loaded; search will be basic.');
    }

    try {
      const { data: tags, error: tagsError } = await supabase
        .from('gastronomy_tags')
        .select('*');

      if (!tagsError && tags) {
        tagsById = tags.reduce((acc, tag) => {
          acc[tag.id] = tag.label;
          return acc;
        }, {});
      }

      const { data: providers, error: providersError } = await supabase
        .from('gastronomy_providers')
        .select(`
          *,
          gastronomy_provider_tags(tag_id)
        `)
        .eq('status', 'active');

      if (providersError) {
        console.error('Error loading providers for search:', providersError);
        return;
      }

      const mapped = (providers || []).map(provider => ({
        ...provider,
        _tagsText: (provider.gastronomy_provider_tags || [])
          .map(pt => tagsById[pt.tag_id])
          .filter(Boolean)
          .join(' ')
      }));

      allProvidersSearch = mapped;

      if (window.Fuse) {
        searchIndex = new window.Fuse(allProvidersSearch, {
          includeScore: true,
          shouldSort: true,
          threshold: 0.35,
          ignoreLocation: true,
          minMatchCharLength: 2,
          keys: [
            { name: 'city', weight: 0.45 },
            { name: 'display_name', weight: 0.3 },
            { name: 'address', weight: 0.2 },
            { name: '_tagsText', weight: 0.2 },
            { name: 'phone', weight: 0.1 },
            { name: 'website', weight: 0.1 },
            { name: 'notes_public', weight: 0.1 },
            { name: 'google_place_id', weight: 0.05 },
            { name: 'google_maps_url', weight: 0.05 },
            { name: 'type', weight: 0.1 }
          ]
        });
        searchReady = true;
        if (searchQuery) {
          filterAndRender();
        }
      }
    } catch (error) {
      console.error('Search index error:', error);
    }
  }

  // =====================================================
  // POPULATE CITY DROPDOWN
  // =====================================================
  function populateCityDropdown() {
    const citySelect = document.getElementById('citySelect');

    // Get unique cities from providers
    const cities = [...new Set(allProviders.map(p => p.city))].sort();

    // Clear existing options (except "Tümü")
    citySelect.innerHTML = '<option value="">Tümü</option>';

    // Add city options
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }

  // =====================================================
  // FILTER AND RENDER
  // =====================================================
  function filterAndRender() {
    if (searchQuery && searchReady && searchIndex) {
      const results = searchIndex.search(searchQuery);
      const query = searchQuery.toLowerCase();
      const items = results.map(r => ({
        ...r.item,
        _score: r.score ?? 1
      }));

      items.sort((a, b) => {
        const aCity = (a.city || '').toLowerCase();
        const bCity = (b.city || '').toLowerCase();
        const aCityMatch = aCity.includes(query) ? 1 : 0;
        const bCityMatch = bCity.includes(query) ? 1 : 0;
        if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;
        return (a._score ?? 1) - (b._score ?? 1);
      });

      renderProviders(items);
      return;
    }

    let filtered = [...allProviders];

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    // Filter by tags (OR logic)
    if (selectedTags.length > 0) {
      filtered = filtered.filter(provider => {
        const providerTagIds = (provider.gastronomy_provider_tags || []).map(pt => pt.tag_id);
        return selectedTags.some(tagId => providerTagIds.includes(tagId));
      });
    }

    // Render
    renderProviders(filtered);
  }

  // =====================================================
  // TAG FILTER
  // =====================================================
  function renderTags() {
    const section = document.getElementById('tagFilterSection');
    const container = document.getElementById('tagContainer');

    if (!section || !container) return;

    if (allTags.length === 0) {
      section.classList.add('hidden');
      container.innerHTML = '';
      return;
    }

    section.classList.remove('hidden');
    container.innerHTML = '';

    allTags.forEach(tag => {
      const chip = document.createElement('div');
      chip.className = 'tag-chip';
      chip.textContent = tag.label;
      chip.dataset.tagId = tag.id;

      if (selectedTags.includes(tag.id)) {
        chip.classList.add('selected');
      }

      chip.addEventListener('click', () => {
        toggleTag(tag.id);
        chip.classList.toggle('selected');
        filterAndRender();
      });

      container.appendChild(chip);
    });
  }

  function toggleTag(tagId) {
    const index = selectedTags.indexOf(tagId);
    if (index > -1) {
      selectedTags.splice(index, 1);
    } else {
      selectedTags.push(tagId);
    }
  }

  // =====================================================
  // RENDER PROVIDERS
  // =====================================================
  function renderProviders(providers) {
    const list = document.getElementById('providersList');
    const count = document.getElementById('resultsCount');

    count.textContent = `${providers.length} sonuç bulundu`;

    if (providers.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 40px; margin-bottom: 12px;">📭</div>
          <p>Henüz kayıt yok.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = '';
    providers.forEach(provider => {
      const card = createProviderCard(provider);
      list.appendChild(card);
    });
  }

  // =====================================================
  // CREATE PROVIDER CARD
  // =====================================================
  function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card';

    // Name
    const name = document.createElement('div');
    name.className = 'provider-name';
    name.textContent = provider.display_name;
    card.appendChild(name);

    // Rating (if available)
    if (provider.google_rating !== null && provider.google_rating !== undefined) {
      const rating = document.createElement('div');
      rating.className = 'provider-rating';
      rating.innerHTML = `
        ⭐ ${provider.google_rating.toFixed(1)}
        <span style="color: #9CA3AF;">(${provider.google_user_ratings_total || 0})</span>
      `;
      card.appendChild(rating);
    }

    // Address
    if (provider.address || provider.city) {
      const address = document.createElement('div');
      address.className = 'provider-address';
      address.textContent = provider.address || provider.city;
      card.appendChild(address);
    }

    // Actions row
    const actions = document.createElement('div');
    actions.className = 'provider-actions';

    // Ara button (sarı if phone exists)
    const araBtn = document.createElement('button');
    araBtn.className = 'btn-action';
    araBtn.textContent = '📞 Ara';
    if (provider.phone) {
      araBtn.classList.add('btn-ara-active');
      araBtn.onclick = () => window.open(`tel:${provider.phone}`, '_self');
    } else {
      araBtn.classList.add('btn-disabled');
      araBtn.disabled = true;
    }
    actions.appendChild(araBtn);

    // Web button (yeşil if website exists)
    const webBtn = document.createElement('button');
    webBtn.className = 'btn-action';
    webBtn.textContent = '🌐 Web';
    if (provider.website) {
      webBtn.classList.add('btn-active');
      webBtn.onclick = () => window.open(provider.website, '_blank');
    } else {
      webBtn.classList.add('btn-disabled');
      webBtn.disabled = true;
    }
    actions.appendChild(webBtn);

    // Maps button
    const mapsBtn = document.createElement('button');
    mapsBtn.className = 'btn-action';
    mapsBtn.textContent = '📍 Maps';
    if (provider.google_maps_url) {
      mapsBtn.classList.add('btn-maps-active');
      mapsBtn.onclick = () => window.open(provider.google_maps_url, '_blank');
    } else {
      mapsBtn.classList.add('btn-disabled');
      mapsBtn.disabled = true;
    }
    actions.appendChild(mapsBtn);

    card.appendChild(actions);

    return card;
  }

  // =====================================================
  // ERROR DISPLAY
  // =====================================================
  function showError(message) {
    const list = document.getElementById('providersList');
    list.innerHTML = `
      <div style="color: #BF0000; text-align: center; padding: 20px;">
        ${message}
      </div>
    `;
  }

})();
