(() => {
  // ---------- CONFIG ----------
  const SUPABASE_URL = "https://ldptefnpiudquipdsezr.supabase.co";
  const SUPABASE_ANON_KEY =
    "sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI";

  // ---------- HELPERS ----------
  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ---------- GLOBAL DATA ----------
  let allQuestions = [];

  // ---------- LOAD QA DATA ----------
  async function loadQA() {
    try {
      // Fetch all questions with pagination (Supabase default limit is 1000)
      let allData = [];
      let offset = 0;
      const limit = 1000;
      let hasMore = true;

      while (hasMore) {
        const url =
          `${SUPABASE_URL}/rest/v1/qa1` +
          `?select=topic,subtopic,question,answer,slug` +
          `&is_published=eq.true` +
          `&order=created_at.desc` +
          `&limit=${limit}` +
          `&offset=${offset}`;

        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Prefer': 'count=exact'
          }
        });

        if (!res.ok) {
          console.error('Failed to load QA data:', res.status);
          break;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          allData = allData.concat(data);
          offset += limit;

          // If we got less than limit, we've reached the end
          if (data.length < limit) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      if (allData.length > 0) {
        allQuestions = allData;
        console.log(`Loaded ${allQuestions.length} questions`);
        updateStatistics();
        initSearch();
      }
    } catch (err) {
      console.error('Error loading QA:', err);
    }
  }

  // ---------- CALCULATE STATISTICS ----------
  function updateStatistics() {
    // Calculate unique categories (subtopics)
    const uniqueCategories = new Set();
    allQuestions.forEach(q => {
      if (q.subtopic && q.subtopic.trim()) {
        uniqueCategories.add(q.subtopic.trim());
      }
    });

    // Update DOM
    const categoryCountEl = $('categoryCount');
    const questionCountEl = $('questionCount');

    if (categoryCountEl) {
      animateNumber(categoryCountEl, uniqueCategories.size);
    }

    if (questionCountEl) {
      animateNumber(questionCountEl, allQuestions.length);
    }
  }

  // ---------- ANIMATE NUMBERS ----------
  function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = current.toLocaleString();
    }, 30);
  }

  // ---------- SEARCH FUNCTIONALITY ----------
  function initSearch() {
    const searchInput = $('searchInput');
    const searchClear = $('searchClear');
    const initialMessage = $('initialMessage');
    const qaListContainer = $('qaListContainer');
    const searchInfo = $('searchInfo');
    const resultCount = $('resultCount');

    if (!searchInput) return;

    let searchTimeout;

    // Search input event
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      // Show/hide clear button
      if (searchClear) {
        searchClear.style.display = query ? 'flex' : 'none';
      }

      // Debounce search
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    // Clear button
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        searchClear.style.display = 'none';

        // Hide results, show initial message
        if (qaListContainer) qaListContainer.style.display = 'none';
        if (initialMessage) initialMessage.style.display = 'block';
        if (searchInfo) searchInfo.style.display = 'none';
      });
    }

    // Popular tag clicks
    document.querySelectorAll('.popular-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const search = tag.getAttribute('data-search');
        if (search && searchInput) {
          searchInput.value = search;
          searchInput.focus();
          if (searchClear) searchClear.style.display = 'flex';
          performSearch(search);
        }
      });
    });
  }

  // ---------- PERFORM SEARCH ----------
  function performSearch(query) {
    const initialMessage = $('initialMessage');
    const qaListContainer = $('qaListContainer');
    const qaList = $('qaList');
    const noResults = $('noResults');
    const searchInfo = $('searchInfo');
    const resultCount = $('resultCount');

    // If query is empty, show initial message
    if (!query) {
      if (initialMessage) initialMessage.style.display = 'block';
      if (qaListContainer) qaListContainer.style.display = 'none';
      if (searchInfo) searchInfo.style.display = 'none';
      return;
    }

    // Hide initial message, show results container
    if (initialMessage) initialMessage.style.display = 'none';
    if (qaListContainer) qaListContainer.style.display = 'block';

    // Filter questions
    const normalizedQuery = query.toLowerCase().trim();
    const filtered = allQuestions.filter(q => {
      const questionText = (q.question || '').toLowerCase();
      const answerText = (q.answer || '').toLowerCase();
      const topic = (q.topic || '').toLowerCase();
      const subtopic = (q.subtopic || '').toLowerCase();

      return questionText.includes(normalizedQuery) ||
             answerText.includes(normalizedQuery) ||
             topic.includes(normalizedQuery) ||
             subtopic.includes(normalizedQuery);
    });

    // Update result count
    if (resultCount) resultCount.textContent = filtered.length;
    if (searchInfo) searchInfo.style.display = 'block';

    // Show/hide no results
    if (noResults && qaList) {
      if (filtered.length === 0) {
        noResults.style.display = 'block';
        qaList.innerHTML = '';
      } else {
        noResults.style.display = 'none';
        renderQuestions(filtered, normalizedQuery);
      }
    }
  }

  // ---------- RENDER QUESTIONS ----------
  function renderQuestions(questions, highlightTerm = '') {
    const qaList = $('qaList');
    if (!qaList) return;

    qaList.innerHTML = '';

    // Build FAQPage schema for SEO
    const faqEntities = [];

    questions.forEach((q) => {
      const slug = (q.slug || '').trim();
      const topic = (q.topic || '').trim();
      const subtopic = (q.subtopic || '').trim();

      const div = document.createElement("div");
      div.className = "qa-item";
      if (slug) div.id = slug;

      // Highlight matching terms
      const questionHtml = highlightText(escapeHtml(q.question), highlightTerm);
      const answerHtml = highlightText(escapeHtml(q.answer), highlightTerm);

      div.innerHTML = `
        <article itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
          <h3 itemprop="name">${questionHtml}</h3>
          <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
            <p itemprop="text">${answerHtml}</p>
          </div>
          <small class="qa-meta">${escapeHtml(topic)}${subtopic ? " / " + escapeHtml(subtopic) : ""}</small>
        </article>
      `;

      qaList.appendChild(div);

      // Add to FAQPage schema
      faqEntities.push({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      });
    });

    // Update FAQPage schema
    updateFAQSchema(faqEntities);
  }

  // ---------- HIGHLIGHT TEXT ----------
  function highlightText(text, term) {
    if (!term) return text;

    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ---------- UPDATE FAQ SCHEMA ----------
  function updateFAQSchema(faqEntities) {
    const schemaEl = $("faq-schema");
    if (!schemaEl) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqEntities
    };

    schemaEl.textContent = JSON.stringify(schema, null, 2);
  }

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    loadQA();
  });
})();
