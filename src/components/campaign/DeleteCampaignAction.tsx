"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { useCampaigns } from "@/stores/campaigns";
import { Button } from "@/components/ui/Button";

/**
 * Soft delete of a campaign (the record is kept and flagged as deleted).
 * Only offered when the campaign has no contributions; otherwise only the explanation shows.
 * A contributionCount of null means the contributions are not loaded yet, so nothing is shown.
 *
 * variant "button": a regular button (desktop and dashboard).
 * variant "menu": a row inside a dropdown menu (mobile).
 */
export function DeleteCampaignAction({
  slug,
  contributionCount,
  onDeleted,
  variant = "button",
  onAction,
}: {
  slug: string;
  contributionCount: number | null;
  onDeleted?: () => void;
  variant?: "button" | "menu";
  // Called when the user picks the action (lets a menu close itself)
  onAction?: () => void;
}) {
  const t = useTranslation();
  const deleteCampaign = useCampaigns((s) => s.deleteCampaign);
  const [busy, setBusy] = useState(false);

  if (contributionCount === null) return null;

  if (contributionCount > 0) {
    return (
      <p className={variant === "menu" ? "px-3 py-2 text-xs text-muted" : "max-w-xs text-right text-xs text-muted"}>
        {t("campaign.delete.blocked")}
      </p>
    );
  }

  const handleDelete = async () => {
    onAction?.();
    const choice = await Swal.fire({
      title: t("campaign.delete.confirm_title"),
      text: t("campaign.delete.confirm"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("campaign.delete.button"),
      cancelButtonText: t("common.cancel"),
      confirmButtonColor: "#dc2626",
    });
    if (!choice.isConfirmed) return;

    setBusy(true);
    const ok = await deleteCampaign(slug);
    setBusy(false);

    if (ok) {
      await Swal.fire({ title: t("campaign.delete.done"), icon: "success", confirmButtonColor: "#1E1B4B" });
      onDeleted?.();
    } else {
      await Swal.fire({
        title: t("common.error"),
        text: useCampaigns.getState().error ?? undefined,
        icon: "error",
        confirmButtonColor: "#1E1B4B",
      });
    }
  };

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} />
        {t("campaign.delete.button")}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleDelete}
      disabled={busy}
      className="border-red-300 text-red-600 hover:bg-red-50"
    >
      <Trash2 size={14} />
      {t("campaign.delete.button")}
    </Button>
  );
}
