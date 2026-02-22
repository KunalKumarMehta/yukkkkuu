"use client";

import React from "react";
import {
  CheckCircle,
  AlertCircle,
  BrainCircuit,
  Sparkles,
  Code2,
} from "lucide-react";
import type { Result } from "../types";

type ConsoleOutputProps = {
  result: Result | null;
};

/**
 * Renders submission results: status badge, test-case table, complexity
 * info, AI feedback, prediction evaluation, and error details.
 */
export default function ConsoleOutput({ result }: ConsoleOutputProps) {
  if (!result) {
    return <div className="text-zinc-500 italic">Submit your answer to see results...</div>;
  }

  const hasInlineError = result.error_line != null;
  const StatusIcon = result.status === "Accepted" ? CheckCircle : AlertCircle;
  const statusColor = result.status === "Accepted" ? "text-green-400" : "text-red-400";

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-zinc-400">Status:</span>
        <span className={`flex items-center gap-1 ${statusColor} font-bold`}>
          <StatusIcon className="w-4 h-4" />
          {result.status}
        </span>
      </div>

      {/* Inline error pointer */}
      {hasInlineError && (
        <div className="text-red-400 mt-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Syntax or Runtime error on line {result.error_line}. Check the editor!
        </div>
      )}

      {/* Prediction feedback */}
      {result.prediction_feedback && (
        <div
          className={`mt-2 p-3 rounded-lg border ${
            result.prediction_feedback.is_correct
              ? "bg-green-900/20 border-green-500/20 text-green-200"
              : "bg-red-900/20 border-red-500/20 text-red-200"
          }`}
        >
          <h3 className="font-bold flex items-center gap-2 mb-1">
            <BrainCircuit className="w-4 h-4" /> Prediction Evaluation
          </h3>
          <p className="text-sm">{result.prediction_feedback.feedback}</p>
        </div>
      )}

      {/* Test cases */}
      {result.test_results && result.test_results.length > 0 && (
        <div className="mt-4 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-800">
            Test Cases
          </div>
          <div className="divide-y divide-zinc-800/50">
            {result.test_results.map((test) => (
              <div
                key={test.test_num}
                className={`p-3 text-sm flex flex-col gap-1.5 ${
                  test.passed ? "bg-green-900/5" : "bg-red-900/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-semibold text-zinc-300">Test {test.test_num}</span>
                </div>
                <div className="pl-6 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 text-xs">
                  <span className="text-zinc-500">Input:</span>
                  <code className="text-zinc-300">{test.input}</code>
                  <span className="text-zinc-500">Expected:</span>
                  <code className="text-green-400">{test.expected}</code>
                  {!test.passed && (
                    <>
                      <span className="text-zinc-500">Output:</span>
                      <code className="text-red-400">{test.actual}</code>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time complexity */}
      {result.big_o_notation && (
        <div>
          <span className="font-semibold text-zinc-400">Time Complexity: </span>
          <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded font-bold">
            {result.big_o_notation}
          </span>
          {result.complexity_class && (
            <span className="text-zinc-500 text-xs ml-2">({result.complexity_class})</span>
          )}
        </div>
      )}

      {result.time_complexity && !result.big_o_notation && (
        <div>
          <span className="font-semibold text-zinc-400">Time Complexity: </span>
          <span className="text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
            {result.time_complexity}
          </span>
        </div>
      )}

      {result.complexity_class && !result.big_o_notation && (
        <div>
          <span className="font-semibold text-zinc-400">Class: </span>
          <span className="text-purple-400">{result.complexity_class}</span>
        </div>
      )}

      {/* LLM feedback */}
      {result.llm_feedback && (
        <div className="mt-6 space-y-4 border-t border-zinc-800 pt-4">
          <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
            AI Feedback
          </h3>

          {result.llm_feedback.algorithm_used &&
            result.llm_feedback.algorithm_used !== "Open Ended Assessment" && (
              <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                <div className="text-xs text-zinc-400 mb-1 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                  <Code2 className="w-3.5 h-3.5" /> Detected Algorithm
                </div>
                <div className="text-zinc-200">{result.llm_feedback.algorithm_used}</div>
              </div>
            )}

          {result.llm_feedback.complexity_feedback && (
            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
              <div className="text-xs text-zinc-400 mb-1 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <BrainCircuit className="w-3.5 h-3.5" /> Assessment
              </div>
              <div className="text-zinc-200 text-sm leading-relaxed">
                {result.llm_feedback.complexity_feedback}
              </div>
            </div>
          )}

          {result.llm_feedback.style_suggestion && (
            <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/20">
              <div className="text-xs text-emerald-400 mb-1 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Style Suggestion
              </div>
              <div className="text-emerald-100 text-sm leading-relaxed">
                {result.llm_feedback.style_suggestion}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback message / traceback */}
      {!hasInlineError && result.message && !result.prediction_feedback && !result.test_results && (
        <div className="text-red-400 mt-2 p-3 bg-red-400/10 rounded border border-red-500/20 whitespace-pre-wrap">
          {result.message}
        </div>
      )}

      {!hasInlineError && result.traceback && (
        <div className="text-red-300 mt-2 text-xs opacity-80 whitespace-pre-wrap overflow-x-auto">
          {result.traceback}
        </div>
      )}
    </div>
  );
}
