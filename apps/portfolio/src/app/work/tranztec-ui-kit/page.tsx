'use client';

import { useTitle } from '@/hooks/useTitle';
import { CaseStudyPageChrome } from '@/components/case-studies/CaseStudyPageChrome';
import { TranztecUiKitCaseStudy } from '@/components/case-studies/TranztecUiKitCaseStudy';
import { metadata } from './metadata';

export default function TranztecUiKitCaseStudyPage() {
  useTitle('Tranztec UI Kit — Case study');

  return (
    <CaseStudyPageChrome
      title="Turning a Design System into a Production React Component Library"
      subtitle={metadata.subtitle}
    >
      <TranztecUiKitCaseStudy />
    </CaseStudyPageChrome>
  );
}
