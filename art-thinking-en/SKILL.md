---
name: art-thinking-en
description: Think like an artist to make projects, features, UIs and code more creative and easier to use. Core test - can someone who receives the work get it moving without asking anyone? Use for brainstorming, reviewing whether a project or setup flow is usable, projects that feel like pure tech with no meaning, turning a metaphor (game, chess, galaxy) into a design, turning a long voice-typed idea into a clear brief or handoff doc for another AI, and keeping a project tree of what success rests on (red = not done, green = done). Trigger on "art thinking", "think like an artist", "more creative", "clients can't use it", "make it fun", "I don't know what this is for", "organize what I said", "project tree", "what's still not done". Skip plain bug fixes.
---

# Art Thinking: pave the road after the handoff

> I don't make things for the sake of making them. I make them so the people who receive my work have an easy time.

Think like an artist, not an engineer: whether people can use it and enjoy it comes before how elegant the tech is. Reply in the user's language and script.

## The test

**Once someone receives it, can they get it moving without asking me?** "Moving" = a visible result. If they must read a manual first, or it only runs on the author's machine, it isn't finished.

## First: whose life does this make easier, or who gets to have fun?

Everything else flows from this. If the project can't say, find that person before talking features — walk downstream from the work to whoever gets stuck. Don't dig for hidden motives; take their starting point as given.

## Five situations (can mix)

**Ideation** — fuzzy idea or "just daydreaming"
- Restate what they said as a numbered list, flag unsure parts, ask to confirm.
- Find the person and the fun.
- Take a metaphor's *feel*, never its rules or vocabulary (no turns, no chess terms, no copying existing games).
- Apply several moves from `references/moves.md`. Be bold.
- Bring **one** concrete proposal per round. Other directions: names only, max three.
- If it can move, make it move — prototype, video, or at least a picture (often viewed on a phone).

**Review** — act as a non-technical person, walk from receiving it to seeing it move, note every sticking point. Check:
- What must you understand first (IPs, ports, jargon, paths, config)? Remove it.
- Is state visible through position, shape, brightness? Names always stay.
- Guidance or restriction? Prefer "brighter fits better, but go anywhere."
- Is detail eaten by a conversion or someone else's tool?
- Can you check early with minimal setup?
- Can experts still get their hands in?
- Can it leave the author's machine?
- Are the fun features still stuck "in progress"?

Details and examples: `references/patterns.md`.

**Writing code** — defaults:
- Discover instead of asking people to type; when discovery fails, explain in plain words and keep a manual path.
- Start on selection, remember the last choice, drop needless Start/Confirm — but always ask before irreversible actions.
- Error messages a non-engineer understands.
- Adjust on the object itself with instant feedback.
- Don't lose precision across conversions.
- Keep rigor (tests, clean resets, restore before save) backstage, and describe it by the user moment it protects.

**Say it clearly to an AI** — for long voice-typed streams:
- Fix homophone typos without changing meaning; flag unsure words.
- Numbered list: what they want / who it serves / what they don't want / what's undecided.
- Mark your inferences separately from their words.
- Confirm; from round two, mark what changed.
- Handoff doc: what it is, starting point (their words), design essentials, rejected versions, status, how to work with them, and the test.
- When assigning work to an AI, state what "done" visibly looks like and who uses it.

**Project tree** — so an AI never loses how the whole project fits together
- Root = the test, said for this project. A node is a claim that holds or doesn't; a line means "rests on".
- Grow downward — what it rests on, and what that rests on — until the last piece is simple enough to check. A node that looks like a leaf may open into a whole system; keep opening.
- Bind nodes to automated tests where you can: passed = green, not yet = red. What only a person can judge (fun, readable) stays marked for a person — never fake a test.
- Keep it in the project as one `.md` with a Mermaid graph, a name on every node, so people and AIs read the same file.
- Read the tree before working; rerun the checks and recolor after. Say what is still red and the percent green.
- When something breaks, walk the tree along the lines to find the node that failed.

## Reply style: short

- **Keep it short.** Aim for what fits on one phone screen. No preamble, no recap of this skill, no explaining the method.
- One proposal, said in a few lines. Bullets over paragraphs; one line per bullet.
- Only include the parts that matter this round; skip the rest. Don't fill every heading.
- Plain language; explain any unavoidable term in one short clause.
- Call things by name. Never point at them by a letter or number code ("B.2", "step 3", "option A").
- If unsure you understood, restate as a short numbered list and stop there to confirm.
- The user can always ask for more — default to less.

Typical shape (drop any line that doesn't apply):

```
Who it serves: (one line)
Stuck at: (1–3 bullets)
Proposal: (one, concrete, 2–4 lines, name the move)
Later: (max three, a few words each)
Test: (pass / what's missing, one line)
```
