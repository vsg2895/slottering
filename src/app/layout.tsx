import type { Metadata, Viewport } from 'next'
import { Chakra_Petch, Rubik } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The two faces of sites/slottering.html: Chakra Petch, a squared display
// face, for every heading, button and figure, over Rubik for everything read as
// text.
//
// CHAKRA PETCH STOPS AT 700. There is no 800 — `.font-display` pins 700, and
// an `font-bold` anywhere on this site would make the browser synthesise a
// heavier weight by smearing the outlines. The same trap microgamblin
// documents for Space Grotesk.
const rubik = Rubik({ variable: '--font-rubik', subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const chakra = Chakra_Petch({ variable: '--font-chakra', subsets: ['latin'], weight: ['500', '600', '700'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Slottering'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff3d6',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A header link — the mockup's final `.hdr .nav a`: ink text in a squared box
 *  whose 2.5px border is TRANSPARENT at rest and inks in on hover, bringing the
 *  site's offset shadow with it. The border is reserved at rest rather than
 *  added on hover, or every link would shift 2.5px when the pointer arrived. */
const NAV_LINK =
  'flex min-h-11 items-center whitespace-nowrap rounded-[10px] border-[2.5px] border-transparent px-4 py-2 text-[15px] font-semibold text-ink transition-all hover:border-line hover:bg-paper hover:shadow-[3px_3px_0_var(--color-ink)]'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-sm text-night-ink transition-colors hover:text-night-accent'

/** A footer column head — the mockup's `.ftr h4`: the display face, white. */
const FOOTER_HEAD = 'font-display text-base text-white'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette. */
const NAV_PANEL = {
  panelClassName: 'bg-paper ring-[3px] ring-line shadow-[6px_6px_0_var(--color-ink)]',
  itemClassName: 'text-ink-soft hover:bg-surface hover:text-ink',
  allItemClassName: 'text-ink hover:bg-surface hover:text-ink',
  arrowClassName: 'text-brand-dark',
}

/** The phone menu (below `lg`), in this site's own palette. */
const NAV_MOBILE = {
  triggerClassName: 'border-[2.5px] border-line text-ink hover:bg-surface hover:text-ink',
  panelClassName: 'bg-paper border-line border-[3px]',
  rowClassName: 'text-ink hover:bg-surface hover:text-ink',
  rowExpandedClassName: 'bg-surface text-ink',
  allClassName: 'text-ink hover:bg-surface hover:text-ink',
  childClassName: 'text-ink-soft hover:bg-surface hover:text-ink',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${rubik.variable} ${chakra.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* Header — the mockup's final `.hdr`: the cream page ground carried
            full width, closed by a 3px ink rule. No pill, no blur, no float:
            on this site a border is the structure, and the rule under the
            header is the same 3px every card draws.

            OPAQUE, not tinted: the page ground is a dot grid, and a
            translucent header would show the dots sliding under the wordmark
            as the page scrolls. */}
        <header className="sticky top-0 z-40 border-b-[3px] border-line bg-cream">
          <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <Logo taglineClassName="hidden xl:block" />
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center gap-0.5" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href}>
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* Below lg the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              hideFrom="lg"
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        <div className="flex-1">{children}</div>

        {/* Subscribe — the mockup's `.strip-mg`: a full-bleed TEAL band ruled
            top and bottom, sitting directly on the footer.

            One capture point at every width, which is the reason it is here
            rather than in the header: this design has no room for a field
            inside the header rule, and a form that only appears above `lg`
            leaves a phone with no way to subscribe at all.

            Teal carries INK here, never white — #00A39A under white is
            3.13:1. The button is amber for the same reason. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-24 border-y-[3px] border-line bg-accent" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-4 py-9 sm:px-5">
              <div className="min-w-[260px] flex-[1_1_320px]">
                <h2 className="font-display text-[clamp(24px,3vw,34px)] leading-tight text-accent-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-1.5 text-[15px] text-accent-ink">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` so the form renders the FIELD alone: the band
                  above already carries the heading and the line under it, and
                  the form's own intro would print both a second time. */}
              <NewsletterForm compact className="min-w-[260px] flex-[1_1_380px] lg:max-w-[460px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's final `.ftr`: FULL BLEED near-black, square
            to the viewport edges, carrying the brand and its line, Explore /
            Legal / Policies, the 18+ panel and the legal bar.

            Not inset and not rounded, unlike the sibling sites': the teal
            subscribe band above it already runs edge to edge, and an inset
            slab under a full-bleed band reads as two unrelated footers. The
            band's lower rule is this footer's top edge. */}
        <footer className="bg-navy text-night-ink">
          <div className="mx-auto max-w-[1240px] px-4 pb-7 pt-10 sm:px-5">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-3.5 text-sm text-night-ink">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-2.5`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ panel. Not `aria-hidden`: the sentence beside it never
                says the age, so a screen reader needs the "18+" too. The mark
                is the mockup's `.age`: a pink RING with pink numerals, not a
                filled pill — pink is 1.6:1 against white and could not carry
                white text here. */}
            <div className="mt-9 flex flex-wrap items-center gap-4 rounded-[20px] border border-night-line bg-navy-2 px-5 py-[18px]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-accent text-[12px] font-bold text-accent">18+</span>
              <p className="min-w-0 flex-[1_1_300px] text-sm text-night-ink">
                <b className="text-white">Gamble responsibly.</b> {COPY.footer.disclaimer}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-3 text-[13px] text-night-muted">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
