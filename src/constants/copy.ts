/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * slottering's angle: THE REELS AND THE RULES. Its unit is the SPIN. A reader
 * arrives holding a slots offer — "200 free spins", "40x wagering", "100% up
 * to €500" — and the questions that decide whether it is worth taking are all
 * spin-level ones: what a free spin is actually worth, which games count
 * toward the wagering and at what weighting, what the maximum stake is while a
 * bonus is live, and how many spins the multiplier really costs. So the
 * writing stays at the reels. Its sibling affliliate decodes an OFFER in
 * money; bettingbetway ranks CASINOS on their terms; this one reads the
 * SLOT rules behind the offer. Taken from the brief in sites/slottering.html.
 *
 * ── Three lines this file does not cross ────────────────────────────────────
 * 1. The mockup's lead says "we play the slots, claim the bonuses and cash
 *    out", its cards print an "Avg. payout time" and a "Min. deposit", and its
 *    FAQ promises "the times we actually observed". NONE of it ships: nothing
 *    here records a funded account, a timed withdrawal or a deposit minimum,
 *    so no wording claims one. What this site can honestly say is that it
 *    reads the slot rules rather than the banner, and that is what the copy
 *    says instead.
 * 2. The mockup also sells "casinos and sportsbooks". The API serves casinos,
 *    so every line here says casinos.
 * 3. The mockup's review page prints a "Slottering Score" per operator. The
 *    vocabulary is kept; the number behind it is only ever `casino.rating`,
 *    which is real. No second figure is invented to sit beside it.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Slot Sites & Bonus Rules',
    description:
      'reads the slot rules behind a casino bonus — what a free spin is worth, which games count toward the wagering and at what weighting, and the maximum stake while the bonus is live.',
    keywords: [
      'free spins worth',
      'slot bonus wagering explained',
      'game weighting casino bonus',
      'max bet while wagering',
      'slot sites compared',
    ],
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    bonus: 'Bonuses',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type row.
     *
     * The row carries a heading rather than letting the cells speak for
     * themselves: arriving mid-page at a band of unlabelled buttons, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for this
     * page.
     *
     * Worded differently on every domain, like every other <h2> here: the
     * sites serve one catalogue, and a shared heading is duplicate content.
     */
    bonusTypesTitle: 'Browse by bonus type',
    heroEyebrow: 'Slot rules, re-read weekly',
    // Split in two so the JSX keeps its emphasised highlight while the words
    // change. The highlight is the brand's own phrase, and it is the part set
    // in the orange box.
    heroHeadline: 'Spin where the',
    heroHighlight: 'terms are fair.',
    heroHeadlineTail: '',
    heroSubtitle:
      'A slots bonus is won or lost in its rules: what a free spin is worth, which games count toward the wagering, and what you are allowed to stake while it runs. We read those, then rank.',
    // The head of the hero's top-three card, and the label over its right-hand
    // column. The mockup's column is "Min. deposit"; nothing in the API holds
    // one, so the slot carries the rating.
    podiumTitle: 'Jackpot picks',
    podiumRatingLabel: 'Rating',
    podiumAll: 'Full rankings',
    topCasinosTitle: 'Top rated slot sites',
    topCasinosSubtitle:
      'Ordered by how their slot bonuses read once the weighting, the cap and the stake limit are in. Filter by category.',
    featuredCasinos: 'Browse rankings',
    specialOffers: 'See bonus offers',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Slot Sites & Casino Bonuses',
    faqTitle: 'Straight answers.',
    faqSubtitle: 'How a slots offer gets read, and what goes on the board before it earns a place.',
    metaDescription:
      'Slot sites and casino bonuses with their rules read out loud: free-spin value, game weighting toward the wagering, the stake limit while a bonus runs and the licence behind it.',
    // ── The "How we rank" band ─────────────────────────────────────────────
    // Three steps, numbered, because they ARE a sequence: each one happens
    // after the one before it. Numbering a set that is not ordered is
    // decoration; numbering this one is information.
    methodTitle: 'How a slots offer gets read',
    methodSubtitle: 'Every bonus on this board goes through the same three passes, in the same order.',
    methodSteps: [
      {
        no: '01',
        verb: 'Count',
        title: 'The spins, not the slogan',
        body:
          '“200 free spins” says nothing until the spin value is in. At €0.10 a spin that is €20 of play, and the figure comes off the operator’s own terms page rather than the banner.',
      },
      {
        no: '02',
        verb: 'Weigh',
        title: 'What counts, and for how much',
        body:
          'Slots usually count 100% toward wagering, table games often 10% or nothing at all — and a maximum stake applies while the bonus is live. The weighting table decides how long the multiplier really takes.',
      },
      {
        no: '03',
        verb: 'Re-read',
        title: 'Again, later',
        body:
          'Terms change quietly. Lapsed offers come off the board, revised ones are read again, and an operator moves when its slot rules move.',
      },
    ],
    methodLabel: '03 — The method',
    // Under the three stages: the cycle closes back on the first.
    methodLoop: 'And back to the first pass whenever an operator rewrites its bonus terms',
    // ── The hero card: what one pass re-reads ────────────────────────────
    // The same three things the FAQ and the method name — no figure this
    // site does not hold.
    monitorTitle: 'What each pass re-reads',
    monitorStatus: 'Weekly',
    monitorReads: [
      { label: '01 · The spins', text: 'Spin value, and how many of them' },
      { label: '02 · The weighting', text: 'Which games count, and the stake limit' },
      { label: '03 · The licence', text: 'Which regulator the operator names' },
    ],
    monitorNote: 'An operator moves when its slot rules move. Lapsed bonuses come off the board.',
    rankingLabel: '01 — The board',
    bonusTypesKicker: '02 — By type',
    bonusesLabel: '04 — The offers',
    faqLabel: '05 — Straight answers',
  },
  casinos: {
    pageTitle: 'Every Slot Site On The Board',
    pageDescription:
      'The full list, each operator shown with the bonus it is running, how that bonus reads once the slot rules are in, and where it places in its category.',
    // H2 over the offers block on a casino page.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other slot sites worth a look',
    reviewTitleTail: 'Slots & Bonus Rules',
    reviewSignature: 'Every bonus here read from the operator’s own terms page.',
    reviewSummary: 'with its slot bonuses read from the operator’s own terms rather than its banner.',
    visitCasino: 'Open Casino',
    readReview: 'Read The Review',
    rating: 'Slottering score',
    noResults: 'No casinos match this filter yet. Try another category.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix:
      'every bonus of this kind on the board right now — the spins, the wagering it carries, the games that count toward it and whose offer it is.',
    countOne: 'bonus',
    countMany: 'bonuses',
  },

  specialOffers: {
    pageTitle: 'Every Bonus On The Board',
    pageDescription:
      'The whole board in one place: each slots offer with its wagering, its spin count and its stake limit stated wherever the operator states them.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own terms page before it went on the board.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses are on the board right now.',
  },
  categories: {
    pageTitle: 'Slot Sites By Category',
    pageDescription: 'Same three passes behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the sites distinct there.
    categoryMetaSuffix:
      'ordered by how their slot bonuses read: the spin value, the game weighting behind the wagering and the licence named on the terms page.',
    noResults: 'Nothing on the board here yet.',
  },
  newsletter: {
    title: 'Free spins, first.',
    subtitle: 'One email a week: the slot bonuses worth claiming, and the ones whose rules killed them.',
    placeholder: 'Email for weekly spin picks',
    button: 'Subscribe',
    // The teal band above the footer — this site's only capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandTitle: 'Free spins, first. Straight to your inbox.',
    bandSubtitle: 'New slot-site reviews, the bonuses that survived their own rules, and every ranking change — one short email.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column.
    tagline:
      'Independent slot-site reviews and rankings. We may earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    // Supplied 2026-11-18. Must stay identical to this site's
    // `registered_address` in the admin (Sites -> Edit -> Legal identity),
    // which is what the legal pages and the email templates print: two
    // different addresses for one brand is a compliance problem, not a typo.
    postalAddress: '63 Hawthorn Crescent, York, YO24 1MN, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not on the board.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to say how the spins worked out.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether the bonus cleared as written',
    bodyPlaceholder: 'How did the wagering actually go — game weighting, stake limit, cap?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
