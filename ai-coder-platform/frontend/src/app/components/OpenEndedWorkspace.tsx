"use client";

import React from "react";

type OpenEndedWorkspaceProps = {
  value: string;
  onChange: (value: string) => void;
};

/** Full-height text area for open-ended responses. */
export default function OpenEndedWorkspace({ value, onChange }: OpenEndedWorkspaceProps) {
  return (
    <div className="flex-1 bg-[#1e1e1e] p-6 flex flex-col h-full">
      <h2 className="text-lg font-bold mb-2">Your Answer:</h2>
      <p className="text-sm text-zinc-400 mb-4">
        Explain the concept clearly. Use pseudocode if applicable.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-zinc-200 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm leading-relaxed"
        placeholder="Type your response here..."
      />
    </div>
  );
}
