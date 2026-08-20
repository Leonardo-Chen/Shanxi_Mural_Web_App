"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteBrand from "./SiteBrand";
import BrandHeader from "./mural/BrandHeader";
import CanvasInstruction from "./mural/CanvasInstruction";
import StarCounter from "./StarCounter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { NavSection } from "./NavPanel";

interface FixedNavigationProps {
  compact?: boolean;
  variant?: "cover" | "home" | "matching" | "site";
  activeSection?: NavSection | null;
  onNavClick?: (section: NavSection) => void;
  onLogoClick?: () => void;
  instructionKey?: MessageKey;
}

const NAV_ITEMS: { id: NavSection; key: "nav.temples" }[] = [
  { id: "temples", key: "nav.temples" },
];

const navChip =
  "flex min-h-9 items-center border border-stone/15 bg-rice/90 px-3 py-2 font-sans text-[11px] tracking-wide shadow-sm transition-colors hover:border-stone/40 hover:bg-rice hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar md:text-xs";

function chipTone(active: boolean) {
  return active ? "text-ink" : "text-ink/60";
}

export default function FixedNavigation({
  compact = true,
  variant = "site",
  activeSection = null,
  onNavClick,
  onLogoClick,
  instructionKey,
}: FixedNavigationProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  const isCover = variant === "cover";
  const showSectionNav = !isCover;
  const isPostcards = pathname === "/postcards";
  const isInteractive = pathname.startsWith("/interactive");

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[85]">
      <div className="flex items-center justify-between gap-4 bg-gradient-to-b from-parchment/90 via-parchment/55 to-transparent px-5 py-5 md:px-6">
        <div
          className={`pointer-events-auto min-w-0 transition-all duration-700 ease-out ${
            compact ? "scale-90 origin-left" : "scale-100"
          }`}
        >
          {variant === "cover" || variant === "home" || variant === "matching" ? (
            <BrandHeader
              mode={variant === "cover" ? "cover" : "home"}
              onLogoClick={onLogoClick}
            />
          ) : (
            <SiteBrand
              compact={compact}
              href={onLogoClick ? null : "/"}
              onClick={onLogoClick}
            />
          )}
        </div>

        {(variant === "home" || variant === "matching") && (
          <div className="pointer-events-none min-w-0 flex-1 px-2 text-center md:px-4">
            <CanvasInstruction
              messageKey={
                instructionKey ??
                (variant === "matching" ? "match.hint" : "home.instruction")
              }
            />
          </div>
        )}

        <div className="pointer-events-auto flex shrink-0 items-center gap-3 md:gap-5">
          {isCover ? (
            <LanguageSwitcher />
          ) : (
            <>
              <StarCounter />
              <Link
                href="/postcards"
                aria-current={isPostcards ? "page" : undefined}
                className={`${navChip} ${chipTone(isPostcards)}`}
              >
                <span className="md:hidden">{t("nav.postcardsShort")}</span>
                <span className="hidden md:inline">{t("nav.postcards")}</span>
              </Link>
              {showSectionNav && (
                <nav
                  className={variant === "matching" ? "hidden md:block" : ""}
                  aria-label={t("nav.main")}
                >
                  <ul className="flex gap-3 md:gap-5">
                    <li>
                      <Link
                        href="/interactive/color-the-mural"
                        aria-current={isInteractive ? "page" : undefined}
                        className={`${navChip} ${chipTone(isInteractive)}`}
                      >
                        {t("nav.interactive")}
                      </Link>
                    </li>
                    {NAV_ITEMS.map((item) => {
                      const isActive = activeSection === item.id;
                      if (onNavClick) {
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => onNavClick(item.id)}
                              aria-current={isActive ? "true" : undefined}
                              className={`${navChip} ${chipTone(isActive)}`}
                            >
                              {t(item.key)}
                            </button>
                          </li>
                        );
                      }
                      return (
                        <li key={item.id}>
                          <Link
                            href="/"
                            className={`${navChip} ${chipTone(false)}`}
                          >
                            {t(item.key)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
              <LanguageSwitcher />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
