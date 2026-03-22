(function () {
    'use strict';

    // =====================================================
    // SIMPLE ADMIN PANEL - Password Protected
    // =====================================================

    // Supabase Configuration (imported from config.js)
    // Config.js must be loaded before this script
    const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

    // Admin password
    const ADMIN_PASSWORD = 'PPPlll!11321132';

    // State
    let editContext = null;

    // =====================================================
    // INITIALIZATION
    // =====================================================
    document.addEventListener('DOMContentLoaded', () => {
        checkPassword();
    });

    // =====================================================
    // PASSWORD CHECK
    // =====================================================
    function checkPassword() {
        const savedPassword = sessionStorage.getItem('admin_password');

        if (savedPassword === ADMIN_PASSWORD) {
            showAdminPanel();
        } else {
            showPasswordPrompt();
        }
    }

    function showPasswordPrompt() {
        const password = prompt('Admin şifresi:');

        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_password', password);
            showAdminPanel();
        } else {
            alert('❌ Yanlış şifre!');
            window.location.href = '../index.html';
        }
    }

    function showAdminPanel() {
        document.getElementById('adminPanel').style.display = 'block';
        loadAllData();
        loadCSData();
        loadDevUserData();
    }

    // =====================================================
    // LOAD DATA
    // =====================================================
    async function loadAllData() {
        setTableLoading('allList');
        setTableLoading('providersList');
        setTableLoading('gastronomyList');

        try {
            const [providersResult, gastronomyResult, providersDataResult, gastronomyDataResult] = await Promise.all([
                supabase.from('provider_submissions').select('*').order('created_at', { ascending: false }),
                supabase.from('gastronomy_submissions').select('*').order('created_at', { ascending: false }),
                supabase.from('providers').select('*').order('created_at', { ascending: false }),
                supabase.from('gastronomy_providers').select('*').order('created_at', { ascending: false })
            ]);

            if (providersResult.error) console.error('Provider submissions error:', providersResult.error);
            if (gastronomyResult.error) console.error('Gastronomy submissions error:', gastronomyResult.error);
            if (providersDataResult.error) console.error('Providers error:', providersDataResult.error);
            if (gastronomyDataResult.error) console.error('Gastronomy providers error:', gastronomyDataResult.error);

            const submissions = [
                ...(providersResult.data || []).map(item => ({ ...item, __source: 'providers', __kind: 'submission' })),
                ...(gastronomyResult.data || []).map(item => ({ ...item, __source: 'gastronomy', __kind: 'submission' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const providers = (providersDataResult.data || [])
                .map(item => ({ ...item, __source: 'providers', __kind: 'provider' }));

            const gastronomyProviders = (gastronomyDataResult.data || [])
                .map(item => ({ ...item, __source: 'gastronomy', __kind: 'provider' }));

            renderTable(submissions, 'allList');
            renderTable(providers, 'providersList');
            renderTable(gastronomyProviders, 'gastronomyList');
        } catch (error) {
            console.error('Error loading data:', error);
            setTableError('allList');
            setTableError('providersList');
            setTableError('gastronomyList');
        }
    }

    function setTableLoading(listId) {
        const list = document.getElementById(listId);
        if (!list) return;
        list.innerHTML = `
      <tr>
        <td colspan="11" style="padding: 20px; text-align: center; color: #6B7280;">
          Yükleniyor...
        </td>
      </tr>
    `;
    }

    function setTableError(listId) {
        const list = document.getElementById(listId);
        if (!list) return;
        list.innerHTML = `
      <tr>
        <td colspan="11" style="padding: 20px; text-align: center; color: #BF0000;">
          Bir hata oluştu. Lütfen sayfayı yenileyin.
        </td>
      </tr>
    `;
    }

    function renderTable(rows, listId) {
        const list = document.getElementById(listId);
        if (!list) return;

        if (!rows.length) {
            list.innerHTML = `
        <tr>
          <td colspan="11" style="padding: 30px; text-align: center; color: #6B7280;">
            Henüz kayıt yok.
          </td>
        </tr>
      `;
            return;
        }

        list.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            const { statusLetter, statusClass } = getStatusMeta(row);
            const sourceLabel = row.__source === 'gastronomy' ? 'Gastronomi' : 'Uzman';

            const websiteHref = normalizeWebsiteUrl(row.website);
            const websiteLabel = formatWebsiteLabel(row.website);

            tr.innerHTML = `
        <td>${sourceLabel}</td>
        <td>${row.type || '-'}</td>
        <td>${row.display_name || '-'}</td>
        <td>${row.city || '-'}</td>
        <td>${row.address || '-'}</td>
        <td>${row.phone || '-'}</td>
        <td>${row.website ? `<a href="${websiteHref}" target="_blank">${websiteLabel}</a>` : '-'}</td>
        <td>${row.note || '-'}</td>
        <td>${row.created_at ? new Date(row.created_at).toLocaleString('tr-TR') : '-'}</td>
        <td style="text-align: center;"><span class="status-letter ${statusClass}">${statusLetter}</span></td>
        <td>
          <div class="actions">
            <button class="action-btn action-approve" title="Onayla (O)">O</button>
            <button class="action-btn action-reject" title="Reddet (R)">R</button>
            <button class="action-btn action-delete" title="Sil (S)">S</button>
            <button class="action-btn action-edit" title="Düzenle (D)">D</button>
          </div>
        </td>
      `;

            const [approveBtn, rejectBtn, deleteBtn, editBtn] = tr.querySelectorAll('.action-btn');

            if (row.__kind === 'submission') {
                approveBtn.disabled = row.status !== 'pending';
                rejectBtn.disabled = row.status !== 'pending';
                approveBtn.addEventListener('click', () => approveSubmission(row.id, row));
                rejectBtn.addEventListener('click', () => rejectSubmission(row.id, row.__source));
                deleteBtn.addEventListener('click', () => deleteSubmission(row.id, row.__source));
            } else {
                const isActive = row.status === 'active';
                approveBtn.disabled = isActive;
                rejectBtn.disabled = !isActive;
                approveBtn.addEventListener('click', () => updateProviderStatus(row, 'active'));
                rejectBtn.addEventListener('click', () => updateProviderStatus(row, 'inactive'));
                deleteBtn.addEventListener('click', () => deleteProvider(row));
            }

            editBtn.addEventListener('click', () => openEditModal(row));
            list.appendChild(tr);
        });
    }

    function getStatusMeta(row) {
        if (row.__kind === 'submission') {
            if (row.status === 'pending') return { statusLetter: 'B', statusClass: 'status-b' };
            if (row.status === 'approved') return { statusLetter: 'O', statusClass: 'status-o' };
            return { statusLetter: 'R', statusClass: 'status-r' };
        }

        if (row.status === 'active') return { statusLetter: 'O', statusClass: 'status-o' };
        if (row.status === 'inactive') return { statusLetter: 'R', statusClass: 'status-r' };
        return { statusLetter: 'B', statusClass: 'status-b' };
    }

    function normalizeWebsiteUrl(website) {
        if (!website) return '';
        const trimmed = String(website).trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
        return `https://${trimmed}`;
    }

    function formatWebsiteLabel(website) {
        if (!website) return '';
        const trimmed = String(website).trim();
        if (!trimmed) return '';
        try {
            const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(`https://${trimmed}`);
            return url.hostname;
        } catch (err) {
            return trimmed;
        }
    }

    // =====================================================
    // SUBMISSION ACTIONS
    // =====================================================
    async function approveSubmission(submissionId, submission) {
        if (!confirm('Bu öneriyi onaylamak istediğinize emin misiniz?')) {
            return;
        }

        showLoading(true);

        try {
            const targetTable = submission.__source === 'gastronomy' ? 'gastronomy_providers' : 'providers';
            const submissionTable = submission.__source === 'gastronomy' ? 'gastronomy_submissions' : 'provider_submissions';

            const providerData = {
                type: submission.type,
                display_name: submission.display_name,
                city: submission.city,
                address: submission.address,
                phone: submission.phone,
                website: submission.website,
                status: 'active'
            };

            const { data: newProvider, error: insertError } = await supabase
                .from(targetTable)
                .insert([providerData])
                .select()
                .single();

            if (insertError) throw insertError;

            const { error: submissionUpdateError } = await supabase
                .from(submissionTable)
                .update({
                    status: 'approved',
                    approved_provider_id: newProvider.id
                })
                .eq('id', submissionId);

            if (submissionUpdateError) throw submissionUpdateError;

            await loadAllData();
            alert('✅ Öneri başarıyla onaylandı!');
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function rejectSubmission(submissionId, source) {
        if (!confirm('Bu öneriyi reddetmek istediğinize emin misiniz?')) {
            return;
        }

        showLoading(true);

        try {
            const submissionTable = source === 'gastronomy' ? 'gastronomy_submissions' : 'provider_submissions';
            const { error } = await supabase
                .from(submissionTable)
                .update({
                    status: 'rejected',
                    admin_comment: 'Reddedildi'
                })
                .eq('id', submissionId);

            if (error) throw error;

            await loadAllData();
            alert('✅ Öneri reddedildi.');
        } catch (error) {
            console.error('Error rejecting submission:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function deleteSubmission(submissionId, source) {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
            return;
        }

        showLoading(true);

        try {
            const submissionTable = source === 'gastronomy' ? 'gastronomy_submissions' : 'provider_submissions';
            const { error } = await supabase
                .from(submissionTable)
                .delete()
                .eq('id', submissionId);

            if (error) throw error;

            await loadAllData();
            alert('✅ Kayıt silindi.');
        } catch (error) {
            console.error('Error deleting submission:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // =====================================================
    // PROVIDER ACTIONS
    // =====================================================
    async function updateProviderStatus(provider, status) {
        const actionText = status === 'active' ? 'aktif' : 'pasif';
        if (!confirm(`Bu kaydı ${actionText} yapmak istediğinize emin misiniz?`)) {
            return;
        }

        showLoading(true);

        try {
            const providerTable = provider.__source === 'gastronomy' ? 'gastronomy_providers' : 'providers';
            const { error } = await supabase
                .from(providerTable)
                .update({ status })
                .eq('id', provider.id);

            if (error) throw error;

            await loadAllData();
            alert('✅ Durum güncellendi.');
        } catch (error) {
            console.error('Error updating provider status:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function deleteProvider(provider) {
        if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
            return;
        }

        showLoading(true);

        try {
            const providerTable = provider.__source === 'gastronomy' ? 'gastronomy_providers' : 'providers';
            const { error } = await supabase
                .from(providerTable)
                .delete()
                .eq('id', provider.id);

            if (error) throw error;

            await loadAllData();
            alert('✅ Kayıt silindi.');
        } catch (error) {
            console.error('Error deleting provider:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // =====================================================
    // EDIT MODAL
    // =====================================================
    function openEditModal(row) {
        editContext = row;
        document.getElementById('editType').value = row.type || '';
        document.getElementById('editName').value = row.display_name || '';
        document.getElementById('editCity').value = row.city || '';
        document.getElementById('editAddress').value = row.address || '';
        document.getElementById('editPhone').value = row.phone || '';
        document.getElementById('editWebsite').value = row.website || '';
        document.getElementById('editNote').value = row.note || '';

        const statusSelect = document.getElementById('editStatus');
        const noteField = document.getElementById('editNoteField');

        if (row.__kind === 'provider') {
            statusSelect.innerHTML = `
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      `;
            statusSelect.value = row.status || 'active';
            if (noteField) noteField.style.display = 'none';
        } else {
            statusSelect.innerHTML = `
        <option value="pending">pending</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      `;
            statusSelect.value = row.status || 'pending';
            if (noteField) noteField.style.display = 'block';
        }

        document.getElementById('editModal').classList.add('active');
    }

    function closeEditModal() {
        editContext = null;
        document.getElementById('editModal').classList.remove('active');
    }

    async function saveEdit() {
        if (!editContext) return;

        showLoading(true);

        try {
            const payload = {
                type: document.getElementById('editType').value.trim(),
                display_name: document.getElementById('editName').value.trim(),
                city: document.getElementById('editCity').value.trim(),
                address: document.getElementById('editAddress').value.trim() || null,
                phone: document.getElementById('editPhone').value.trim() || null,
                website: document.getElementById('editWebsite').value.trim() || null,
                status: document.getElementById('editStatus').value
            };

            if (editContext.__kind === 'submission') {
                payload.note = document.getElementById('editNote').value.trim() || null;

                const submissionTable = editContext.__source === 'gastronomy' ? 'gastronomy_submissions' : 'provider_submissions';
                const providerTable = editContext.__source === 'gastronomy' ? 'gastronomy_providers' : 'providers';

                const { error: updateError } = await supabase
                    .from(submissionTable)
                    .update(payload)
                    .eq('id', editContext.id);

                if (updateError) throw updateError;

                if (payload.status === 'approved' && editContext.approved_provider_id) {
                    await supabase
                        .from(providerTable)
                        .update({
                            type: payload.type,
                            display_name: payload.display_name,
                            city: payload.city,
                            address: payload.address,
                            phone: payload.phone,
                            website: payload.website
                        })
                        .eq('id', editContext.approved_provider_id);
                }
            } else {
                const providerTable = editContext.__source === 'gastronomy' ? 'gastronomy_providers' : 'providers';
                const { error: updateError } = await supabase
                    .from(providerTable)
                    .update(payload)
                    .eq('id', editContext.id);

                if (updateError) throw updateError;
            }

            closeEditModal();
            await loadAllData();
            alert('✅ Kayıt güncellendi.');
        } catch (error) {
            console.error('Error updating record:', error);
            alert('❌ Bir hata oluştu: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    // =====================================================
    // LOADING OVERLAY
    // =====================================================
    function showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }



    // =====================================================
    // CS (Soru Sor) ADMIN
    // =====================================================
    async function loadCSData() {
        setTableLoading('csQuestionsList');
        setTableLoading('csAnswersList');

        try {
            const r = await fetch('/api/cs-admin-list', {
                headers: { 'x-admin-password': ADMIN_PASSWORD }
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Load failed');

            renderCSQuestions(data.questions || []);
            renderCSAnswers(data.answers || []);
        } catch (error) {
            console.error('Error loading CS data:', error);
            setTableError('csQuestionsList');
            setTableError('csAnswersList');
        }
    }

    function renderCSQuestions(rows) {
        const list = document.getElementById('csQuestionsList');
        if (!list) return;

        if (!rows.length) {
            list.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 30px; text-align: center; color: #6B7280;">
            Henuz soru yok.
          </td>
        </tr>
      `;
            return;
        }

        list.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.question || '-'}</td>
        <td>${row.created_at ? new Date(row.created_at).toLocaleString('tr-TR') : '-'}</td>
        <td>${typeof row.answer_count === 'number' ? row.answer_count : '-'}</td>
        <td>
          <div class="actions">
            <button class="action-btn action-delete" title="Sil (S)">S</button>
          </div>
        </td>
      `;
            const deleteBtn = tr.querySelector('.action-delete');
            deleteBtn.addEventListener('click', () => deleteCSQuestion(row.id));
            list.appendChild(tr);
        });
    }

    function renderCSAnswers(rows) {
        const list = document.getElementById('csAnswersList');
        if (!list) return;

        if (!rows.length) {
            list.innerHTML = `
        <tr>
          <td colspan="5" style="padding: 30px; text-align: center; color: #6B7280;">
            Henuz cevap yok.
          </td>
        </tr>
      `;
            return;
        }

        list.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.question_id || '-'}</td>
        <td>${row.message || '-'}</td>
        <td>${row.created_at ? new Date(row.created_at).toLocaleString('tr-TR') : '-'}</td>
        <td>
          <div class="actions">
            <button class="action-btn action-delete" title="Sil (S)">S</button>
          </div>
        </td>
      `;
            const deleteBtn = tr.querySelector('.action-delete');
            deleteBtn.addEventListener('click', () => deleteCSAnswer(row.id));
            list.appendChild(tr);
        });
    }

    async function deleteCSQuestion(id) {
        if (!confirm('Bu soruyu silmek istediginize emin misiniz?')) return;
        showLoading(true);
        try {
            const r = await fetch('/api/cs-admin-delete-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': ADMIN_PASSWORD
                },
                body: JSON.stringify({ id })
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Delete failed');
            await loadCSData();
            alert('OK: Soru silindi.');
        } catch (error) {
            console.error('Delete question error:', error);
            alert('Hata: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function deleteCSAnswer(id) {
        if (!confirm('Bu cevabi silmek istediginize emin misiniz?')) return;
        showLoading(true);
        try {
            const r = await fetch('/api/cs-admin-delete-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': ADMIN_PASSWORD
                },
                body: JSON.stringify({ id })
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Delete failed');
            await loadCSData();
            alert('OK: Cevap silindi.');
        } catch (error) {
            console.error('Delete answer error:', error);
            alert('Hata: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    window.closeEditModal = closeEditModal;
    window.saveEdit = saveEdit;

    // =====================================================
    // DEVUSER MANAGEMENT
    // =====================================================
    async function loadDevUserData() {
        const list = document.getElementById('devuserList');
        if (!list) return;

        list.innerHTML = `
            <tr>
                <td colspan="10" style="padding: 20px; text-align: center; color: #6B7280;">
                    Yükleniyor...
                </td>
            </tr>
        `;

        try {
            const { data, error } = await supabase
                .from('devuser')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                list.innerHTML = `
                    <tr>
                        <td colspan="10" style="padding: 30px; text-align: center; color: #6B7280;">
                            Henüz kayıt yok.
                        </td>
                    </tr>
                `;
                return;
            }

            list.innerHTML = '';
            data.forEach(user => {
                const tr = document.createElement('tr');
                
                // Teknolojileri birleştir
                const allTech = [
                    ...(user.programlama_dilleri || []),
                    ...(user.framework_platformlar || []),
                    ...(user.devops_cloud || [])
                ].slice(0, 5).join(', ');

                const techDisplay = allTech.length > 50 ? allTech.substring(0, 50) + '...' : allTech;

                tr.innerHTML = `
                    <td style="font-weight: 600;">${escapeHtml(user.ad_soyad)}</td>
                    <td>${escapeHtml(user.sehir || '-')}</td>
                    <td>${escapeHtml(user.rol || '-')}</td>
                    <td>${escapeHtml(user.deneyim_seviye || '-')}</td>
                    <td style="font-size: 11px;">${techDisplay || '-'}</td>
                    <td>${escapeHtml(user.is_arama_durumu || '-')}</td>
                    <td>${escapeHtml(user.freelance_aciklik || '-')}</td>
                    <td style="font-size: 11px;">${formatDate(user.created_at)}</td>
                    <td>
                        <span style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: ${user.aratilabilir ? '#7CBB00' : '#BF0000'};"></span>
                    </td>
                    <td>
                        <button class="action-btn action-edit" onclick="viewDevUser('${user.id}')" title="Görüntüle">👁️</button>
                        <button class="action-btn action-delete" onclick="deleteDevUser('${user.id}')" title="Sil">❌</button>
                    </td>
                `;
                list.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading devuser data:', error);
            list.innerHTML = `
                <tr>
                    <td colspan="10" style="padding: 20px; text-align: center; color: #BF0000;">
                        Bir hata oluştu: ${error.message}
                    </td>
                </tr>
            `;
        }
    }

    async function viewDevUser(id) {
        showLoading(true);
        try {
            const { data, error } = await supabase
                .from('devuser')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Detaylı bilgileri göster
            let details = `
=== DEVELOPER PROFIL DETAYLARI ===

Kimlik ve İletişim:
- Ad Soyad: ${data.ad_soyad}
- LinkedIn: ${data.linkedin_url || '-'}
- WhatsApp: ${data.whatsapp_tel || '-'}
- Almanya'da yaşıyor: ${data.almanya_yasam ? 'Evet' : 'Hayır'}
- Şehir: ${data.sehir || '-'}

Profil:
- Rol: ${data.rol || '-'}
- Deneyim: ${data.deneyim_seviye || '-'}
- Aktif kod yazıyor: ${data.aktif_kod ? 'Evet' : 'Hayır'}
- Güçlü alanlar: ${(data.guclu_alanlar || []).join(', ') || '-'}
- Açık kaynak: ${data.acik_kaynak ? 'Evet' : 'Hayır'}
- Kendi projesi: ${data.kendi_proje ? 'Evet' : 'Hayır'}
- Proje link: ${data.proje_link || '-'}

Teknoloji:
- Diller: ${(data.programlama_dilleri || []).join(', ') || '-'}
- Framework: ${(data.framework_platformlar || []).join(', ') || '-'}
- DevOps/Cloud: ${(data.devops_cloud || []).join(', ') || '-'}

İlgi Alanları:
- İlgi konular: ${(data.ilgi_konular || []).join(', ') || '-'}
- Öğrenmek istenen: ${(data.ogrenmek_istenen || []).join(', ') || '-'}

İş Durumu:
- İş arama: ${data.is_arama_durumu || '-'}
- Freelance: ${data.freelance_aciklik || '-'}
- Gönüllü proje: ${data.gonullu_proje ? 'Evet' : 'Hayır'}

İş Birliği:
- Katılma amacı: ${data.katilma_amaci || '-'}
- İşbirliği türü: ${(data.isbirligi_turu || []).join(', ') || '-'}
- Profesyonel destek verebilir: ${data.profesyonel_destek_verebilir ? 'Evet' : 'Hayır'}
- Profesyonel destek almak: ${data.profesyonel_destek_almak ? 'Evet' : 'Hayır'}

Görünürlük:
- Aratılabilir: ${data.aratilabilir ? 'Evet' : 'Hayır'}
- İletişim izni: ${data.iletisim_izni ? 'Evet' : 'Hayır'}

Kayıt Tarihi: ${formatDate(data.created_at)}
Güncelleme: ${formatDate(data.updated_at)}
            `;

            alert(details);
        } catch (error) {
            console.error('Error viewing devuser:', error);
            alert('Hata: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function deleteDevUser(id) {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
        
        showLoading(true);
        try {
            const { error } = await supabase
                .from('devuser')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Kullanıcı başarıyla silindi.');
            await loadDevUserData();
        } catch (error) {
            console.error('Error deleting devuser:', error);
            alert('Hata: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    }

    // Expose devuser functions globally
    window.viewDevUser = viewDevUser;
    window.deleteDevUser = deleteDevUser;
    window.loadDevUserData = loadDevUserData;

})();
