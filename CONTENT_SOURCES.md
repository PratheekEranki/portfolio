# Content provenance and review notes

Reviewed October 22, 2026 against the user's local project folders and existing portfolio. No clinical records, environment files, private credentials, or raw datasets were copied into the portfolio.

## Owner-approved experience

The owner supplied corrected employment descriptions directly on October 22, 2026. Those descriptions supersede the previously generated and resume-derived summaries. Their summaries, titles, and dates are retained in `src/portfolio.json` and the LaTeX resume. At the owner's subsequent request, the bullets were expanded using the supplied reference resume and directly confirmed research tools; no performance figures were added.

- St. Jude, Software Engineer, September 2025-May 2026: sleep EEG/fMRI preparation and validation, research utilities, repeatable workflows, and documentation.
- University of Memphis, Graduate Student Research Assistant, March-August 2025: legislative research using LegiScan, collection/cleaning, record standardization, exploratory analysis, and documentation.
- Cognizant, Software Engineer, October 2021-April 2024: application components, defect investigation, testing/release support, production issue resolution, and technical handoffs.

Rhamba is presented separately as a co-authored publication; it is not attributed to the legislative assistantship. The owner's specific research contribution is not inferred from an employment title.

## Project evidence

| Project           | Local evidence inspected                                                        | Public destination / treatment                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rhamba            | Existing portfolio and general resume contribution descriptions                 | https://arxiv.org/abs/2605.01240 ; full author order and reported acceptance status checked on October 22, 2026                                            |
| FixBot            | `D:/projects/fixbot-device-agent/README.md`, `agent/core.py`, screenshots       | Public GitHub repository verified; described as a custom NVIDIA NIM tool loop, not an Anthropic implementation despite an old README title                 |
| HomeSearch        | `D:/projects/home-listings-search/README.md`, screenshots                       | Public repository verified; generated listing count is labeled, and uncontextualized latency claims are not promoted                                       |
| Academic RAG      | README, evaluation.py, evaluation_summary.json                                  | Public repository verified; saved metrics copied; evaluation script contains 10 reference questions                                                        |
| DriftBoard        | README and dashboard screenshots                                                | Public repository verified; hosted demo linked as documented, with its synthetic-data default identified                                                   |
| Air quality       | README and report                                                               | Public repository identity verified; accuracy distinguished from forecasting and framed with leakage/split caveats                                         |
| Bank marketing    | R Markdown split and preprocessing, report, output/results/model_comparison.csv | Saved summary copied; incorrect logistic-regression claim replaced with actual compared models; post-call duration and preprocessing limitations explained |
| Stock forecasting | final_project_outputs_wmt/model_comparison_results.csv                          | Saved results copied; GRU, not Transformer, is best in that run. The case study does not invent a naive baseline or undocumented walk-forward evaluation   |
| Movie models      | Local overview and existing project descriptions                                | Public Movie_popularity_R identity verified; exploratory classification described without unsupported recommendation-quality claims                        |
| Charity-AID       | Local project overview and public repository identity                           | Linked public repository; application features described, without production scale or security certification claims                                        |
| OpsFlow           | README and service/test file inventory                                          | Public repository and documented Vercel demo linked; no production scale, isolation audit, or uptime claims                                                |
| FieldVerify       | README, architecture, limitations, and test inventory                           | Public repository and documented demo linked; synthetic data and stubbed screenshot explicitly identified                                                  |
| DemandSense       | README and pipeline/test inventory                                              | Public repository linked; forecast-serving-monitoring architecture described without promoting unverified README benchmark values                          |

GitHub repository names and public visibility were verified through the connected GitHub repository search. The parent local `projects` repository is unavailable publicly, so its nonexistent GitHub tree URLs are not used for the bank or stock projects. Those cards link to case studies and their saved evaluation summaries instead.

## Publication metadata

The arXiv record lists Pankaj Pandey first and Pratheek Eranki third. The portfolio and generated resume retain that author order. The record reports acceptance in Computers in Biology and Medicine, with v3 dated September 18, 2026. Acceptance is attributed to that record; no unverified journal DOI is added.

## Assets

FixBot, HomeSearch, and DriftBoard images are existing screenshots from the corresponding local repositories. The Rhamba SVG is a newly drawn, explicitly labeled workflow schematic. No illustrative chart is presented as measured clinical data. The share image contains only portfolio typography and graphical decoration.

## Credentials

The general resume supplies the listed AWS, Azure, Anthropic, and Python credentials. No individual badge IDs were available in inspected sources. The website provides the owner's LinkedIn certifications section rather than fabricating verification URLs. The AWS expiration date is retained for maintenance.

## Expanded resume skills

The owner requested a broader resume skills inventory and omission of the bachelor's entry from the resume. `resumeSkills` is separate from the website's compact, project-linked skill groups. Skills draw from the owner's supplied reference resume, confirmed use of TensorFlow / PyTorch / Transformers / Mamba at St. Jude, and the inspected project dependencies and implementations: Academic RAG, DemandSense, SegmentWise, DriftBoard, OpsFlow, HomeSearch, the customer-operations agent, Spark fraud ETL, and CBraMod EEG preparation. Architectures, frameworks, applications, and delivery tools are grouped separately. Listing a skill does not add a new responsibility, scale claim, or proficiency rating to the approved employment descriptions.

## Expanded employment descriptions

At the owner's request, each role now has five expanded bullets shared by the website and generated resume. St. Jude adds the owner-confirmed PyTorch, TensorFlow, Transformer, and Mamba work, with CBraMod and self-supervised experiment context from the supplied resume. Memphis adds reference-supported LegiScan API, SQL / Excel preparation, demographic alignment, Tableau, and Plotly details. Cognizant adds reference-supported Java / Spring Boot, React / TypeScript, MySQL, testing, Docker / AWS / CI/CD, and Agile details. Existing role names, employment dates, and summaries take precedence over conflicting reference-resume content. Numerical scale and performance claims were not imported. The website now also includes the expanded resume skills and omits the bachelor's entry from its education display.
