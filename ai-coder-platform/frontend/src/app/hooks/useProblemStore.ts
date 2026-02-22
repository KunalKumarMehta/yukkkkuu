"use client";

import { useState, useEffect, useCallback } from "react";
import type { Problem, ProblemState, Result } from "../types";

const API_BASE = "http://localhost:8000";

/**
 * Manages problem-list fetching, current-problem selection, and per-problem
 * state (code, selected option, open-ended response, prediction, result).
 */
export function useProblemStore() {
  const [problems, setProblems] = useState<{ id: string; title: string; type: string }[]>([]);
  const [currentProblemId, setCurrentProblemId] = useState<string>("1");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [store, setStore] = useState<Record<string, ProblemState>>({});
  const [isRunning, setIsRunning] = useState(false);

  // ── Fetch problem list on mount ──────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/api/problems`)
      .then((res) => res.json())
      .then(setProblems)
      .catch((err) => console.error("Failed to fetch problems", err));
  }, []);

  // ── Fetch single problem on selection change ─────────────────────
  useEffect(() => {
    setProblem(null);
    fetch(`${API_BASE}/api/problem/${currentProblemId}`)
      .then((res) => res.json())
      .then((data: Problem) => {
        setProblem(data);
        setStore((prev) => {
          if (prev[currentProblemId]) return prev;
          return {
            ...prev,
            [currentProblemId]: {
              code: data.signature || "",
              selectedOption: null,
              openEndedResponse: "",
              predictedOutput: "",
              result: null,
            },
          };
        });
      })
      .catch((err) => console.error("Failed to fetch problem", err));
  }, [currentProblemId]);

  // ── Derived state from the store ─────────────────────────────────
  const current = store[currentProblemId];
  const code = current?.code ?? (problem?.signature || "");
  const selectedOption = current?.selectedOption ?? null;
  const openEndedResponse = current?.openEndedResponse ?? "";
  const predictedOutput = current?.predictedOutput ?? "";
  const result = current?.result ?? null;

  // ── State setters ────────────────────────────────────────────────
  const updateField = useCallback(
    (key: keyof ProblemState, value: ProblemState[keyof ProblemState]) => {
      setStore((prev) => {
        const existing = prev[currentProblemId] || {
          code: problem?.signature || "",
          selectedOption: null,
          openEndedResponse: "",
          predictedOutput: "",
          result: null,
        };
        return { ...prev, [currentProblemId]: { ...existing, [key]: value } };
      });
    },
    [currentProblemId, problem],
  );

  const setCode = useCallback((v: string) => updateField("code", v), [updateField]);
  const setSelectedOption = useCallback((v: string | null) => updateField("selectedOption", v), [updateField]);
  const setOpenEndedResponse = useCallback((v: string) => updateField("openEndedResponse", v), [updateField]);
  const setPredictedOutput = useCallback((v: string) => updateField("predictedOutput", v), [updateField]);
  const setResult = useCallback((v: Result | null) => updateField("result", v), [updateField]);

  // ── Submit handler ───────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_id: currentProblemId,
          code,
          selected_option_id: selectedOption,
          open_ended_response: openEndedResponse,
          predicted_output: predictedOutput,
        }),
      });
      setResult(await res.json());
    } catch (error) {
      setResult({ status: "Error", message: String(error) });
    } finally {
      setIsRunning(false);
    }
  }, [currentProblemId, code, selectedOption, openEndedResponse, predictedOutput, setResult]);

  // ── Navigation helpers ───────────────────────────────────────────
  const currentIndex = problems.findIndex((p) => p.id === currentProblemId);
  const hasNextProblem = currentIndex >= 0 && currentIndex < problems.length - 1;

  const goToNextProblem = useCallback(() => {
    if (hasNextProblem) {
      setCurrentProblemId(problems[currentIndex + 1].id);
    }
  }, [hasNextProblem, problems, currentIndex]);

  // ── Computed flags ───────────────────────────────────────────────
  const isMCQ = problem?.type.startsWith("MCQ_") || problem?.type === "MULTIPLE_CHOICE";
  const isMCQDisabled = isMCQ && !!result;
  const hasPredictionResult = problem?.type === "FIND_REPLACE" && !!result?.prediction_feedback;
  const isSubmitDisabled = isRunning || !!isMCQDisabled;

  return {
    // Data
    problems,
    problem,
    currentProblemId,
    store,
    // Per-problem state
    code,
    selectedOption,
    openEndedResponse,
    predictedOutput,
    result,
    // Setters
    setCurrentProblemId,
    setCode,
    setSelectedOption,
    setOpenEndedResponse,
    setPredictedOutput,
    setResult,
    // Actions
    handleSubmit,
    goToNextProblem,
    // Flags
    isRunning,
    isMCQ,
    isMCQDisabled,
    hasPredictionResult,
    isSubmitDisabled,
    hasNextProblem,
  };
}
