(function () {
  'use strict';

  // =====================================================
  // UZMAN EKLE - Submit form only
  // =====================================================

  const SUPABASE_URL = 'https://ldptefnpiudquipdsezr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI';

  if (!window.supabase) {
    console.error('Supabase client not loaded.');
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // =====================================================
  // INIT
  // =====================================================
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('submitForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('submitMessage');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Gönderiliyor...';
      }

      if (messageDiv) {
        messageDiv.innerHTML = '';
      }

      try {
        const formData = {
          type: document.getElementById('submitType').value,
          display_name: document.getElementById('submitName').value.trim(),
          city: document.getElementById('submitCity').value.trim(),
          note: document.getElementById('submitNote').value.trim() || null,
          status: 'pending'
        };

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          formData.submitter_user_id = user.id;
        }

        const { error } = await supabase
          .from('provider_submissions')
          .insert([formData]);

        if (error) throw error;

        if (messageDiv) {
          messageDiv.innerHTML = `
          <div class="success-message">
            ✅ Teşekkürler! Öneriniz başarıyla alındı. Admin onayı sonrası yayına alınacak.
          </div>
        `;
          messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        form.reset();

      } catch (error) {
        console.error('Error submitting provider:', error);
        if (messageDiv) {
          messageDiv.innerHTML = `
          <div class="error-message">
            ❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        `;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Gönder';
        }
      }
    });
  });

})();
