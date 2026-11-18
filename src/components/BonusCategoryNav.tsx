import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * How many fills the cell cycle has — the six `.btype[data-tone]` rules in
 * globals.css. The TONE IS PASSED FROM HERE rather than selected in CSS with
 * `:nth-child`, because the grid's source order is the API's: hide one type in
 * the admin and a CSS cycle would silently repaint every cell after it.
 */
const TONES = 6

/**
 * One colour per bonus type, in order, each with the text colour that reads on
 * it at 4.5:1 or better. Kept for anything that needs an actual VALUE rather
 * than a cell tone; the six fills themselves live in globals.css.
 */
const TYPE_COLOURS: ReadonlyArray<{ bg: string; fg: string }> = [
  { bg: '#1f7a62', fg: '#ffffff' },
  { bg: '#6b5bd6', fg: '#ffffff' },
  { bg: '#c2651f', fg: '#ffffff' },
  { bg: '#2f7fd1', fg: '#ffffff' },
  { bg: '#14808f', fg: '#ffffff' },
  { bg: '#c43e68', fg: '#ffffff' },
  { bg: '#2b3fe0', fg: '#ffffff' },
  { bg: '#8a4e9c', fg: '#ffffff' },
]

/** The catch-all's colour, wherever it does appear (its group on the home page). */
const CATCH_ALL_COLOUR = { bg: 'var(--color-ink-soft)', fg: '#ffffff' }

/**
 * The colour of each section, by slug — shared by the mix bar, its keys and
 * the home page's bonus groups, so a type is the same colour everywhere.
 */
export function bonusTypeColours(sections: BonusSection[]): Map<string, { bg: string; fg: string }> {
  const colours = new Map<string, { bg: string; fg: string }>()
  sections
    .filter((section) => section.slug !== CATCH_ALL_SLUG)
    .forEach((section, i) => colours.set(section.slug, TYPE_COLOURS[i % TYPE_COLOURS.length]))
  colours.set(CATCH_ALL_SLUG, CATCH_ALL_COLOUR)
  return colours
}

/**
 * "Browse by bonus type", from sites/slottering.html's final layer
 * (`.btypes` / `.btype`): a GRID of hard-edged cells — three across on a
 * laptop, two on a tablet, one on a phone — whose fills cycle through the
 * palette, so the set reads as a block of colour rather than a row of chips.
 *
 * A grid here, unlike the sibling sites' flex row: these cells are coloured
 * blocks, and blocks of unequal width in a wrapped row leave ragged gaps that
 * a flat palette has nothing to hide behind. Equal cells are the design.
 *
 * Each cell opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null


  return (
    <nav aria-labelledby="bonus-types-heading">
      {/* `brand-dark`: orange on cream is 2.83:1 at 13px. */}
      <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand-dark">
        {COPY.home.bonusTypesKicker}
      </p>
      <h2 id="bonus-types-heading" className="mb-[26px] mt-3 font-display text-[32px] leading-[1.05] text-ink sm:text-[clamp(34px,4.2vw,52px)]">
        {COPY.home.bonusTypesTitle}
      </h2>

      <ul className="grid grid-cols-1 gap-[18px] min-[34rem]:grid-cols-2 lg:grid-cols-3" role="list">
        {types.map((section, i) => (
          <li key={section.id} className="min-w-0">
            <Link
              href={`/bonuses/${section.slug}`}
              data-tone={i % TONES}
              className="btype relative flex min-h-24 items-center gap-4 rounded-2xl p-5 pr-[76px] font-display text-[19px]"
            >
              {/* The icon plate is WHITE on every cell, never the type's own
                  colour: the cell behind it is already a flat fill, and a
                  second colour inside it has nothing to sit against. */}
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[2.5px] border-line bg-paper"
              >
                {/* The type's own icon, as in the Bonus menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {section.icon_path && (
                  <img src={resolveImageUrl(section.icon_path)!} alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                )}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">{section.name}</span>
              {/* Absolutely placed, as the mockup has it — the name is the
                  cell's content and should not be pushed around by a
                  two-digit count. Always paper under ink, so it reads the
                  same on all six fills. */}
              <span className="absolute right-5 top-1/2 shrink-0 -translate-y-1/2 rounded-full border-2 border-line bg-paper px-2.5 py-0.5 font-sans text-[13px] font-bold text-ink">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
