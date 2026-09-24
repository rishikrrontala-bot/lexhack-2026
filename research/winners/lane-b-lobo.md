# Winner brief — Lobo ("Lobotomy"): a real-time inference firewall for LLM safety

**Hackathon:** HooHacks 2026, University of Virginia's student-run 24-hour hackathon, in person (MLH promoted it on LinkedIn), 21–22 Mar 2026, run on Devpost (https://hoohacks-2026.devpost.com). The index summary of the event page reports "over $20,000 in prizes … in nine different prize tracks". An MLH LinkedIn post title gives the theme as "Wild West". · **Prize won:** **"Best AI Safety & Alignment Evaluations"**, as stated by the team. One team member's LinkedIn summary renders it as "1st place in the AI Safety & Alignment track". **This prize is self-reported by the team; see "How verified".**
**Submission URL:** https://devpost.com/software/lobo-zs3cdw · **Repo:** https://github.com/amey-gupt/Lobo · **Demo video:** not determinable. The Devpost page, where any video would be linked, is blocked by egress, and the repo links no video.
**Verified:** page loaded ☐ · prize stated on page ☐ (team README ☑, loaded via `git clone`) · video played ☐
**How verified:**
- **Prize, self-reported in three places that agree:** (1) the repo README, loaded via clone: "🏆 UVA's HooHacks 2026 Winner — **Winner:** Best AI Safety & Alignment Evaluations". This was added in a commit on 6 Apr 2026 titled "Update README with accolades". (2) and (3) WebSearch index summaries of two team members' LinkedIn profiles (Sasi Vaithiyanathan, Amey Gupta): "awarded 1st place in the AI Safety & Alignment track at HooHacks".
- **Independent confirmation that the prize category exists:** the index summary of the HooHacks 2026 Devpost page lists "AI Safety & Alignment Evaluations" as a prize category ("the best … team … will receive Sennheiser Momentum 4 Headphones").
- **Not seen:** any organizer or third-party source naming Lobo as the winner. Five differently worded WebSearch queries turned up no organizer or winners announcement; the only event-side result was the prize list. The prize is consistent across the team's own sources and matches a real category, but it is **not independently confirmed**. Weight this brief accordingly.
- **Primary build evidence:** I cloned the repo and read the README, `backend/STEERING.md`, the Cowboy Cafe README, the metrics page source and all 71 commits. Their dates fit the event exactly.

## Pitch, verbatim
> "**We built a live "inference firewall" that can mathematically erase harmful concepts from an LLM's residual stream in real time.**" (README, "One-Line Pitch")
>
> "Lobotomy is an AI safety system that enforces behavior at inference-time by modifying model internals, not just prompt text. Instead of saying "do not be harmful" in a system prompt, we steer hidden activations to suppress unsafe concepts before each token is generated." (README, opening)

## The wow moment
The **admin dashboard's concept sliders**: `deception`, `toxicity`, `danger`, `warmth`, `stereotypes`, `formality` and `legal_compliance`. When the operator presses Apply, a customer-facing chatbot on a fake Wild West business site ("Cowboy Cafe") changes behaviour on its next reply, with no retraining. To make the contrast visible, the team deliberately ran an **uncensored base model** (`cognitivecomputations/dolphin-2.9-llama3-8b`) so the unsteered baseline would misbehave. They also added a `COWBOY_CAFE_HACKATHON_BASELINE=true` flag whose README describes it as producing "a clearer **unsafe baseline → steered safe** story". The same README admits: "Harmful compliance is still **not guaranteed** (model variance). Tune … multipliers … so the steered side shows the effect judges expect." Timestamp not determinable (no video seen).

## Demo teardown
- Length: not determinable.
- First 15 seconds show: not determinable. From the repo, the likely demo path is Cowboy Cafe chat → admin sliders → chat again.
- Narrated? Captioned? Live or recorded?: in-person judging at a student hackathon; the video format could not be determined.
- Real data or hardcoded?: **mixed**. The steering is real: steering vectors = mean(toxic prompts) − mean(safe prompts) at the layer-14 residual stream, applied through a forward pre-hook on a GPU served by Modal. Chats are logged to Supabase, and a Gemini call flags each logged response per concept. **The "Metrics" page is not measured.** In `frontend/src/app/metrics/page.tsx`, the "baseline" values are hardcoded constants (Policy Safety 61, Low Toxicity 57, Truthfulness 63, Tone Stability 59, Instruction Fit 66), and "steered" is a formula over slider positions. The README calls this "a charts-heavy page [that] illustrates baseline vs. steered framing (demo-style visuals)". It won an *evaluations* prize with an illustrative, not measured, metrics chart.

## Scope reality
- Features actually shown working (per code): real-time activation steering with seven concept channels; separate admin and customer Modal services sharing a config dict; bearer-token admin auth; Supabase chat logging; a Gemini post-hoc flagger; two Next.js front ends (admin dashboard and the Cowboy Cafe customer site).
- Features only described or illustrated: quantitative safety evaluation. The metrics chart is synthetic, as shown above. `STEERING.md` documents failure modes openly: missing vectors mean zero steering, a TransformerLens-vs-HF mismatch can flip the effect, and oversized multipliers break generation.
- Repo commit window: **70 commits from 2026-03-21 12:40 EDT to 2026-03-22 11:57 EDT** (about 23 h, inside the event), plus one README "accolades" commit on 6 Apr. Built entirely at the event by three committers (Amey Gupta, Sasidharan Vaithiyanathan, Thirunavukkarasu Sethuraman). Messages such as "believe fix for supabase table writing after 2.5 hours of debugging :(" show the usual integration tax.

## Stack
PyTorch + Hugging Face `transformers` (Llama-3-8B derivative), representation engineering (DiffMean steering vectors, forward pre-hooks), **Modal** for GPU serving, Supabase, the Gemini API, and Next.js + the AI SDK for both front ends. The stack *was* the story: "operates directly inside the neural network" is the whole pitch. Running it needs a GPU, Modal, Supabase and Gemini secrets; there is no static fallback.

## Submission page shape
The Devpost page could not be viewed. The README (the only artefact seen) leads with the accolade, then a one-line pitch, Problem, Solution (four numbered steps), Demo Experience, Core Technical Approach (with the formula `resid_pre := resid_pre - total`), and architecture and API tables. The problem is framed in enterprise and legal-risk terms: "harmful outputs can create legal and reputational risk".

## Why this won (one sentence)
In a prize track about AI safety, it was the entry that visibly acted on the model's internals rather than wrapping a prompt: sliders that change a live chatbot's behaviour make a mechanistic idea tangible to judges in seconds. That impression evidently outweighed the fact that its "metrics" were illustrative.

## Transferable to us
- **Copy:** give the judge a **control they can move** and a consequence they can see immediately (slider → behaviour change). For a legal tool, that could mean toggling a fact (e.g. a date or a county) and watching the applicable rule, and its cited section, change.
- **Copy:** set the demo in a concrete, slightly playful scenario (a fake café chatbot) instead of an abstract console. It carries a mechanism-heavy idea.
- **Copy:** pick demo inputs deliberately so the effect is visible (they chose an uncensored model so the baseline would fail). Be honest in the docs that you did this.
- **Do not copy:** hardcoded "baseline" numbers presented as a metrics chart. For us this would break CLAUDE.md lesson 3 (every number in the README reproducible). Our charts must be computed from the repo's own test set.
- **Do not copy:** a GPU-plus-four-secrets dependency chain with a 30–60 s cold start. LexHack judges visit cold, so ours must be static-first.
- **Caveat for weighting:** this is the least independently verified of the lane-B briefs (the prize is self-reported, although it is consistent and matches a real prize category).

**Sources:** https://github.com/amey-gupt/Lobo (cloned 2026-09-24) · https://devpost.com/software/lobo-zs3cdw (blocked; not loaded) · https://hoohacks-2026.devpost.com (search-index only) · https://www.linkedin.com/in/sasi-vaith/ and https://www.linkedin.com/in/ameygupt/ (search-index only)
