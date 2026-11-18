import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid offer cards sit in — the mockup's `bonus coupons v2` layer:
 * `minmax(min(100%,300px),1fr)` with a 26px gutter, so the 6px offset shadow
 * has somewhere to fall.
 *
 * `coupon-grid` is what drives the three-tone cycle on the cards' heads
 * (globals.css). A CSS `:nth-child` cycle is right HERE and wrong on the bonus
 * types: a coupon's colour is rhythm and carries no meaning, so repainting
 * when the set changes costs nothing.
 */
export const OFFER_GRID = 'coupon-grid grid grid-cols-1 gap-[26px] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — the mockup's COUPON (`.offer` in its
 * `bonus coupons v2` layer): a coloured head carrying whose bonus it is and
 * the amount in large display type, a DASHED tear line with a notch punched
 * out of each side, then the white stub with the offer's name, its stars and
 * the action. The whole card opens the offer (the title link is stretched over
 * it); the buttons sit above that layer.
 *
 * The head's fill cycles through three tones by position — see OFFER_GRID.
 * Every tone carries INK, not the mockup's white: #FF5A1F and #00A39A both
 * sit near 3.1:1 under white, which only passes as large text, and this head
 * also holds a 12px label. Ink is 5.5:1 or better on all three.
 *
 * The mockup's own `.oimg` banner plate is `display:none` in its final layer,
 * so no card here carries one.
 *
 * `logo` lets a casino page pass its own logo: the offers it lists arrive
 * without their casino attached, and every one of them is that casino's.
 */
export default function SpecialOfferCard({ offer, logo: logoOverride }: { offer: SpecialOffer; logo?: string | null }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const casinoName = offer.casino?.name ?? ''

  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="offer coupon relative flex flex-col overflow-hidden rounded-[18px]">
      {/* The coupon's head: whose bonus, then the amount in display type.
          Rendered even when the offer carries no `bonuses` string — the tag
          alone still needs the coloured ground, and the card would otherwise
          start on a tear line with nothing above it. */}
      <div className="coupon-head flex flex-col gap-3.5 px-[22px] pb-6 pt-5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-[2.5px] border-line bg-white p-1 text-[11px] font-bold text-ink">
            {logo ? (
              <Image src={logo} alt="" width={112} height={112} sizes="40px" className="h-full w-full object-contain" />
            ) : (
              initials(casinoName || offer.title)
            )}
          </span>
          {/* WHOSE bonus this is, above its amount: the first thing someone
              comparing offers needs. Omitted when the casino is not loaded. */}
          {casinoName && (
            <span className="min-w-0 truncate rounded-full bg-navy px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-night-ink">
              {casinoName}
            </span>
          )}
        </span>
        {offer.bonuses && (
          <p className="font-display text-[clamp(26px,2.6vw,32px)] leading-[1.02] text-ink [overflow-wrap:anywhere]">
            {offer.bonuses}
          </p>
        )}
      </div>

      <div className="coupon-stub relative flex flex-col gap-1.5 border-t-[3px] border-dashed border-line bg-paper p-[22px]">
        <h3 className="font-display text-[18px] leading-[1.25] tracking-[0.04em] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </h3>
        <span
          className="text-[13px] leading-none tracking-[1px] text-ink"
          role="img"
          aria-label={`${offer.rating} out of 5`}
        >
          {'★'.repeat(offer.rating)}
          <span className="text-line-soft" aria-hidden>
            {'★'.repeat(5 - offer.rating)}
          </span>
        </span>
        <div className="relative z-10 mt-auto flex gap-2 pt-2.5">
          {/*
            * Claim belongs to the Special Offers bonus type and to nothing else.
            *
            *   Special Offers + link   →  Details · Claim → the casino
            *   Special Offers, NO link →  Claim alone, leading to the offer's own
            *                              page, where the terms and the operator
            *                              are.
            *   any other bonus type    →  Details alone.
            */}
          {!(claimable && !offer.affiliate_url) && (
            <Link href={`/special-offers/${offer.slug}`} className="btn-ln min-h-11 flex-1 px-3 text-sm">Details</Link>
          )}
          {claimable && (
            offer.affiliate_url ? (
              <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 flex-1 px-3 text-sm">Claim</a>
            ) : (
              // No affiliate URL of its own: the offer's page is the only place
              // that can lead to the operator. An internal link, so no sponsored rel.
              <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 flex-1 px-3 text-sm">Claim</Link>
            )
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group card: the logo, whose offer it is, its name
 * and amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and turns pale periwinkle on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-line bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted">{kicker}</p>}
        <Heading className="text-[15px] font-bold leading-[1.3] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-sm font-semibold text-brand-dark [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="text-[13px] font-bold text-brand-dark">Details →</span>
        )}
      </div>
    </li>
  )
}
