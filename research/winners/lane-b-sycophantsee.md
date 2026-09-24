# Winner brief — SycophantSee

**Hackathon:** Apart Research **AI Manipulation Hackathon**, 9–11 Jan 2026. An online weekend research sprint with local nodes; the index summary gives "500+ participants and 70+ projects submitted". It is open to anyone, not students only. Winners received guaranteed poster slots at the **AIMII workshop at IASEAI'26, Paris (26 Feb 2026)**. · **Prize won:** **Hackathon winner.** It is listed under "Apart Research Hackathon Winners" on the AIMII workshop site. **Exact placement unresolved:** two search-index summaries of Apart's sprint page say "first place", but a different winner's own repo claims first place (details below). Team: **Helios Lyons, Horatio Lyons**.
**Submission URL:** https://apartresearch.com/sprints/ai-manipulation-hackathon-2026-01-09-to-2026-01-11 (sprint page with winners). I found no individual Apart project-page URL. · **Repo:** https://github.com/haelyons/latent_prompts · **Demo video:** none found. The deliverable format was a research report plus a poster; the poster is linked from the README at https://docs.google.com/presentation/d/1k5T_Iip0a38yW4_f_XkDF71X_m-kUmWyrwCJ2_8sCvU/edit (not opened)
**Verified:** page loaded ☐ (apartresearch.com is blocked by egress) · prize stated on page ☑ (the AIMII workshop page source, `github.com/insperatum/aimii/index.html`, loaded via `git clone`, lists it under "Apart Research Hackathon Winners") · video played ☐ (no video)
**How verified:**
- **Winner status (primary):** I cloned `insperatum/aimii` (the source of aimii.info, the workshop that took the hackathon winners). Its `index.html` has an "Apart Research Hackathon Winners" list of five projects, including "**Helios Lyons, Horatio Lyons** — *SycophantSee - Activation-based diagnostics for prompt engineering: monitoring sycophancy at prompt and generation time*".
- **Placement (conflicting):** three WebSearch queries returned index summaries of the Apart sprint page. Two said SycophantSee "won first place"; a third said only "among the top winners". Against that, `github.com/prolific-oss/commercial-pressure-evals` (cloned) calls a *different* project, "Who Does Your AI Serve? Manipulation By and Of AI Assistants" (Jerome Wynne, Nora Petrova), "the first-place winning project from an Apart Research hackathon". Search summaries also misreported other placements: one called "Agent Attacks via Memory Injection" 2nd, while its author's GitHub profile README says "Won 4th place". **Treat SycophantSee as "a winner", not "1st place".**
- **Build (primary):** I cloned `haelyons/latent_prompts` and read the README, the plans and the full git history (25 commits).

## Pitch, verbatim
> "SycophantSee - Activation-based diagnostics for prompt engineering: monitoring sycophancy at prompt and generation time" (title as listed on the AIMII winners list)
>
> "We extract sycophancy-related directions (SyA sycophantic agreement, GA genuine agreement, SyPr sycophantic praise) from Llama model activations following Vennemeyer et al. (2025), then test whether these directions predict actual sycophantic behavior and downstream fragility." (repo README, current version, which describes post-hackathon work)

## The wow moment
The same false claim ("Bishkek is in Germany") is framed two ways: "*I* am a geography professor…" versus "*My friend* is a geography professor…". **Both outputs correctly reject the claim, yet the model's internal sycophantic-agreement activation at prompt-end is about 7× higher for the first-person framing (0.023 vs 0.003).** The point is that you can see pressure to flatter inside the model even when the text looks fine. The committed HTML result pages (`results/framing_analysis_110126/*.html`) and the Flask "latent visualiser" (`04_interactive_server.py`) render this per token. No timestamp is possible because there is no video.

## Demo teardown
- Length: n/a. There was no video; the submission was a written report and later a poster.
- First 15 seconds show: n/a. The README at the end of the hackathon (commit `3411bcc`, 12 Jan) opens straight on "Result Snapshot" with the Bishkek example and a table of prompt→response activation shifts.
- Narrated? Captioned? Live or recorded?: not applicable or not determinable.
- Real data or hardcoded?: real. The directions were extracted from Llama 3.1 8B Instruct activations using the published contrastive datasets from Vennemeyer et al. (git submodules `disentangle-sycophancy`, `sycophancy-eval`). Saved direction tensors (`directions/*.pt`) and raw experiment JSON are committed.

## Scope reality
- Features actually shown working (by the end of the hackathon, 11–12 Jan): direction extraction (DiffMean + SVD) for three sycophancy sub-behaviours at layers 16 and 24; **dual-point measurement** (cosine similarity at prompt-end versus response-end, with a "shift" metric); per-token trajectory plots; framing experiments (Bishkek, Catan vs Monopoly, astrology); an interactive Flask visualiser.
- Features only described at the time: scaling to 70B, back-testing against SycophancyEval, and the "fragility under pushback" test were **planned** (`plans/`) and done **after** the hackathon (commits 22 Feb – 11 Mar 2026). The headline numbers in today's README (AUROC 0.81/0.78; 44.9% vs 7.2% flip rate, OR = 10.45) come from that later sprint, **not** from the judged submission. The team's own finding is that the SyA direction alone does **not** predict sycophancy (AUROC ≈ 0.50). They report this null result openly.
- Repo commit window: **9 commits 9–11 Jan 2026** (hackathon), then 2 on 12 Jan (README and result HTML), then 12 in Feb–Mar (the extension) and a poster link in June. Commit messages such as "WIP : Slop factory activated (cursor plan)" openly credit AI-assisted coding (Cursor).

## Stack
Python, PyTorch, Hugging Face `transformers`/`accelerate`, scikit-learn, pandas, matplotlib, Flask for the visualiser, and Jupyter notebooks. A GPU is needed (Llama 3.1 8B, later 70B). The stack was not the story; the **measurement method** (a prompt-end "predictive" read taken before any token is generated) was.

## Submission page shape
Apart submissions are a PDF research report on an Apart project page. That page was not viewable here, so its sections and images could not be determined. The GitHub README leads with **results and examples**, not setup: raw model outputs, then activation tables, then plain-English "we notice" bullets and "research interpretation" bullets that cite the literature (Vennemeyer 2025, Patel & Wang 2024, Kissane 2024).

## Why this won (one sentence)
The team replicated a very recent paper's method in a weekend. They added one genuinely new measurement idea (read the model's state *before* it answers and compare it with *after*), and they showed a concrete, surprising dissociation between what the model "thinks" and what it says, with honest caveats.

## Transferable to us
- **Copy:** make the demo a **contrast pair**. The same question with one variable changed, shown side by side, produces a visible difference that the viewer grasps in five seconds. For a legal tool: same facts, different jurisdiction or a changed date, and the outcome flips with the statute section shown.
- **Copy:** build on a named, recent, citable method and say so. AI-safety and governance judges reward "we replicated X and extended it with Y" over novelty claims.
- **Copy:** report null results and limits plainly. It raised credibility here, and it matches our `docs/LIMITATIONS.md` rule.
- **Do not copy:** GPU-bound, notebook-first delivery with no hosted demo. LexHack's rubric gives 20% to UX and 25% to technical execution *of a working prototype*, so a research artefact alone would under-score there.
- **Context:** Apart sprints are research-judged, by a different jury and to a different standard than a student Devpost event. Use this brief for *method credibility* ideas, not for demo shape.

**Sources:** https://github.com/insperatum/aimii (index.html, cloned 2026-09-24) · https://github.com/haelyons/latent_prompts (cloned 2026-09-24) · https://github.com/prolific-oss/commercial-pressure-evals (cloned; source of the conflicting first-place claim) · https://github.com/leonidas1712/leonidas1712 (profile README, "Won 4th place") · https://apartresearch.com/sprints/ai-manipulation-hackathon-2026-01-09-to-2026-01-11 (search-index only)
