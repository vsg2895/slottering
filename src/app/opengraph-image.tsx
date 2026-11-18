import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // The cream page under its dot grid, framed in ink — the card is
          // the site's own hard box at 1200x630.
          background: '#fff3d6',
          backgroundImage:
            'radial-gradient(circle at 11px 11px, rgba(28,26,23,0.16) 1.5px, rgba(255,243,214,0) 2px)',
          backgroundSize: '22px 22px',
          border: '14px solid #1c1a17',
          color: '#1c1a17',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Ink on the teal chip, never white: #00A39A under white is
            3.13:1. The same rule the page's eyebrow follows. */}
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 8,
            textTransform: 'uppercase',
            background: '#00a39a',
            color: '#1c1a17',
            border: '5px solid #1c1a17',
            borderRadius: 999,
            padding: '12px 34px',
          }}
        >
          Slot Sites &amp; Bonus Rules
        </div>
        {/* Satori needs an EXPLICIT display on any element with more than one
            child — the wordmark is two coloured spans, so this one says flex
            rather than relying on the browser default it never sees. */}
        <div
          style={{
            display: 'flex',
            fontSize: 104,
            fontWeight: 700,
            textTransform: 'uppercase',
            marginTop: 28,
            padding: '0 60px',
          }}
        >
          {/* One word in two colours, so the two spans must touch exactly.
              The second half takes the DEEPER orange: #FF5A1F on this cream
              is 2.83:1, under even the 3:1 large-text floor. */}
          <span>Slot</span><span style={{ color: '#a52b05' }}>tering</span>
        </div>
        <div style={{ display: 'flex', fontSize: 30, marginTop: 34, color: '#3f3a33' }}>
          18+ · Gamble responsibly
        </div>
      </div>
    ),
    size,
  )
}
