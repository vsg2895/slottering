/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * explain THE SLOT RULES behind a bonus — spin value, game weighting, the
 * stake limit — because that is what this brand is. Its sibling affliliate
 * answers the neighbouring question (what an offer is worth in money) and
 * bettingbetway answers which casino to trust; neither may be echoed here.
 *
 * Nothing below claims a figure this site cannot show. The mockup's own FAQ
 * answers "we open real accounts, deposit, claim the bonus and request a
 * withdrawal" and "crypto is often same-day, cards two to five working days".
 * Neither ships: nothing here records a funded account or a timed withdrawal,
 * so the answers say what the site does instead, which is read the terms.
 */
export const FAQ_ITEMS = [
  {
    question: 'What is a free spin actually worth?',
    answer:
      'Whatever the operator fixes its value at, which is usually the minimum stake on one named slot — often €0.10 or €0.20 a spin. “200 free spins” at €0.10 is €20 of play, not €200, and the figure is on the terms page rather than the banner. The spin value, the game it is locked to and whether the winnings are cash or bonus funds are the three things that decide what the headline number means.',
  },
  {
    question: 'Why does game weighting matter so much?',
    answer:
      'Because it decides how long the wagering really takes. Slots normally count 100% toward it; table games often count 10%, and some count nothing at all. On a 40x bonus of €100 that is €4,000 of slot spins — or €40,000 of the same money staked on a game weighted at 10%. The weighting table is where an offer either stays reasonable or quietly stops being one.',
  },
  {
    question: 'What is the maximum stake while a bonus is running?',
    answer:
      'A cap, usually between €2 and €5 a spin, on what you may stake until the wagering is cleared. It is the clause most often broken by accident, and breaking it can void the bonus and anything won from it. We state it wherever the operator does, because a bonus you cannot spend at your usual stake is a different offer from the one on the banner.',
  },
  {
    question: 'Do you test the slots with real money?',
    answer:
      'No, and we do not say we do. What we do is read the terms page behind every offer and put what it says beside the headline figure — the spin value, the wagering, the games that count, the stake limit, the expiry and the licence. Where a number is not published, we leave it out rather than estimate it.',
  },
  {
    question: 'Do you earn money from these links?',
    answer:
      'Yes. We may be paid a commission when someone signs up through a link on this site, and the footer says so on every page. It never changes a score, a position on the board or what the rules section says about an offer — an operator with hostile terms reads as one here whether it pays us or not.',
  },
  {
    question: 'Why do some casinos have no bonus listed?',
    answer:
      'Because the operator is not running one we can state in full. An offer goes on the board when its terms are published and readable; if the wagering, the weighting or the stake limit is missing, the casino is still listed and its bonus slot stays empty rather than carrying a figure with nothing behind it.',
  },
  {
    question: 'How often is the board re-read?',
    answer:
      'Weekly, and whenever an operator rewrites its terms. Slot bonuses change quietly — a weighting table is edited, a stake limit drops, an offer lapses — so a lapsed bonus comes off the board, a revised one is read again, and an operator moves when its rules move.',
  },
  {
    question: 'Is a bigger bonus always the better one?',
    answer:
      'No. A 300% match with 60x wagering on deposit plus bonus, a €2 stake cap and seven days to clear it is a harder offer than a plain 100% match at 25x with a month to run. The headline percentage is the one number on the page that is free to print; the rules around it are what the money has to pass through.',
  },
] as const
