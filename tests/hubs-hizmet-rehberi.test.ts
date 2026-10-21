import { MapPin, Stethoscope, Wrench } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import {
  PAGE_SIZE,
  categoryKeyOf,
  getMonogram,
  providerIcon,
  providerTone,
  visibleResultCount,
} from '@/app/(site)/hizmet-rehberi/provider-display';

describe('hizmet rehberi display helpers', () => {
  it('builds Corteqs-style monograms', () => {
    expect(getMonogram('abc multilingua')).toBe('AM');
    expect(getMonogram('Adam')).toBe('AD');
    expect(getMonogram('  Dr. İlker Şahin ')).toBe('Dİ');
    expect(getMonogram('"Öz" Kasap')).toBe('ÖK');
    expect(getMonogram('')).toBe('?');
  });

  it('maps legacy repair subtypes to the tamir category', () => {
    expect(categoryKeyOf('tamirci_tesisat')).toBe('tamir');
    expect(categoryKeyOf('doctor')).toBe('doctor');
    expect(providerIcon('tamirci_boyaci')).toBe(Wrench);
    expect(providerIcon('doctor')).toBe(Stethoscope);
    expect(providerIcon('all')).toBe(MapPin);
  });

  it('gives subtypes the same tone as their category', () => {
    expect(providerTone('tamirci_otomobil')).toBe(providerTone('tamir'));
    expect(['blue', 'green', 'orange', 'yellow']).toContain(providerTone('all'));
  });

  it('resets the visible count when the filters change', () => {
    expect(visibleResultCount({ key: 'a', count: 36 }, 'a', 100)).toBe(36);
    expect(visibleResultCount({ key: 'a', count: 36 }, 'b', 100)).toBe(PAGE_SIZE);
    expect(visibleResultCount({ key: 'a', count: 36 }, 'a', 20)).toBe(20);
  });
});
