import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many region chips a card shows before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the home page's top-three list shows the same stars as a card.
 *
 * STARS ARE INK on this site, not gold. That is the mockup's own `--star`
 * (#1C1A17), and it is also the only value that works: the amber this design
 * uses for fills is 1.61:1 on white, which would make a filled star and an
 * empty one indistinguishable. `onDark` flips the pair for the near-black
 * top-three card, where ink would disappear instead.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 15px reads as a rendering fault. The
  // exact figure is printed beside it either way.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-ink' : 'text-ink'
  const off = onDark ? 'text-night-line' : 'text-line-soft'

  return (
    <span
      className="inline-flex items-center tracking-[1px] text-[15px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `casino cards v2` layer:
 * `minmax(min(100%,330px),1fr)`, so three across on a laptop and one on a
 * phone, with a 26px gutter that leaves room for the 6px offset shadow to
 * fall without touching its neighbour.
 *
 * Callers render `<ol className={CASINO_LIST}>`; the order of the list is the
 * ranking.
 */
export const CASINO_LIST = 'grid grid-cols-1 gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))]'

/**
 * A casino as a card — `.sc` in sites/slottering.html's final layer: a hard
 * box with a dark HEAD BAND carrying the score, then the logo plate beside the
 * name, the welcome bonus on an amber panel, the regions it accepts, and the
 * two actions under a dashed rule.
 *
 * The mockup's head band prints `#01`, and its body carries a two-cell stats
 * table of "Payout" and "Min. deposit". NEITHER ships:
 *
 *  - the rank numeral is this network's standing rule — the `<ol>` order IS
 *    the ranking, and a printed number duplicates it. `rank` is still accepted
 *    so callers did not have to change. The leader is marked instead by the
 *    ORANGE offset shadow its card takes (`.rw:first-child` in globals.css)
 *    and by the "Top pick" flag in its band — both driven by `rank === 1`, not
 *    by document position, so page 2 of /casinos does not crown its first row.
 *  - there is no payout-time or minimum-deposit column anywhere in the API, so
 *    the stats table would have to be invented. The band carries the score
 *    label instead, which is real data in the same place.
 *
 * The chips carry `countries`, which is real attached data.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li className={`rw flex flex-col overflow-hidden rounded-[20px] ${isLeader ? 'rw-top' : ''}`}>
      {/* The head band. ORANGE on the leader, ink on the rest — but on
          `brand-btn`, not `brand`: white on #FF5A1F is 3.12:1 and this band
          is 13px text. The fill is indistinguishable at this size. */}
      <header
        className={`flex items-center gap-2.5 px-[18px] py-3 ${isLeader ? 'bg-brand-btn text-white' : 'bg-navy text-night-ink'}`}
      >
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">{COPY.casinos.rating}</span>
        {isLeader && (
          <span className="rounded-full bg-white px-2.5 py-1 font-display text-[11px] tracking-[0.12em] text-ink">
            Top pick
          </span>
        )}
        <span className="ml-auto font-display text-[20px] tabular-nums">
          {casino.rating.toFixed(1)}
          <small className="ml-0.5 text-[13px] opacity-75">/5</small>
        </span>
      </header>

      <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4 px-5 pb-4 pt-5">
        {/* The logo plate. WHITE whenever there IS artwork: operator logos
            arrive with their own white ground baked in, and any other colour
            behind one shows as a hard rectangle. With no artwork the plate
            becomes an orange tile carrying the operator's name — the only
            case the mockup itself ever draws. A FIXED 96px column, never
            `auto`: operator artwork ranges from square to wide banner, and an
            auto track sizes itself to whichever image it happens to get. */}
        <div
          className={`flex h-24 items-center justify-center overflow-hidden rounded-[14px] border-[2.5px] border-line p-2 ${
            image ? 'bg-white' : 'bg-brand-btn'
          }`}
        >
          {image ? (
            <Image src={image} alt={`${casino.name} logo`} width={320} height={200} sizes="96px" className="h-full w-full object-contain" />
          ) : (
            <span className="px-0.5 text-center font-display text-[13px] leading-tight text-white [overflow-wrap:anywhere]">
              {casino.name}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-[24px] leading-[1.05] text-ink [overflow-wrap:anywhere]">{casino.name}</h3>
          <p className="mt-1.5 flex items-center gap-2 text-[15px] text-muted">
            <Stars rating={casino.rating} />
          </p>
        </div>
      </div>

      {/* The welcome bonus on the mockup's amber panel. Dropped entirely when
          the operator has none. Amber carries INK, never white (1.61:1). */}
      {casino.bonuses && (
        <div className="mx-5 mb-5 rounded-[14px] border-[2.5px] border-line bg-gold px-4 py-3.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">Welcome bonus</p>
          <p className="mt-1 font-display text-[20px] leading-[1.15] text-ink [overflow-wrap:anywhere]">
            {casino.bonuses}
          </p>
        </div>
      )}

      {shownRegions.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 px-5 pb-5" aria-label="Accepts players from">
          {shownRegions.map((country) => (
            <li key={country.id} className="rounded-full border-2 border-line bg-win-bg px-[11px] py-[3px] text-xs font-semibold text-win">
              {country.name}
            </li>
          ))}
          {extraRegions > 0 && (
            /* A count, not a tooltip: the full list is on the review page,
               and a hover affordance is invisible on a phone. */
            <li className="rounded-full border-2 border-line bg-surface px-[11px] py-[3px] text-xs font-semibold text-ink-soft">
              +{extraRegions} more
            </li>
          )}
        </ul>
      )}

      {/* `mt-auto` so every card in a row ends on its buttons whatever length
          the name, the bonus and the chip list run to.

          IT IS NOT THE GAP ABOVE THE RULE, and it used to be the only thing
          supplying one. `mt-auto` is whatever slack the card has left, so it
          is generous on a short card and EXACTLY ZERO on the tallest card in
          its row — which put the region chips hard against the dashed rule on
          precisely the card a reader looks at first. The gap now belongs to
          the content above (the bonus panel's `mb-5`, the chip list's `pb-5`),
          so 20px is the floor and `mt-auto` only ever adds to it. */}
      <div className="mt-auto grid grid-cols-1 gap-3 border-t-[2.5px] border-dashed border-line p-5 min-[22rem]:grid-cols-[1.4fr_1fr]">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="btn-or min-h-[46px] whitespace-nowrap px-4 text-sm"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link href={`/casinos/${casino.slug}`} className="btn-ln min-h-[46px] whitespace-nowrap px-4 text-sm">
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
