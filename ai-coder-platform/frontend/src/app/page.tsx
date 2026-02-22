"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Loader2, CheckCircle, Menu, ArrowRight, Clock } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactMarkdown from "react-markdown";

import { useProblemStore } from "./hooks/useProblemStore";
import Sidebar from "./components/Sidebar";
import ConsoleOutput from "./components/ConsoleOutput";
import MCQWorkspace from "./components/MCQWorkspace";
import OpenEndedWorkspace from "./components/OpenEndedWorkspace";
import CodeWorkspace from "./components/CodeWorkspace";

// ── Small reusable resize handle ────────────────────────────────────

const ResizeHandle = ({ direction = "horizontal" }: { direction?: "horizontal" | "vertical" }) => (
  <PanelResizeHandle
    className={`flex items-center justify-center transition-colors bg-zinc-800 hover:bg-zinc-600 ${
      direction === "horizontal" ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize"
    }`}
  >
    <div
      className={`${
        direction === "horizontal" ? "h-8 w-0.5" : "w-8 h-0.5"
      } bg-zinc-600 rounded-full`}
    />
  </PanelResizeHandle>
);

// ── Page component ──────────────────────────────────────────────────

export default function Home() {
  const store = useProblemStore();
  const { problem, isRunning, isMCQ, isSubmitDisabled, hasNextProblem } = store;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Global timer
  useEffect(() => {
    const id = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // Cmd/Ctrl + Enter shortcut
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        store.handleSubmit();
      }
    },
    [store],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Loading state
  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen text-zinc-500 bg-[#0e0e0e]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isAccepted = store.result?.status === "Accepted";

  // ── Workspace renderer ────────────────────────────────────────────

  const renderWorkspace = () => {
    if (isMCQ) {
      return (
        <MCQWorkspace
          options={problem.options || []}
          selectedOption={store.selectedOption}
          disabled={!!store.isMCQDisabled}
          onSelect={store.setSelectedOption}
        />
      );
    }

    if (problem.type === "OPEN_ENDED") {
      return (
        <OpenEndedWorkspace
          value={store.openEndedResponse}
          onChange={store.setOpenEndedResponse}
        />
      );
    }

    return (
      <CodeWorkspace
        code={store.code}
        onCodeChange={store.setCode}
        result={store.result}
        isFindReplace={problem.type === "FIND_REPLACE"}
        predictedOutput={store.predictedOutput}
        onPredictionChange={store.setPredictedOutput}
        hasPredictionResult={store.hasPredictionResult}
      />
    );
  };

  // ── Layout ────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex bg-[#0e0e0e] text-zinc-300 overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        problems={store.problems}
        currentProblemId={store.currentProblemId}
        store={store.store}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={store.setCurrentProblemId}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full transition-all">
        {/* Header */}
        <header className="h-14 bg-[#1e1e1e] border-b border-zinc-800 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-zinc-700" />
            <span className="font-semibold text-sm text-zinc-400">
              <span className="text-white">{problem.title}</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded bg-zinc-800">
                {problem.type.replace("_", " ")}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Clock className="w-4 h-4 text-blue-500" />
              {formatTime(timeElapsed)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={store.handleSubmit}
                disabled={isSubmitDisabled}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold transition-colors disabled:opacity-50 ${
                  isSubmitDisabled
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed hover:bg-zinc-700"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
                title="Submit Answer (Cmd/Ctrl + Enter)"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isMCQ || problem.type === "OPEN_ENDED" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isRunning ? "Evaluating..." : "Submit Answer"}
              </button>

              {hasNextProblem && (
                <button
                  onClick={store.goToNextProblem}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm font-semibold transition-colors border border-zinc-700 hover:border-zinc-600"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 p-2 min-h-0">
          <PanelGroup
            direction="horizontal"
            className="h-full rounded-lg border border-zinc-800 overflow-hidden"
          >
            {/* Problem description */}
            <Panel
              defaultSize={40}
              minSize={20}
              className={`flex flex-col transition-colors duration-500 ${
                isAccepted ? "bg-emerald-950/20" : "bg-[#1e1e1e]"
              }`}
            >
              <div
                className={`px-4 py-2 border-b text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${
                  isAccepted
                    ? "bg-emerald-900/40 border-emerald-800/50 text-emerald-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400"
                }`}
              >
                Problem Description
              </div>
              <div
                className={`p-6 overflow-y-auto prose prose-invert max-w-none flex-1 transition-colors duration-500 ${
                  isAccepted
                    ? "text-emerald-100 prose-pre:bg-emerald-950/50 prose-pre:border-emerald-800/50"
                    : "text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border-zinc-800"
                }`}
              >
                <ReactMarkdown>{problem.description}</ReactMarkdown>
              </div>
            </Panel>

            <ResizeHandle direction="horizontal" />

            {/* Workspace + console */}
            <Panel minSize={30} className="flex flex-col bg-[#1e1e1e]">
              {isMCQ || problem.type === "OPEN_ENDED" ? (
                <PanelGroup direction="vertical">
                  <Panel
                    defaultSize={65}
                    minSize={20}
                    className="flex flex-col border-b border-zinc-800"
                  >
                    <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 shrink-0">
                      Workspace
                    </div>
                    {renderWorkspace()}
                  </Panel>
                  <ResizeHandle direction="vertical" />
                  <Panel defaultSize={35} minSize={15} className="flex flex-col bg-[#1e1e1e]">
                    <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 shrink-0">
                      Assessment Feedback
                    </div>
                    <div className="p-4 overflow-y-auto font-mono text-sm flex-1">
                      <ConsoleOutput result={store.result} />
                    </div>
                  </Panel>
                </PanelGroup>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-400 shrink-0 flex justify-between">
                    <span>Solution.py</span>
                  </div>
                  <div className="flex-1 min-h-0">{renderWorkspace()}</div>
                </div>
              )}
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
