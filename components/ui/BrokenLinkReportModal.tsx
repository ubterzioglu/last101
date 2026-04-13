'use client';

import { useState } from 'react';

interface BrokenLinkReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId?: string;
  agencyName: string;
}

export function BrokenLinkReportModal({
  isOpen,
  onClose,
  agencyId,
  agencyName,
}: BrokenLinkReportModalProps) {
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      alert('Lütfen rapor metni giriniz');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/broken-link-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agencyId,
          agencyName,
          reportText,
        }),
      });

      if (!response.ok) {
        throw new Error('Rapor gönderilemedi');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      alert('Hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReportText('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Kırık Link Bildir
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {agencyName}
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">
              Rapor gönderildi
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Teşekkürler! Bildiriminiz incelenecek.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rapor Detayları
              </label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Kırık link detaylarını açıklayın..."
                rows={6}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-google-blue focus:outline-none focus:ring-2 focus:ring-google-blue/20"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !reportText.trim()}
                className="rounded-lg bg-google-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Bildir'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
