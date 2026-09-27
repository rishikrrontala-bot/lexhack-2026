# Limitations

- The live prototype replays edits against **D.C. Code § 38-501 only**, using a checked-in 2023-12-11 snapshot. Other targets are outside the demonstration.
- The parser recognizes a subset of D.C. drafting patterns. Ambiguous targets, missing phrases, unsupported shapes, or numbering collisions should produce visible queries. A zero-query run for one law is not a guarantee on other bills.
- The historical snapshot includes temporary legislation. A real publication workflow must choose the relevant point in time carefully.
- The replay is not identical to the Council's 2024-02-08 publication. The Council made editorial cross-reference and spacing changes that this prototype does not infer.
- Source XML is pinned for reproducibility. The app does not fetch current law or detect later amendments.
- This is not legal advice, a legal opinion, or an official publication. Consult the [D.C. Council Code](https://code.dccouncil.gov/us/dc/council/code) and a qualified professional for consequential decisions.
