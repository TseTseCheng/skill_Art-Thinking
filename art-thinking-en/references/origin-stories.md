# In his own words

His own statements about why he built things, translated from Traditional Chinese. Read these for examples, or to check tone and values.

## VMCFacial (iPhone face-tracking app)

**How it started**
I'm a 3D modeler with a liberal-arts background, not an engineer. My job is making virtual character models for clients.

After I deliver a model, the client still has to handle a stretch that isn't in my hands if they want the character to follow their face: find face-tracking software, type the computer's IP into the phone, face dozens of sliders with English expression names. When that stretch gets stuck, what the client sees is "the character doesn't move" or "the expression looks weird" — and that gets blamed on the model.

One day it hit me: since this stretch affects my clients, I'll build the tools around the model too. I can't code, so I worked with AI and made this iPhone face-tracking app.

**My starting point**
Make it easy for clients. From receiving the model to the character moving, they shouldn't need to understand technology or ask anyone for help.

**How I decide what to build**
I'm a liberal-arts person myself; wherever I get stuck is where clients will get stuck. So any step that "requires understanding tech" — I find a way to remove it:
- No typing IPs: the app finds computers on the same Wi-Fi; just pick a name.
- No Start button: pick a computer and it starts streaming; next time it reconnects automatically.
- No jargon: tap a part directly on the 3D face and adjust while watching; what you adjust lights up.
- The model's detail has to come through: generic tracking turns a one-sided eyebrow raise into both eyebrows lifting slightly. The expressions I built into the model shouldn't get eaten at this stage, so I track left and right eyebrows separately.
- Check it on the phone first: load your own model and see whether it moves without turning on a computer.

**How I judge whether it's good**
One standard: can the client get the character moving without asking me? How elegant the tech is, how far it beats other software on numbers — all of that comes after.

**What it means to me**
Tools are an extension of my work. However good the model is, if the client can't use it, the delivery isn't done. I solve the trouble clients would run into ahead of time, so what they see is what I actually made.

**In one sentence**
I'm not making software for the sake of making software. I make it so my clients have an easy time — I pave the stretch of road that comes after I hand over the model.

## CONNECT (in-house VRM character engine)

**1. Starting point: once a character is delivered, it has to actually go on stage**
We make VRM characters. But after receiving the file, clients still have to sort out face capture, motion recognition, display software and linking settings, and any of these can get stuck. Clients are performers, not technicians.
So CONNECT costs nothing extra. Its goal isn't making money; it's getting the character actually used. What we deliver isn't a file — it's a character that can go on stage.

**2. We want our own stage**
Characters today perform inside other people's software; how the picture looks and what features exist are limited by that software.
We previously built a system that drove characters with Blender (yugo). The logic worked, but it was tied to Blender and couldn't be handed to clients. So this time we build the whole chain ourselves: our own engine, our own character-format support, our own rendering style, and we plan to build the phone face-capture app too.
The engine is ours, so we can make it as fine as we want. How the character finally looks is our decision.

**3. A bet on "software in the AI era"**
We're not making a finished product with fixed features; we're making a starting point.
The user opens an AI chat and installs the whole environment with one sentence. After that, changing settings, adding features, even rewriting the system's code — just tell the AI. Everyone ends up with different software, grown by their own AI to fit their needs.
Traditional software has developers guess what users want. We hand that step back to the user and their AI.
The point isn't "no interface"; it's "users don't need to learn anything." Conversation is just how we get there; simple parameters can still be adjusted by hand.

**4. The project is also an experiment**
We're a small studio and hand much of development to AI. This project also tests one thing: can a small team plus AI build what used to require a whole engine team?

**5. In one sentence**
This is the tool we've always wanted: the character moves the moment you open it, the picture looks the way we want, and any feature you want, you just ask the AI. We build it for ourselves first, then make it usable for everyone who receives a character.

## The Board / Agent Clan (excerpts)

- Origin: "At the very beginning, someone told me my AI tool should be like Age of Empires, make the whole thing like a game." "So I just started daydreaming and came up with it."
- "I want a person to look at the board — whatever form it takes — and know that their next gesture can decide a lot of things."
- "There's no 'whose turn'… I do things while you do things; that's probably a smoother state."
- "Distance moved shouldn't mean much… the point is reaching the state where you can win."
- "It should still be able to move anywhere to handle things, but how brightly a place lights up shows where it fits better."
- "Some games never end."
- "I treat the AI as another player… I want the interaction between AI and human to be a subtle 'you get me, I get you' state."
- "The whole system should be compact and clear at a glance. Each time it expands, only the part that needs to extend gets pushed outward."
- "First organize what I said and confirm with me whether it's right. I don't know how this would turn out either — you design and arrange it for me."

## BlastRadius (conversation excerpts)

- "I'm just someone who uses it. Honestly, as a liberal-arts person I'm not interested in this; I think it's fine as long as the software gets made. How do you think I could help this project? Think from an artist's angle?"
- "But I'll still play with it to see whether the software gets better. My attitude is probably: OK, this thing will get stronger, so I'll use it. But I don't know what it's for."
