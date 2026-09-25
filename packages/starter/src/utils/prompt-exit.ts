// Ctrl+C in an @inquirer prompt rejects with an ExitPromptError; the CLI ends with exit code 0.
export const isPromptExit = (error: unknown): boolean => (error as { name?: string }).name === 'ExitPromptError';
