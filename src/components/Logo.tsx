import Link from 'next/link'

/**
 * Slottering brand mark, from sites/slottering.html: an orange tile with a 3px
 * ink edge — the site's own border, at logo size — carrying three cream REELS
 * with an ink pip on each, a slot machine reduced to its three windows.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * THE WORDMARK'S SECOND HALF IS NOT #FF5A1F on the light header. The mockup
 * sets it there, and orange on this cream is 2.83:1 — under the 3:1 that even
 * large bold text needs. It takes `brand-dark` (6.46:1) instead, which at
 * wordmark size is the same colour to the eye. On the near-black footer the
 * mockup's teal is used as drawn: 5.54:1.
 *
 * `onDark` is for the footer. One component, so the header's mark and the
 * footer's can never drift apart.
 *
 * `taglineClassName` lets a caller hide the tagline where the header runs out
 * of room, rather than shipping a second, shorter logo.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-paper'
      } ${className}`.trim()}
    >
      <svg viewBox="0 0 42 42" className="h-[38px] w-[38px] shrink-0 sm:h-[42px] sm:w-[42px]" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="39" height="39" rx="10" fill="#ff5a1f" stroke="#1c1a17" strokeWidth="3" />
        <rect x="8" y="12" width="7" height="18" rx="2" fill="#fff3d6" />
        <rect x="17.5" y="12" width="7" height="18" rx="2" fill="#fff3d6" />
        <rect x="27" y="12" width="7" height="18" rx="2" fill="#fff3d6" />
        <circle cx="11.5" cy="21" r="2" fill="#1c1a17" />
        <circle cx="21" cy="21" r="2" fill="#1c1a17" />
        <circle cx="30.5" cy="21" r="2" fill="#1c1a17" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className={`font-display text-[20px] tracking-[-0.03em] sm:text-[22px] ${onDark ? 'text-white' : 'text-ink'}`}>
          Slot<span className={onDark ? 'text-accent' : 'text-brand-dark'}>tering</span>
        </span>
        <span className={`mt-[5px] text-[10.5px] font-semibold uppercase tracking-[0.2em] ${onDark ? 'text-night-muted' : 'text-muted'} ${taglineClassName}`.trim()}>
          Slots &amp; casino reviews
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
