import type { ToolQuestionnaireConfig } from '@/lib/tools/types';
import { validateQuestionnaireConfig } from '@/lib/tools/survey';
import { almanyaMaasBeklentisiQuestionnaire } from '@/lib/tools/surveys/almanya-maas-beklentisi';
import { almanyaYasamTarziUyumuQuestionnaire } from '@/lib/tools/surveys/almanya-yasam-tarzi-uyumu';
import { almanyaYolunuSecQuestionnaire } from '@/lib/tools/surveys/almanya-yolunu-sec';
import { almanyadaIsBulmaOlasiligiQuestionnaire } from '@/lib/tools/surveys/almanyada-is-bulma-olasiligi';
import { almanyayaHazirMisinQuestionnaire } from '@/lib/tools/surveys/almanyaya-hazir-misin';
import { hangiSehirSanaUygunQuestionnaire } from '@/lib/tools/surveys/hangi-sehir-sana-uygun';
import { ilk90GunPlanlayiciQuestionnaire } from '@/lib/tools/surveys/ilk-90-gun-planlayici';
import { kariyerVeEgitimRotasiQuestionnaire } from '@/lib/tools/surveys/kariyer-ve-egitim-rotasi';
import { onceHangiSorunuCozmelisinQuestionnaire } from '@/lib/tools/surveys/once-hangi-sorunu-cozmelisin';
import { toplulukVeDanismanlikQuestionnaire } from '@/lib/tools/surveys/topluluk-ve-danismanlik';

export const TOOL_QUESTIONNAIRE_REGISTRY = {
  'almanya-yolunu-sec': almanyaYolunuSecQuestionnaire,
  'almanya-maas-beklentisi': almanyaMaasBeklentisiQuestionnaire,
  'almanyaya-hazir-misin': almanyayaHazirMisinQuestionnaire,
  'hangi-sehir-sana-uygun': hangiSehirSanaUygunQuestionnaire,
  'topluluk-ve-danismanlik': toplulukVeDanismanlikQuestionnaire,
  'kariyer-ve-egitim-rotasi': kariyerVeEgitimRotasiQuestionnaire,
  'almanya-yasam-tarzi-uyumu': almanyaYasamTarziUyumuQuestionnaire,
  'ilk-90-gun-planlayici': ilk90GunPlanlayiciQuestionnaire,
  'once-hangi-sorunu-cozmelisin': onceHangiSorunuCozmelisinQuestionnaire,
  'almanyada-is-bulma-olasiligi': almanyadaIsBulmaOlasiligiQuestionnaire,
} as const satisfies Record<string, ToolQuestionnaireConfig>;

for (const config of Object.values(TOOL_QUESTIONNAIRE_REGISTRY)) {
  validateQuestionnaireConfig(config);
}

export type ToolQuestionnaireSlug = keyof typeof TOOL_QUESTIONNAIRE_REGISTRY;
