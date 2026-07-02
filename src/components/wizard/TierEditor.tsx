"use client";

import { Plus, X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { Input } from "@/components/ui/Input";
import { formatAUD } from "@/lib/money";

const MAX_TIERS = 6;

/** Edit the locked contribution amounts for a fixed-tier pool. */
export function TierEditor({
  tiers,
  onChange,
}: {
  tiers: number[];
  onChange: (tiers: number[]) => void;
}) {
  const t = useTranslation();
  const setAt = (i: number, value: number) =>
    onChange(tiers.map((tier, idx) => (idx === i ? value : tier)));
  const removeAt = (i: number) => onChange(tiers.filter((_, idx) => idx !== i));
  const add = () => {
    if (tiers.length >= MAX_TIERS) return;
    const next = (tiers[tiers.length - 1] || 0) * 2 || 20;
    onChange([...tiers, next]);
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-medium">{t("wizard.contribution_tiers")}</label>
      <p className="text-xs text-muted -mt-1">
        {t("create.mode.tiers.description")}
      </p>
      <div className="space-y-2">
        {tiers.map((tier, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                min={1}
                step={5}
                prefix="A$"
                value={Number.isFinite(tier) && tier > 0 ? tier : ""}
                onChange={(e) => setAt(i, e.target.value ? Number(e.target.value) : 0)}
                placeholder={t("wizard.amount")}
              />
            </div>
            <button
              type="button"
              onClick={() => removeAt(i)}
              disabled={tiers.length <= 1}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-foreground/5 disabled:opacity-40"
              aria-label="Remove tier"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      {tiers.length < MAX_TIERS && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          <Plus size={14} /> {t("common.edit")}
        </button>
      )}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {tiers
          .filter((t) => t > 0)
          .map((t, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-foreground/5 font-medium">
              {formatAUD(t)}
            </span>
          ))}
      </div>
    </div>
  );
}
