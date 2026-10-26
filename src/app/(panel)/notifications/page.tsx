"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { AuthCheck } from "@/components/AuthCheck";
import { TYPE_COLOR } from "@/components/notifications/NotificationBell";
import { useTranslation } from "@/lib/useTranslation";
import { notificationsApi } from "@/lib/api";
import { useLanguage } from "@/stores/language";
import { useNotifications } from "@/stores/notifications";
import type { UserNotification } from "@/lib/types";

const PAGE_SIZE = 50;

export default function NotificationsPage() {
  return (
    <AuthCheck requireAuth={true}>
      {/* useSearchParams needs a Suspense boundary in the App Router */}
      <Suspense fallback={null}>
        <NotificationsInbox />
      </Suspense>
    </AuthCheck>
  );
}

function NotificationsInbox() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryCode = useLanguage((s) => s.countryCode);
  const refreshCount = useNotifications((s) => s.refreshCount);

  const [items, setItems] = useState<UserNotification[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("id"));

  // Loads one page; offset 0 replaces the list, any other offset appends to it
  const fetchPage = useCallback(
    async (offset: number) => {
      setIsLoading(true);
      setError(false);
      try {
        const { items: page } = await notificationsApi.list({ limit: PAGE_SIZE, offset, countryCode });
        setItems((prev) => (offset === 0 ? page : [...prev, ...page]));
        setHasMore(page.length === PAGE_SIZE);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [countryCode]
  );

  useEffect(() => {
    fetchPage(0);
  }, [fetchPage]);

  // Bell links to /notifications?id=... and that notification opens
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setSelectedId(id);
  }, [searchParams]);

  const selected = items.find((n) => n.id === selectedId) ?? null;

  const open = async (n: UserNotification) => {
    setSelectedId(n.id);
    router.replace(`/notifications?id=${n.id}`, { scroll: false });
    // Only direct notifications have a read state
    if (n.is_direct && !n.read) {
      try {
        const updated = await notificationsApi.setRead(n.id, true);
        setItems((prev) => prev.map((x) => (x.id === n.id ? updated : x)));
        refreshCount();
      } catch {
        // Stays unread; reopening the notification retries
      }
    }
  };

  const close = () => {
    setSelectedId(null);
    router.replace("/notifications", { scroll: false });
  };

  const openLink = (url: string) => {
    if (/^https?:\/\//.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      router.push(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("notifications.title")}</h1>
        <p className="text-sm text-muted mt-1">{t("notifications.page.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* List: stacked on mobile, sidebar on desktop */}
        <aside className="md:w-96 shrink-0 rounded-2xl border border-gray-200 bg-white overflow-hidden md:max-h-[70vh] md:overflow-y-auto">
          {error && <p className="px-4 py-3 text-sm text-red-600">{t("notifications.load_error")}</p>}

          {!error && !isLoading && items.length === 0 && (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">{t("notifications.empty")}</p>
          )}

          <ul>
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => open(n)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 flex gap-3 hover:bg-gray-50 ${n.id === selectedId ? "bg-gray-100" : ""}`}
                >
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_COLOR[n.type]}`} />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm truncate ${n.is_direct && !n.read ? "font-semibold" : "font-medium text-gray-700"}`}>
                      {n.title}
                    </span>
                    <span className="block text-xs text-gray-500 truncate">{n.body}</span>
                    <span className="block text-[11px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="p-3">
              <button
                type="button"
                onClick={() => fetchPage(items.length)}
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-200 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {t("notifications.load_more")}
              </button>
            </div>
          )}
        </aside>

        {/* Detail: full-screen overlay on mobile, side panel on desktop */}
        {selected ? (
          <article className="fixed inset-0 z-40 overflow-y-auto bg-white p-6 md:static md:z-auto md:flex-1 md:min-w-0 md:rounded-2xl md:border md:border-gray-200 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className={`h-2.5 w-2.5 rounded-full ${TYPE_COLOR[selected.type]}`} />
                  {t(`notifications.type.${selected.type}` as any)}
                </span>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{selected.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("notifications.close")}
                className="md:hidden shrink-0 rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-800">{selected.body}</p>

            {selected.link_url && (
              <button
                type="button"
                onClick={() => openLink(selected.link_url as string)}
                className="mt-8 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
              >
                {t("notifications.open_link")}
              </button>
            )}
          </article>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-300 p-8 text-sm text-gray-500">
            {t("notifications.select")}
          </div>
        )}
      </div>
    </div>
  );
}
