"use client";

import { useEffect, useState } from "react";
import Slider, { type Settings } from "react-slick";
import { formatDistanceToNowStrict } from "date-fns";
import { ChevronLeft, ChevronRight, PlayCircle, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTranslation } from "@/lib/useTranslation";
import { Avatar } from "@/components/nav/TopNav";
import { formatAUD } from "@/lib/money";
import type { Contribution } from "@/lib/types";

// Slick styles (global CSS from node_modules is allowed in the app router)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/** Desktop breakpoint: from here the wall fades every 3 seconds, two cards per slide. */
const DESKTOP_QUERY = "(min-width: 768px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

/**
 * Visible arrows for desktop. The slick theme draws its arrows with font glyphs,
 * which do not show when the theme font files are not served.
 */
function SlickArrow({
  className,
  onClick,
  direction,
}: {
  className?: string;
  onClick?: () => void;
  direction: "prev" | "next";
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        className,
        "!flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-soft z-10 before:hidden hover:bg-foreground/5",
        direction === "prev" ? "!left-2" : "!right-2",
      )}
    >
      <Icon size={18} />
    </button>
  );
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

/**
 * Live gift wall: one card per contribution with emoji, name, message and any
 * attached photo/video. `showAmounts` is turned off for mystery pools.
 */
export function GiftWall({
  contributions,
  showAmounts = true,
}: {
  contributions: Contribution[];
  showAmounts?: boolean;
}) {
  const t = useTranslation();
  const [mediaModal, setMediaModal] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const isDesktop = useIsDesktop();

  if (contributions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface/40 text-center py-12 text-sm text-muted">
        {t("campaign.gift_wall")} (0)
      </div>
    );
  }

  const sorted = contributions
    .slice()
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  const cards = sorted.map((c) => {
          // For private contributions with anonymous avatar
          const isAnonymous = c.is_private;
          const hasAnonymousAvatar = isAnonymous && c.anonymous_avatar;
          const displayName = hasAnonymousAvatar
            ? c.anonymous_avatar!.name
            : isAnonymous
              ? t("manage.anonymous")
              : c.contributor_name || t("manage.anonymous");

          // Determine what to show as avatar (left side)
          // Priority: Anonymous Avatar > Emoji > Placeholder > Generated Avatar
          // When anonymous: show only anonymous avatar or emoji, never generate from name
          const getAvatarDisplay = () => {
            if (hasAnonymousAvatar) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.anonymous_avatar!.imageUrl}
                  alt={c.anonymous_avatar!.name}
                  className="shrink-0 w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
              );
            } else if (c.emoji) {
              return (
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl border-2 border-accent/20">
                  {c.emoji}
                </div>
              );
            } else if (isAnonymous) {
              // For anonymous without avatar/emoji, show placeholder
              return (
                <div className="shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                  <span className="text-lg">🎭</span>
                </div>
              );
            } else {
              // For non-anonymous, generate avatar from name
              return (
                <div className="shrink-0">
                  <Avatar name={displayName} size={48} />
                </div>
              );
            }
          };

          return (
            <div
              key={c.id}
              className="animate-pop min-h-[142px] rounded-3xl border border-border bg-background p-4 flex flex-col gap-3"
            >
              {/* Header: Avatar/Emoji, Name, Amount */}
              <div className="flex items-start gap-3">
                {getAvatarDisplay()}

                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {displayName}
                  </p>
                  {showAmounts && (
                    <p className="text-sm font-semibold text-accent tabular-nums">{formatAUD(c.amount)}</p>
                  )}
                </div>
              </div>

              {/* Media buttons (photo/video) */}
              {(c.photo_url || c.video_url) && (
                <div className="flex gap-2">
                  {c.photo_url && (
                    <button
                      onClick={() => setMediaModal({ type: 'image', url: c.photo_url! })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors"
                    >
                      <ImageIcon size={12} />
                      {t("form.video_title")}
                    </button>
                  )}
                  {c.video_url && (
                    <button
                      onClick={() => setMediaModal({ type: 'video', url: c.video_url! })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors"
                    >
                      <PlayCircle size={12} />
                      {t("form.video_title")}
                    </button>
                  )}
                </div>
              )}

              {/* Message */}
              {c.message && (
                <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
                  {c.message}
                </p>
              )}

              {/* Footer: Time and Tip */}
              <p className="text-xs text-muted inline-flex items-center gap-1">
                {c.created_at ? (
                  <>
                    {formatDistanceToNowStrict(new Date(c.created_at))} {t("manage.ago")}
                  </>
                ) : null}
                {c.tip_amount ? <span className="text-accent">· +{formatAUD(c.tip_amount)} {t("manage.tip")}</span> : null}
              </p>
            </div>
          );
  });

  // Desktop: fade carousel of two-card slides with arrows, drag and autoplay. Mobile: horizontal swipe.
  const perSlide = isDesktop ? 2 : 1;
  const slides = chunk(cards, perSlide);
  const settings: Settings = isDesktop
    ? {
        dots: false,
        arrows: true,
        prevArrow: <SlickArrow direction="prev" />,
        nextArrow: <SlickArrow direction="next" />,
        swipe: true,
        draggable: true,
        infinite: slides.length > 1,
        autoplay: slides.length > 1,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        fade: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    : {
        dots: false,
        arrows: false,
        infinite: false,
        autoplay: false,
        fade: false,
        speed: 300,
        slidesToShow: 1.15,
        slidesToScroll: 1,
        swipeToSlide: true,
      };

  return (
    <>
      {/* key remounts the slider when the layout switches between desktop and mobile */}
      <Slider key={isDesktop ? "desktop" : "mobile"} {...settings}>
        {slides.map((group, index) => (
          <div key={index} className="px-1.5 pb-2">
            <div className={isDesktop ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"}>
              {group}
            </div>
          </div>
        ))}
      </Slider>

      {/* Media Modal */}
      {mediaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setMediaModal(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
            {mediaModal.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaModal.url}
                alt="Contribution photo"
                className="w-full rounded-lg"
              />
            ) : (
              <video
                src={mediaModal.url}
                controls
                className="w-full rounded-lg bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
