import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Slottering category tabs, from sites/slottering.html (`.tabs`/`.tab` in its
 * final layer): ONE segmented control — a white group inside the site's hard
 * box, 5px of padding, a squared tab per category, the current one filled ink
 * with its count in orange.
 *
 * The strip scrolls sideways rather than wrapping — the mockup keeps it on a
 * single line at every width, and `flex-1 basis-auto` lets the tabs share the
 * space evenly when they all fit. The group's own 3px border and offset
 * shadow are what make it read as one control rather than a row of buttons.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories">
      <ul className="no-scrollbar flex gap-0 overflow-x-auto rounded-[14px] border-[2.5px] border-line bg-paper p-[5px] shadow-[4px_4px_0_var(--color-ink)]" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="flex-1 basis-auto">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-[46px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-[9px] px-[18px] text-[15px] font-semibold ${
                  active ? 'bg-ink text-white hover:bg-ink' : 'text-ink'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={18} height={18} className="h-[18px] w-[18px] shrink-0" />
                )}
                <span>{c.name}</span>
                {/* The count is `brand` on the INK-filled tab (5.57:1) and
                    `muted` on the paper one. NOT `brand-dark`, which is the
                    value for orange on a LIGHT ground and only 2.44:1 here —
                    this is the one place on the site where the ground under
                    the brand colour is dark. */}
                {typeof c.casinos_count === 'number' && (
                  <span className={`text-[12.5px] font-bold ${active ? 'text-brand' : 'text-muted'}`}>{c.casinos_count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
