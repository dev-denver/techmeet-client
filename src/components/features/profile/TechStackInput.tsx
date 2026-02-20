"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface TechStackInputProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [input, setInput] = useState("");

  function addTech() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTech();
            }
          }}
          placeholder="기술 입력 후 Enter"
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <button
          type="button"
          onClick={addTech}
          className="px-3 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium"
        >
          추가
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full"
            >
              {tech}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tech))}
                aria-label={`${tech} 삭제`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
