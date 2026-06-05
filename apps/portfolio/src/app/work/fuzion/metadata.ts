import type { ReferenceWorkItem } from '@/types/reference-work';
import { getReferenceWorkBySlug } from '@/data/reference-work';

const item = getReferenceWorkBySlug('fuzion');
if (!item) {
  throw new Error('Missing reference work registry entry: fuzion');
}

export const metadata: ReferenceWorkItem = item;
