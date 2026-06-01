export interface DesignConcept {
  title: string;
  explain: string;
  code?: string;
  note?: string;
}

export interface DesignCaseStudy {
  title: string;
  scenario: string;
  focus: string[];
}

export interface DesignQA {
  q: string;
  a: string;
}

export interface DesignTrack {
  slug: string;
  title: string;
  label: string;
  icon: string;
  blurb: string;
  why: string;
  simple: string;
  framework: string[];
  concepts: DesignConcept[];
  caseStudies: DesignCaseStudy[];
  interviewPhrases: string[];
  interviewQs: DesignQA[];
  build: string[];
  pitfalls: string[];
  checklist: string[];
  resources: { label: string; url: string }[];
}
