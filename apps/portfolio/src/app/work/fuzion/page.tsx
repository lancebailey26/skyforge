'use client';

import { useTitle } from '@/hooks/useTitle';
import { CaseStudyPageChrome } from '@/components/case-studies/CaseStudyPageChrome';
import { FuzionCaseStudy } from '@/components/case-studies/FuzionCaseStudy';
import { metadata } from './metadata';

export default function FuzionCaseStudyPage() {
  useTitle('Fuzion — Case study');

  return (
    <CaseStudyPageChrome
      title="An Integration Workspace That Brought AI Mapping to Non-Coders"
      subtitle={metadata.subtitle}
    >
      <FuzionCaseStudy />
    </CaseStudyPageChrome>
  );
}
