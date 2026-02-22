"use client";

import React from "react";
import { X } from "lucide-react";
import type { ProblemState } from "../types";

type SidebarProps = {
  problems: { id: string; title: string; type: string }[];
  currentProblemId: string;
  store: Record<string, ProblemState>;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

/** Slide-out problem-list sidebar with per-problem status badges. */
export default function Sidebar({
  problems,
  currentProblemId,
  store,
  open,
  onClose,
  onSelect,
}: SidebarProps) {
  return (
    <div
      className={`absolute z-20 top-0 left-0 h-full bg-[#1e1e1e] border-r border-zinc-800 transition-transform duration-300 w-64 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-zinc-800">
        <h2 className="font-bold text-lg">Curriculum</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-60px)]">
        {problems.map((p, idx) => {
          const pResult = store[p.id]?.result;
          const badge = !pResult ? (
            <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
              Pending
            </span>
          ) : pResult.status === "Accepted" ? (
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-1.5 py-0.5 rounded">
              Accepted
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold text-red-400 bg-red-900/30 border border-red-800/50 px-1.5 py-0.5 rounded">
              Failed
            </span>
          );

          return (
            <button
              key={p.id}
              onClick={() => {
                onSelect(p.id);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800 transition-colors flex flex-col gap-2 ${
                currentProblemId === p.id ? "bg-zinc-800 border-l-2 border-l-blue-500" : ""
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                  Lesson {idx + 1}
                </span>
                {badge}
              </div>
              <span className="text-sm font-medium text-zinc-200 truncate pr-2 block w-full">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
