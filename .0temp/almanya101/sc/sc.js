(function () {
  const listEl = document.getElementById('csList');
  const askBtn = document.getElementById('csAskBtn');
  const askInput = document.getElementById('csQuestion');
  const askStatus = document.getElementById('csAskStatus');

  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString('tr-TR');
    } catch {
      return '';
    }
  }

  function setStatus(el, text) {
    if (!el) return;
    el.textContent = text || '';
  }

  async function loadAnswers(questionId, container) {
    try {
      const r = await fetch(`/api/cs-answer-list?question_id=${encodeURIComponent(questionId)}&limit=200`, {
        cache: 'no-store'
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Cevaplar yuklenemedi');

      container.innerHTML = '';
      (data.items || []).forEach(a => {
        const row = document.createElement('div');
        row.className = 'cs-answer';
        const msg = document.createElement('div');
        msg.textContent = a.message || '';
        const meta = document.createElement('div');
        meta.className = 'cs-meta';
        meta.textContent = fmtDate(a.created_at);
        row.appendChild(msg);
        row.appendChild(meta);
        container.appendChild(row);
      });
    } catch (e) {
      container.innerHTML = '';
      const err = document.createElement('div');
      err.className = 'cs-meta';
      err.textContent = 'Cevaplar yuklenemedi.';
      container.appendChild(err);
    }
  }

  function renderQuestion(item) {
    const wrap = document.createElement('div');
    wrap.className = 'cs-item';

    const qText = document.createElement('div');
    qText.textContent = item.question || '';

    const meta = document.createElement('div');
    meta.className = 'cs-meta';
    meta.textContent = fmtDate(item.created_at);

    const answers = document.createElement('div');
    answers.className = 'cs-answers';

    const answerInput = document.createElement('textarea');
    answerInput.className = 'cs-answer-input';
    answerInput.placeholder = 'Cevap veya yorum yaz...';

    const answerBtn = document.createElement('button');
    answerBtn.className = 'cs-btn';
    answerBtn.textContent = 'Cevapla';

    const answerStatus = document.createElement('div');
    answerStatus.className = 'cs-status';

    answerBtn.addEventListener('click', async () => {
      const message = (answerInput.value || '').trim();
      if (message.length < 3) {
        setStatus(answerStatus, 'Cevap cok kisa.');
        return;
      }
      answerBtn.disabled = true;
      setStatus(answerStatus, 'Gonderiliyor...');
      try {
        const r = await fetch('/api/cs-answer-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question_id: item.id, message })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Hata');
        answerInput.value = '';
        setStatus(answerStatus, 'Tesekkurler!');
        await loadAnswers(item.id, answers);
      } catch (e) {
        setStatus(answerStatus, 'Gonderilemedi.');
      } finally {
        answerBtn.disabled = false;
      }
    });

    wrap.appendChild(qText);
    wrap.appendChild(meta);
    wrap.appendChild(answers);
    wrap.appendChild(answerInput);
    wrap.appendChild(answerBtn);
    wrap.appendChild(answerStatus);

    loadAnswers(item.id, answers);

    return wrap;
  }

  async function loadQuestions() {
    if (!listEl) return;
    listEl.innerHTML = '';
    const loading = document.createElement('div');
    loading.className = 'cs-meta';
    loading.textContent = 'Yukleniyor...';
    listEl.appendChild(loading);
    try {
      const r = await fetch('/api/cs-question-list?limit=50', { cache: 'no-store' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Sorular yuklenemedi');
      listEl.innerHTML = '';
      (data.items || []).forEach(item => listEl.appendChild(renderQuestion(item)));
      if (!data.items || data.items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cs-meta';
        empty.textContent = 'Henuz soru yok. Ilk soruyu sen sor!';
        listEl.appendChild(empty);
      }
    } catch (e) {
      listEl.innerHTML = '';
      const err = document.createElement('div');
      err.className = 'cs-meta';
      err.textContent = 'Sorular yuklenemedi.';
      listEl.appendChild(err);
    }
  }

  if (askBtn && askInput) {
    askBtn.addEventListener('click', async () => {
      const question = (askInput.value || '').trim();
      if (question.length < 10) {
        setStatus(askStatus, 'Soru cok kisa.');
        return;
      }
      askBtn.disabled = true;
      setStatus(askStatus, 'Gonderiliyor...');
      try {
        const r = await fetch('/api/cs-question-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Hata');
        askInput.value = '';
        setStatus(askStatus, 'Tesekkurler!');
        await loadQuestions();
      } catch (e) {
        setStatus(askStatus, 'Gonderilemedi.');
      } finally {
        askBtn.disabled = false;
      }
    });
  }

  loadQuestions();
})();
