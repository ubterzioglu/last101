import { createMetadata } from '@/lib/seo/metadata';
import { FounderSurveyClient } from './FounderSurveyClient';

export const metadata = createMetadata({
  title: 'Founder Tarih Anketi',
  description: 'Onaylı founder kaydı için etkinlik tarih ve saat tercihlerini gönder.',
  path: '/devuser/founder-survey',
  noIndex: true,
});

export default async function FounderSurveyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const founderParam = params?.founder;
  const founderId = Array.isArray(founderParam) ? founderParam[0] || '' : founderParam || '';

  return <FounderSurveyClient founderId={founderId} />;
}
