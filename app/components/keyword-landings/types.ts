export type KeywordColorTheme = {
  primary: string;
  secondary: string;
  accent: string;
  buttonBg?: string;
  buttonHover?: string;
  searchBorder?: string;
  searchFocus?: string;
  cardHover?: string;
  playButton?: string;
  textAccent?: string;
};

export type KeywordLandingContent = {
  heading: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export type KeywordLandingProps = {
  keyword: string;
  description: string;
  colorTheme: KeywordColorTheme;
  content: KeywordLandingContent;
};
