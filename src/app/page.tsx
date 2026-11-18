import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero — the mockup's final opening. No slab and no panel: the dotted
            page ground IS the hero, closed at the bottom by the same 3px ink
            rule the header draws, with the claim left-aligned and the top
            three riding beside it on a near-black card.

            The highlighted phrase sits in an ORANGE BOX tilted 1.5°, which is
            the hero's whole device. The tilt is removed below `sm`: at phone
            width the box spans most of the line, and a rotated full-width
            block pushes its own corners outside the gutter. */}
        <section className="border-b-[3px] border-line">
          <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-5 sm:py-[72px]">
            <div className="grid grid-cols-1 items-center gap-10 min-[57rem]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] min-[57rem]:gap-14">
              <div>
                {/* Teal carries INK, never white — #00A39A under white is
                    3.13:1. The dot inherits that ink through currentColor. */}
                <p className="live inline-flex items-center gap-2.5 rounded-full border-[2.5px] border-line bg-accent px-[18px] py-2 text-[12.5px] font-bold uppercase tracking-[0.16em] text-accent-ink shadow-[3px_3px_0_var(--color-ink)]">
                  {COPY.home.heroEyebrow}
                </p>
                <h1 className="mt-6 max-w-[860px] font-display text-[clamp(40px,8vw,56px)] leading-[0.95] text-balance text-ink sm:text-[clamp(56px,6.6vw,88px)]">
                  {/* The tail is empty on this site — its claim ends on the
                      highlight — so it is rendered only when there IS one,
                      rather than leaving a trailing space in the heading. */}
                  {COPY.home.heroHeadline}{' '}
                  {/* The ONE place white sits on #FF5A1F. At 40px and up,
                      bold, this is display text, where the floor is 3:1 and
                      3.12 clears it; everywhere else on the site white goes on
                      `brand-btn` instead. */}
                  <em className="mt-[0.12em] inline-block rounded-xl border-[3px] border-line bg-brand px-[0.14em] not-italic text-white sm:-rotate-[1.5deg]">
                    {COPY.home.heroHighlight}
                  </em>
                  {COPY.home.heroHeadlineTail && <> {COPY.home.heroHeadlineTail}</>}
                </h1>
                <p className="mt-6 max-w-[640px] text-[17px] text-ink-soft sm:text-xl">{COPY.home.heroSubtitle}</p>
                <div className="mt-9 flex flex-wrap gap-3.5">
                  <Link href="/casinos" className="btn-or min-h-[56px] px-9 text-[17px]">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="btn-ln min-h-[56px] px-9 text-[17px]">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {/* The top three, on the mockup's white card beside the claim.
                  It replaces the sibling sites' podium strip, and it is the
                  one place on this site with a soft shadow — see `.hard-gold`
                  in globals.css.

                  The mockup prints a rank NUMERAL and a "Min. deposit" figure
                  per row. The numeral stays (its own final layer deletes it
                  from the casino CARDS, not from here, and this list is three
                  rows long and explicitly titled "top picks" — the position
                  IS the content). The deposit figure does not: nothing in the
                  API holds a minimum deposit, so that slot carries the
                  RATING, which is real data in the same shape. */}
              {casinos.length >= 3 && (
                <aside className="slab hard-gold overflow-hidden bg-navy" aria-labelledby="podium-heading">
                  {/* The head band is ORANGE under white at 15px bold —
                      #FF5A1F carries white at 3.12:1, so the band takes the
                      deeper `brand-btn` instead (5.22:1). The fill is
                      indistinguishable at this size; the label is readable. */}
                  <div className="flex items-center justify-between gap-3 bg-brand-btn px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
                    <h2 id="podium-heading" className="whitespace-nowrap font-sans text-[12px] font-semibold uppercase tracking-[0.1em]">
                      {COPY.home.podiumTitle}
                    </h2>
                    <span aria-hidden className="whitespace-nowrap">{COPY.home.podiumRatingLabel}</span>
                  </div>
                  <ol className="px-5 pt-1.5">
                    {casinos.slice(0, 3).map((c, i) => (
                      <li key={c.id} className="border-b border-night-line last:border-b-0">
                        {/* Tighter columns below `sm`: at 320px the padding,
                            the gap and the rank disc together left the name
                            92px, which wrapped "BitStarz" onto two lines. */}
                        <Link href={`/casinos/${c.slug}`} className="group grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 py-3.5 sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:gap-3.5 sm:py-4">
                          {/* The mockup's `.t3n`: a cream plate with an
                              orange edge. The numeral stays HERE — this
                              network prints no rank on a casino CARD, but
                              this list is three rows long and titled as
                              picks, so the position is the content. */}
                          <span aria-hidden className="grid h-10 w-9 place-items-center rounded-lg border-2 border-brand bg-cream font-display text-[17px] text-ink sm:h-[52px] sm:w-11 sm:text-[22px]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0">
                            {/* WRAPS rather than truncating. The card is ~280px
                                wide on a 320px phone, and with the rank disc and
                                the rating pill either side the name had about
                                150px — enough to turn "7 Bit Casino" into "7 Bit
                                Casi…". A list of top picks whose names are cut
                                off identifies nothing. */}
                            <span className="block font-display text-[17px] leading-tight text-white transition-colors [overflow-wrap:anywhere] group-hover:text-night-accent sm:text-[19px]">{c.name}</span>
                            <span className="mt-1 flex items-center gap-2 text-[13px] text-night-muted">
                              <Stars rating={c.rating} onDark />
                            </span>
                          </span>
                          <span className="rounded-lg bg-accent px-2 py-1 font-display text-[14px] text-accent-ink tabular-nums sm:px-2.5 sm:text-[15px]">
                            {c.rating.toFixed(1)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Link href="/casinos" className="inline-flex min-h-11 items-center px-5 pb-3 font-bold text-night-accent transition-colors hover:text-white">
                    {COPY.home.podiumAll} <span aria-hidden className="ml-1">→</span>
                  </Link>
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* The ranking — category tabs, then the casinos as cards.

            There is no marquee under this hero: the sibling sites' sliding
            band belongs to their designs, and this one closes the hero with a
            rule instead. `COPY.home.bandPhrases` is gone with it rather than
            left behind as a key nothing reads. */}
        <section className="pb-14 pt-12 sm:pb-[72px]" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            {/* `brand-dark`, not `brand`: orange on the cream ground is
                2.83:1, and this is 13px text. */}
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-dark">{COPY.home.rankingLabel}</p>
            <h2 id="top-casinos-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
              {COPY.home.topCasinosTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-6">
                <CategoryNav categories={categories} selected={selected} />
              </div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 rounded-[18px] border-[3px] border-dashed border-line bg-paper p-10 text-center text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={`mt-[22px] ${CASINO_LIST}`}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-6 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-12 px-[22px] text-[15px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Bonus types as one stacked bar. Renders nothing without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pb-14 sm:pb-[72px]">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* Bonuses — one card per type, built from the same getBonusArea
            payload as the mix bar and the menus. A site without the Bonus
            area keeps the flat grid below. */}
        {bonusSections.length > 0 ? (
          <section className="py-14 sm:py-[72px]" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="bonus-heading" className="font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
                  {COPY.home.bonus}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> bonuses</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="py-14 sm:py-[72px]" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="offers-heading" className="font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
                  {COPY.home.specialOffers}
                </h2>
                <Link href="/special-offers" className="-my-3 inline-flex min-h-11 items-center py-3 font-bold text-brand-dark transition-colors hover:text-ink">
                  {COPY.home.viewAll}<span className="sr-only"> special offers</span> <span aria-hidden className="ml-1">→</span>
                </Link>
              </div>
              <div className={`mt-6 ${OFFER_GRID}`}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How we rank — the stages of a review, as cards. */}
        <section className="px-2 py-14 sm:px-4 sm:py-[72px]" aria-labelledby="method-heading">
          <div className="mx-auto max-w-[1240px] rounded-[24px] bg-surface px-5 py-12 sm:rounded-[32px] sm:px-10">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-dark">{COPY.home.methodLabel}</p>
            <h2 id="method-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.4vw,54px)]">
              {COPY.home.methodTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.methodSubtitle}</p>
            <ol className="mt-[34px] grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step rounded-[20px] bg-paper p-[26px] shadow-[0_2px_0_var(--color-line)]">
                  <p className="inline-flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-brand-dark">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl border-[2.5px] border-line bg-brand-btn text-[15px] font-bold text-white">{step.no}</span>
                    {step.verb}
                  </p>
                  <h3 className="mt-2.5 font-display text-[22px] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[15px] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink-soft">
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* FAQ — the questions two across under their own head, as in the
            mockup. Every answer is in the HTML, open or closed, which the
            FAQPage schema above requires. */}
        <section className="pb-4 pt-14 sm:pt-[72px]" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-dark">{COPY.home.faqLabel}</p>
            <h2 id="faq-heading" className="mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.2vw,52px)]">
              {COPY.home.faqTitle}
            </h2>
            <p className="mt-3 max-w-[540px] text-ink-soft">{COPY.home.faqSubtitle}</p>
            <div className="mt-7">
              <FaqAccordion items={FAQ_ITEMS} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
