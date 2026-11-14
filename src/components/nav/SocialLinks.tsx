import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { SOCIAL_LINKS, type SocialId } from "@/lib/socials";

const ICONS: Record<SocialId, IconDefinition> = {
  instagram: faInstagram,
  facebook: faFacebookF,
  tiktok: faTiktok,
};

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-4 ${className}`} aria-label="Redes sociales de giivngo">
      {SOCIAL_LINKS.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`giivngo en ${s.label}`}
            title={s.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF]"
          >
            <FontAwesomeIcon icon={ICONS[s.id]} className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
