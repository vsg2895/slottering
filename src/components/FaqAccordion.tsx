type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ, from sites/slottering.html (`.faq`/`.fq` in its final layer):
 * white cards in ONE column, each a hard box that swaps its ink shadow for an
 * ORANGE one while it is open, with an amber mark that turns into an orange ×.
 * The first is open.
 *
 * One column, unlike the sibling sites' two: these cards carry a 4px offset
 * shadow, and two columns of them put a shadow directly against the next
 * card's border at every gutter width this layout allows.
 *
 * `align-self: start` is kept even so (`self-start`): it costs nothing in a
 * single column and is what stops a future two-column variant stretching a
 * closed card to match an open neighbour.
 *
 * The mark is drawn from two pseudo-elements rather than a "+" character.
 * A glyph's cross-bar sits off-centre in most faces, which is invisible until
 * it rotates 45° and the × comes out lopsided.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only this mark shows.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid grid-cols-1 gap-3.5">
      {items.map((item, i) => (
        <details
          key={item.question}
          open={i === 0}
          className="group self-start rounded-2xl border-[3px] border-line bg-paper px-5 shadow-[4px_4px_0_var(--color-ink)] open:shadow-[4px_4px_0_var(--color-brand)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
            {/* NOT `.font-display`: that class uppercases, and a question set
                in capitals reads as a demand rather than a question. The
                display FACE is kept, the transform is not. */}
            <h3 className="font-[family-name:var(--font-chakra)] text-[20px] font-semibold leading-[1.3] text-ink [overflow-wrap:anywhere]">{item.question}</h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span
              aria-hidden
              className="relative grid h-9 w-9 flex-none place-items-center rounded-[10px] border-[2.5px] border-line bg-surface transition-[transform,background-color] duration-200 group-open:rotate-45 group-open:bg-brand
                before:absolute before:h-[2.5px] before:w-3.5 before:rounded-sm before:bg-ink before:content-[''] group-open:before:bg-white
                after:absolute after:h-[2.5px] after:w-3.5 after:rotate-90 after:rounded-sm after:bg-ink after:content-[''] group-open:after:bg-white"
            />
          </summary>
          <p className="max-w-[760px] pb-5 text-[15px] leading-[1.7] text-ink-soft">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
