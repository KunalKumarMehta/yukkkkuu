"use client";

import React, { useRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import type { Result } from "../types";
import ConsoleOutput from "./ConsoleOutput";

type CodeWorkspaceProps = {
  code: string;
  onCodeChange: (value: string) => void;
  result: Result | null;
  /** Whether this is a FIND_REPLACE problem (shows prediction input). */
  isFindReplace: boolean;
  predictedOutput: string;
  onPredictionChange: (value: string) => void;
  hasPredictionResult: boolean;
};

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

/**
 * Monaco editor panel with an integrated console output area.
 * Optionally shows a prediction input for FIND_REPLACE problems.
 */
export default function CodeWorkspace({
  code,
  onCodeChange,
  result,
  isFindReplace,
  predictedOutput,
  onPredictionChange,
  hasPredictionResult,
}: CodeWorkspaceProps) {
  const monaco = useMonaco();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<Monaco.editor.IEditorDecorationsCollection | null>(null);

  const handleEditorMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    decorationsRef.current = editor.createDecorationsCollection([]);
  };

  // Highlight error lines in the gutter
  useEffect(() => {
    if (!editorRef.current || !decorationsRef.current || !monaco) return;

    if (result?.error_line) {
      decorationsRef.current.set([
        {
          range: new monaco.Range(result.error_line, 1, result.error_line, 1),
          options: {
            isWholeLine: true,
            className: "error-line-highlight",
            glyphMarginClassName: "error-glyph-margin",
            glyphMarginHoverMessage: { value: result.message || "Error on this line" },
          },
        },
      ]);
    } else {
      decorationsRef.current.set([]);
    }
  }, [result, monaco]);

  return (
    <PanelGroup direction="vertical">
      <Panel defaultSize={65} minSize={20} className="flex flex-col border-b border-zinc-800">
        <div className="flex-1 relative min-h-0 flex flex-col bg-[#1e1e1e]">
          {isFindReplace && (
            <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 shrink-0">
              <label className="block text-sm font-bold text-zinc-300 mb-2">
                Step 1: Predict Output / Error Message
              </label>
              <input
                type="text"
                value={predictedOutput}
                onChange={(e) => onPredictionChange(e.target.value)}
                disabled={hasPredictionResult}
                placeholder="e.g. It will output 19, or It will throw a ZeroDivisionError"
                className={`w-full border rounded p-2 text-sm focus:outline-none focus:border-blue-500 transition-colors ${
                  hasPredictionResult
                    ? "bg-zinc-900 border-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-800 border-zinc-700 text-zinc-200"
                }`}
              />
              <label className="block text-sm font-bold text-zinc-300 mt-4 mb-2">
                Step 2: Fix the Code
              </label>
            </div>
          )}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => onCodeChange(value || "")}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: isFindReplace ? 8 : 16 },
                scrollBeyondLastLine: false,
                glyphMargin: true,
              }}
            />
          </div>
        </div>
      </Panel>

      <ResizeHandle direction="vertical" />

      <Panel defaultSize={35} minSize={15} className="flex flex-col bg-[#1e1e1e]">
        <div className="p-4 overflow-y-auto font-mono text-sm flex-1">
          <ConsoleOutput result={result} />
        </div>
      </Panel>
    </PanelGroup>
  );
}
