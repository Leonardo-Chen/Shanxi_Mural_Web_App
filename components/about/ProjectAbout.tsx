"use client";

import FixedNavigation from "@/components/FixedNavigation";
import TextureBackground from "@/components/TextureBackground";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function ProjectAbout() {
  const { locale, t } = useLocale();
  const lang = locale === "zh" ? "zh-CN" : locale === "it" ? "it" : "en";

  return (
    <div className="collection-root relative h-svh overflow-hidden">
      <TextureBackground />
      <FixedNavigation variant="collection" />

      <main className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-6 pt-[4.75rem] md:px-6 md:pt-24">
        <article className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-ink/12 bg-rice shadow-[0_18px_40px_rgb(33_51_56_/_18%)]">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
            <p className="type-meta text-cinnabar">{t("about.eyebrow")}</p>
            <h1 lang={lang} className="type-page mt-2">
              {t("about.title")}
            </h1>
            <p lang={lang} className="type-body mt-4 text-ink/80">
              {t("about.lead")}
            </p>

            <section className="mt-6 border-t border-ink/10 pt-5">
              <h2 className="type-meta text-gold">{t("about.projectTitle")}</h2>
              <p lang={lang} className="type-body mt-2 text-ink/80">
                {t("about.projectBody")}
              </p>
            </section>

            <section className="mt-5">
              <h2 className="type-meta text-gold">{t("about.playTitle")}</h2>
              <p lang={lang} className="type-body mt-2 text-ink/80">
                {t("about.playBody")}
              </p>
            </section>

            <section className="mt-5">
              <h2 className="type-meta text-gold">{t("about.collectTitle")}</h2>
              <p lang={lang} className="type-body mt-2 text-ink/80">
                {t("about.collectBody")}
              </p>
            </section>

            <p
              lang={lang}
              className="type-ui mt-6 border-t border-ink/10 pt-5 text-cinnabar"
            >
              {t("about.close")}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
