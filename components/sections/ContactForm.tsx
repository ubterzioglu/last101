'use client';

export function ContactForm() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Mesaj Gönder</h3>
      <p className="text-gray-600 mb-6">
        Formu doldurarak bize mesaj gönderebilirsiniz. En kısa sürede yanıtlayacağız.
      </p>

      {/* Placeholder Contact Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            E-posta
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
            placeholder="e-posta@adresiniz.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Konu
          </label>
          <input
            type="text"
            id="subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
            placeholder="Mesajınızın konusu"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mesaj
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
            placeholder="Mesajınızı buraya yazın..."
          />
        </div>

        <button
          type="button"
          className="w-full px-4 py-2 text-white bg-google-blue rounded-md hover:bg-blue-600 transition-colors font-medium"
          onClick={() => alert('İletişim formu şu anda devre dışı. Lütfen e-posta ile iletişime geçin.')}
        >
          Mesaj Gönder
        </button>
      </div>
    </div>
  );
}
