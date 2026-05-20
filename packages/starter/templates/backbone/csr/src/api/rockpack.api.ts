const DESCRIPTION =
  'Zero-config React with built-in SSR, automated quality gates, and AI-ready project structure - ship clean code whether you write it yourself or with an AI assistant.';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchRockpackDescription = async (): Promise<string> => {
  await delay(600);

  return DESCRIPTION;
};
