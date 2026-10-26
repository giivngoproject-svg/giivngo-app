"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/stores/notifications";
import { useNotificationsSync } from "@/components/notifications/useNotificationsSync";
import { useTranslation } from "@/lib/useTranslation";
import type { NotificationType, UserNotification } from "@/lib/types";

const LIST_LIMIT = 20;

// Color of the circle per notification type (shown in the legend at the bottom of the card)
export const TYPE_COLOR: Record<NotificationType, string> = {
  maintenance: "bg-amber-500",
  important: "bg-red-500",
  recommendation: "bg-blue-500",
  general: "bg-gray-400",
};

const TYPES: NotificationType[] = ["maintenance", "important", "recommendation", "general"];

/**
 * Notification bell with unread badge and dropdown list.
 * Rendered only for logged-in users, so the sync hook runs once per page.
 */
export function NotificationBell() {
  useNotificationsSync(true);

  const t = useTranslation();
  const router = useRouter();

  const { items, unreadCount, isLoading, error, load } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) load({ limit: LIST_LIMIT });
  };

  // The inbox opens this notification, where it is marked as read
  const handleClick = (n: UserNotification) => {
    setOpen(false);
    router.push(`/notifications?id=${n.id}`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={t("notifications.title")}
        className="relative p-2 rounded-full hover:bg-foreground/5"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-lg z-20">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold">{t("notifications.title")}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push("/notifications");
                }}
                className="text-xs font-medium text-accent hover:underline"
              >
                {t("notifications.view_all")}
              </button>
            </div>

            {error && <p className="px-4 py-3 text-sm text-red-600">{t("notifications.load_error")}</p>}

            {!error && !isLoading && items.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">{t("notifications.empty")}</p>
            )}

            <ul>
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(n)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex gap-3 ${n.is_direct && n.read ? "opacity-70" : ""}`}
                  >
                    <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_COLOR[n.type]}`} />
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm truncate ${n.is_direct && !n.read ? "font-semibold" : "font-medium"}`}>{n.title}</span>
                      <span className="block text-xs text-gray-600 mt-0.5 line-clamp-2">{n.body}</span>
                      <span className="block text-[11px] text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Legend: color per notification type */}
            <div className="px-4 py-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-600 border-t border-gray-200">
              {TYPES.map((type) => (
                <span key={type} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${TYPE_COLOR[type]}`} />
                  {t(`notifications.type.${type}` as any)}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
