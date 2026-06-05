import type { ReferenceWorkItem } from '@/types/reference-work';
import { getReferenceWorkBySlug } from '@/data/reference-work';

const item = getReferenceWorkBySlug('tranztec-ui-kit');
if(!item) {
  throw new Error('Missing reference work registry entry: tranztec-ui-kit');
}

export const metadata: ReferenceWorkItem = item;
