"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatAUD } from "@/lib/money";
import { uid } from "@/lib/slug";
import type { ContributionItem } from "@/lib/types";

const MAX_ITEMS = 10;

export function ItemEditor({
  items,
  onChange,
}: {
  items: ContributionItem[];
  onChange: (items: ContributionItem[]) => void;
}) {
  const addItem = () => {
    if (items.length >= MAX_ITEMS) return;
    const newItem: ContributionItem = {
      id: uid("item"),
      label: "",
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, updates: Partial<ContributionItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const validItems = items.filter((i) => i.label.trim() && i.amount > 0);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="grid grid-cols-1 md:flex gap-2 items-end">
          <Input
            label={idx === 0 ? "Item name" : undefined}
            placeholder="e.g. Gift Fund"
            value={item.label}
            onChange={(e) => updateItem(idx, { label: e.target.value })}
          />
          <Input
            label={idx === 0 ? "Price" : undefined}
            type="number"
            min={0}
            step={5}
            prefix="A$"
            value={item.amount || ""}
            onChange={(e) =>
              updateItem(idx, { amount: e.target.value ? Number(e.target.value) : 0 })
            }
          />
          <button
            type="button"
            onClick={() => removeItem(idx)}
            disabled={items.length === 1}
            className="mb-0 h-11 w-11 rounded-2xl flex items-center justify-center hover:bg-red-50 disabled:opacity-50 disabled:hover:bg-transparent text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        disabled={items.length >= MAX_ITEMS}
        className="w-full h-11 rounded-2xl border border-dashed border-border text-sm font-medium text-muted hover:text-foreground hover:bg-foreground/5 disabled:opacity-50"
      >
        <Plus size={14} className="inline mr-1" />
        Add another item
      </button>

      {validItems.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted mb-1.5">Preview</p>
          <div className="flex flex-wrap gap-2">
            {validItems.map((item) => (
              <div
                key={item.id}
                className="px-3 py-1.5 rounded-2xl bg-foreground/5 text-sm font-medium"
              >
                {item.label} · {formatAUD(item.amount)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
