import type { Metadata } from 'next';
import { CvoptClient } from './CvoptClient';

export const metadata: Metadata = {
  title: 'CV LinkedIn İyileştirme - almanya101',
  robots: { index: false, follow: false },
};

export default function CvoptPage() {
  return <CvoptClient />;
}
