import type { Metadata } from 'next';
import Link from 'next/link';
import { DevUserShell } from '@/components/devuser/DevUserShell';

export const metadata: Metadata = {
  title: 'CV LinkedIn İyileştirme - almanya101',
  robots: { index: false, follow: false },
};

export default function CvoptPage() {
  return (
    <DevUserShell
      title="cv linkedin iyileştirme"
      backHref="/devuser/dev"
      backLabel="← dashboard'a dön"
      frameVariant="default"
    >
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="inline-flex rounded-full bg-google-yellow/20 border border-google-yellow/30 px-4 py-2 text-sm font-semibold text-google-yellow">
            Bilgilendirme
          </div>

          <h1 className="text-3xl font-black md:text-4xl">
            Bu Sayfa Taşındı
          </h1>

          <p className="text-lg leading-8 text-white/78">
            CV LinkedIn İyileştirme hizmeti artık <span className="text-google-blue font-semibold">ubterzioglu.de</span> altında sunuluyor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a
              href="https://ubterzioglu.de/cv-optimize"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-google-yellow px-8 py-4 text-base font-bold text-black transition hover:bg-yellow-400"
            >
              Hizmete Git
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>

            <Link
              href="/devuser/dev"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] px-8 py-4 text-base font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Dashboard'a Dön
            </Link>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/60">
              Yeni konum üzerinden hizmete erişebilirsiniz. Mevcut kayıtlarınız korunmaktadır.
            </p>
          </div>
        </div>
      </div>
    </DevUserShell>
  );
}
