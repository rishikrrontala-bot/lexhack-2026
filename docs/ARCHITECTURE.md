# Architecture

The data build reads three checked-in XML files: D.C. Law 25-108, § 38-501 as published on 2023-12-11, and § 38-501 as published on 2024-02-08. `scripts/build-data.ts` converts them to one JSON fixture. The site bundles the fixture; the edit workflow needs no network.

`segment.ts` turns bill text into numbered provisions. `grammar.ts` finds targets and editing verbs. `compile.ts` maintains nested drafting context and emits source-linked instructions. `apply.ts` resolves each target against the historical Code tree and applies strikes, replacements, repeals and insertions. `main.ts` turns the edits into an interactive proof. Browser input is limited to 45,000 characters.

The applier refuses to change a phrase if it is absent or the requested occurrence count differs. It returns a diagnostic. The UI does not silently repair spacing, because that would conceal the difference between legislative language and Council codification. Full-section comparison uses whitespace and quote canonicalization only; it does not pass for the sample law. See `docs/LIMITATIONS.md`.
