"use client";

import React from "react";

type MCQWorkspaceProps = {
  options: { id: string; text: string }[];
  selectedOption: string | null;
  disabled: boolean;
  onSelect: (id: string) => void;
};

/** Renders selectable MCQ option cards. */
export default function MCQWorkspace({
  options,
  selectedOption,
  disabled,
  onSelect,
}: MCQWorkspaceProps) {
  return (
    <div className="flex-1 bg-[#1e1e1e] p-8 flex flex-col gap-4 overflow-y-auto h-full">
      <h2 className="text-xl font-bold mb-4">Select the correct answer:</h2>
      {options.map((opt) => {
        const isSelected = selectedOption === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => !disabled && onSelect(opt.id)}
            disabled={disabled}
            className={`text-left p-4 rounded-lg border transition-all ${
              isSelected
                ? "bg-blue-900/30 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                : "bg-zinc-900 border-zinc-700"
            } ${
              disabled
                ? isSelected
                  ? "opacity-100"
                  : "opacity-50 cursor-not-allowed"
                : "hover:border-zinc-500 hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-zinc-600 text-zinc-400"
                }`}
              >
                {opt.id}
              </div>
              <span className={isSelected ? "text-white" : "text-zinc-200"}>{opt.text}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
