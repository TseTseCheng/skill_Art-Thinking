# 15 behavior patterns

Drawn from five projects: VMCFacial, BlastRadius, the Board (譜面, part of Agent Clan), CONNECT, and yugo.
Reliability: "his words" are things he said himself (translated from Traditional Chinese); "inferred" means an AI read it from a repository or conversation and he hasn't confirmed it point by point.

## Contents
1. Driven by how people feel, not by efficiency
2. He is the first tester
3. Make invisible state visible and touchable
4. Remove anything you must understand before using it
5. Guide, don't restrict
6. A metaphor is a starting point, not a spec
7. Protect the detail, and keep the whole orderly
8. It only counts when you see it move
9. Make it exist first
10. His ideation loop
11. When someone else's tool limits the work, build your own
12. If it can't be handed over, it doesn't count
13. Build for yourself first, then for everyone; think big
14. Fun up front, rigor backstage
15. An easy path for everyone, an open path for experts

---

### 1. Driven by how people feel (ease, fun), not by efficiency
- VMCFacial, his words: "How elegant the tech is, how far it beats other software on numbers — all of that comes after."
- Agent Clan: the selling point is "the joy of directing AI, not efficiency."
- CONNECT, his words: "The goal isn't making money; it's getting the character actually used."
- Counterexample, BlastRadius: a tool about efficiency and correctness; he said "I don't know what it's for."
- **Use it**: when a project is only about efficiency, first find who it makes life easier for, or who gets to have fun.

### 2. He is the first tester
- VMCFacial, his words: "Wherever I get stuck is where my clients will get stuck."
- The Board, his words: "As a human, I can't read its state."
- **Use it**: if he can't understand it, the design isn't there yet. It isn't his fault.

### 3. Make invisible state visible and touchable
- VMCFacial: tap a region directly on the 3D face; what you adjust lights up.
- The Board: state shown by position and shape; brightness shows how well a piece fits.
- Required exception: every object keeps its name next to it. Less text is fine; names must stay.

### 4. Remove anything you must understand before using it
- VMCFacial: no IP to type, no Start button, no English jargon.
- The Board: you don't need to know any board game; he rejected chess terms and real chess pieces.
- CONNECT, his words: "Users don't need to learn anything." "The point isn't having no interface."
- **Note**: what's removed is "having to learn first", not "being able to do it by hand."

### 5. Guide, don't restrict
- Everything he rejected on the Board was an artificial limit: taking turns, distance having meaning, only dropping on lit spots, moving only along lines, a board that ends.
- CONNECT, his words: "Traditional software has developers guess what users want. We hand that step back to the user and their AI."

### 6. A metaphor is a starting point, not a spec
- Age of Empires, chess, Go, the Big Bang, galaxies are all thinking tools for him.
- Every version built literally from the metaphor, he called wrong. He wants the feel: fun, readable at a glance, alive.

### 7. Protect the detail, and keep the whole orderly
- VMCFacial: left and right eyebrows tracked separately, so the model's expression isn't eaten at the tracking stage.
- CONNECT, his words: "The engine is ours, so we can make it as fine as we want."
- The Board, his words: "The whole system should be compact and clear at a glance." Freedom yes, but the picture must stay orderly.

### 8. It only counts when you see it move
- VMCFacial: done means the character moves; you can check on the phone first.
- The Board: he wants moving prototypes, recorded as videos, often watched on his phone.

### 9. Make it exist first
- BlastRadius, his words: "As long as the software gets made first, that's fine."
- The Board went through five prototype versions in one day.

### 10. His ideation loop
1. A sentence from outside, or a metaphor, sets him off "daydreaming."
2. He pours out a long stream of thoughts by voice.
3. He asks the AI to "organize what I said and confirm whether it's right."
4. The AI gives one concrete proposal, ideally one that moves.
5. He says "that's wrong" or "I can't read it" on instinct, and adds a new idea ("it just occurred to me…").
6. When stuck, he writes a handoff document and lets another AI start fresh.
- He wants divergence ("things I couldn't even imagine"), but only one concrete proposal per round.

### 11. When someone else's tool limits the work, build your own
- VMCFacial: generic tracking software ate the one-sided eyebrow detail.
- CONNECT, his words: "Characters today perform inside other people's software… and are limited by it."
- yugo (inferred): rather than move the character into another streaming app and lose visual quality, bring the stream into Blender.

### 12. If it can't be handed over, it doesn't count
- CONNECT, his words about yugo: "The logic worked, but it was tied to Blender and couldn't be given to clients."
- VMCFacial, his words: "However good the model is, if the client can't use it, the delivery isn't done."

### 13. Build for yourself first, then for everyone; think big
- CONNECT, his words: "We build it for ourselves first, then make it usable for everyone who receives a character."
- CONNECT is also an experiment: can a small team plus AI build what used to take a full engine team?
- The Board aims for Age-of-Empires scale and an academic paper.

### 14. Fun up front, rigor backstage (inferred)
- yugo talks about fun and experiments, yet has 70+ written decisions, a 1 ms performance budget, and bones returning to rest pose on stop.
- Reason: it only does live performance, and a live show can't be redone. The rigor is respect for the performer.
- **Risk**: rigor, done long enough, eats the fun. yugo's roadmap is mostly safety nets; keyboard and chat features still say "in progress."

### 15. An easy path for everyone, an open path for experts
- yugo D10: pros use nodes; everyone else uses Layers built from nodes.
- CONNECT: mainly conversation, but simple parameters remain adjustable by hand.

---

## The projects are one road
Models (his main work) → yugo (streaming inside Blender, for himself) → VMCFacial (make the face move) → CONNECT (an own stage, for clients) → Agent Clan (direct a team of AIs to build things) → BlastRadius (keep AI code changes from breaking things).
At the top of the stream is one thing: **the character has to actually go on stage.**
