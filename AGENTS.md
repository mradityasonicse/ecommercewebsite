# Workspace Directives: Winning Application Engineering & Execution

Every task, code implementation, design iteration, and refactoring in this repository must actively adhere to the following technical, design, and strategic standards:

## 1. Frontend & User Experience (UX)
- **Component-Based Development**: Build strictly modular, single-responsibility React 19 + TypeScript components. Keep types explicit, avoid runtime `any`, and manage state deterministically.
- **Visual Graphic Design**: Maintain a modern, high-trust UI. Respect the design token system (`src/styles/tokens.css`, `colors.ts`, `typography.ts`). Use cohesive typography, refined micro-elevations, crisp borders, and subtle smooth transitions.
- **Interactive Prototyping**: Deliver fluid, market-ready experiences. Zero dead ends: all buttons, links, and cards must produce a responsive action, modal, drawer, or feedback toast. Handle loading (skeletons), empty, and error states gracefully.

## 2. Backend & System Architecture
- **High-Speed API Development**: When designing backend services and endpoints, implement asynchronous, non-blocking pipelines (e.g. FastAPI / async handlers) with strict schema validation.
- **System Mapping**: Keep end-to-end data flows documented and transparent from UI click down to database persistence and cache updates.
- **Scalability Planning**: Ensure data structures, queries, and state stores can scale seamlessly beyond local mockups to handle real-world concurrent user loads.

## 3. Machine Learning & Advanced Processing
- **Model Integration**: Decouple model loading from request cycles. Warm weights at initialization and run inference with evaluation modes to avoid memory leaks.
- **Real-Time Data Processing**: Use streaming channels (WebSockets / SSE) and background worker pools for heavy computational tasks (audio, live signals, complex analytics) so the main interface never stutters.

## 4. Presentation & Strategy
- **First-Principles Thinking**: Before writing code or proposing features, deconstruct problems to core user truths and eliminate unnecessary friction.
- **Technical Storytelling**: Articulate architecture decisions and trade-offs in clean, compelling narratives for judges, evaluators, and stakeholders.
- **Pitch Deck Engineering**: When building presentations, build interactive web-based showcase surfaces (e.g., interactive bento grids, dynamic metrics) rather than static slides.
- **Attention Management**: Maintain focus on high-impact user-facing deliverables, disciplined phase gating, and zero-defect builds under competition deadlines.
