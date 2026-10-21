import { HOME_GUIDE_CARDS } from '@/components/home/HomeGuideCards';
import { Accordion } from '@/components/site/Accordion';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { StepList } from '@/components/site/StepList';
import { Section } from '@/components/ui/Section';
import { HOME_GUIDE_STEPS } from '@/constants/home-data';

const GUIDE_INTRO =
  'Almanya101 nedir? Kısaca Almanya101, bu ülkeye taşınan veya burada yaşayan Türkler için Türkçe rehber, araç ve topluluk platformudur. ~3,5 milyon Türk kökenli insan burada yaşıyor ve her yıl binlercesi yeni taşınıyor. Bu sayfa; yaşam rehberi arayan, iş bulma sürecini anlamak isteyen ve Türk topluluğuyla güvenli şekilde bağ kurmak isteyen kullanıcılar için karar destek sayfası olarak tasarlandı. Hedef, bilgi kalabalığını azaltıp sıradaki mantıklı adımı görünür hale getirmek.';

const GUIDE_STEPS = HOME_GUIDE_STEPS.map((title) => ({ title }));

/** Editorial split (photo left, text and first steps right) with the guide cards below. */
export function HomeGuideSection() {
  return (
    <Section aria-labelledby="home-guide-title">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-[38px]">
        <PhotoCard
          src="/images/site/berlin-spree.webp"
          alt="Gün batımında Spree Nehri, Berlin Katedrali ve Berlin Televizyon Kulesi"
          elevated={false}
          className="lg:aspect-[4/5]"
        />
        <div className="min-w-0">
          <SectionHeader
            id="home-guide-title"
            eyebrow="Ana sayfa rehberi"
            title="Almanya'da Düzen Kurmak İçin Nereden Başlamalı?"
            description={GUIDE_INTRO}
          />
          <StepList steps={GUIDE_STEPS} className="mt-8" />
        </div>
      </div>
      <Accordion name="home-guide" toneCycle items={HOME_GUIDE_CARDS} className="mt-14" />
    </Section>
  );
}
