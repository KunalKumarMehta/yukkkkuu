/** Shared TypeScript types for the AI Coder Platform. */

export type Problem = {
  id: string;
  title: string;
  description: string;
  signature: string | null;
  type: string;
  options?: { id: string; text: string }[] | null;
};

export type LLMFeedback = {
  algorithm_used: string;
  complexity_feedback: string;
  style_suggestion: string;
};

export type PredictionFeedback = {
  is_correct: boolean;
  feedback: string;
};

export type TestResult = {
  test_num: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
};

export type Result = {
  status: string;
  time_complexity?: string;
  complexity_class?: string;
  big_o_notation?: string;
  llm_feedback?: LLMFeedback;
  message?: string;
  traceback?: string;
  error_line?: number;
  prediction_feedback?: PredictionFeedback;
  test_results?: TestResult[];
};

export type ProblemState = {
  code: string;
  selectedOption: string | null;
  openEndedResponse: string;
  predictedOutput: string;
  result: Result | null;
};
