---
id: f941b6f2-bac7-4b58-a9c6-313278c55928
title: Spec Driven Development
slug: spec-driven-development
createdAt: '2026-09-14T10:47:04.957Z'
updatedAt: '2026-09-14T18:25:26.081Z'
tags:
  - spec driven development
  - ai
publish: false
type: blog
summary: >-
  A software development methodology in which teams define and review a
  specification before implementation, then use it to guide development with AI
  coding agents.
previewImageSrc: ''
publishAt: ''
---
# Spec-Driven Development: From Intent to Software

AI coding has made writing code dramatically easier.

But easier code generation creates a new problem:

**What should the AI build?**

A short prompt can produce hundreds or thousands of lines of code. The hard part is no longer always translating an idea into syntax. Increasingly, the hard part is making the idea precise enough that both a human and an AI can agree on what should be built.

This is where **Spec-Driven Development (SDD)** comes in.

At its simplest:

> **Spec-driven development means writing a specification before writing code with AI.**

But that definition is incomplete.

The deeper idea is that the specification becomes the **source of truth for development**.

Specifications don't serve code.

**Code serves specifications.**

The Product Requirements Document (PRD) is no longer just a document developers read before implementation. The specification becomes the artifact from which implementation is reasoned about, planned, generated, tested, and eventually evolved.

The shift is subtle but fundamental:

> **Instead of asking AI to write code from an idea, we ask AI to help turn the idea into a precise specification—and then derive the implementation from that specification.**

---

# The problem SDD is trying to solve

Software development has always had a gap between **what we mean** and **what we build**.

A product manager might say:

> "Users should be able to share a dashboard."

An architect interprets that requirement.

An engineer makes technical decisions.

A developer turns those decisions into code.

A tester determines whether the result behaves correctly.

Over time, the implementation becomes the most accurate description of the system—not because it was intended to be, but because everything else eventually drifts.

Requirements change.

Design documents become stale.

Architecture decisions evolve.

Documentation falls behind.

The code remains.

We have traditionally tried to reduce this gap through better documentation, better processes, better reviews, and better tests.

SDD approaches the problem differently.

Instead of accepting code as the ultimate source of truth, it moves the source of truth **up a level**.

```text
Traditional

Requirements → Design → Code → Tests
                         ↑
                    Source of truth


Spec-Driven

Intent → Specification → Implementation Plan → Code
              ↑                                  │
              └────────── Verification ──────────┘
```

The specification describes the intended behavior.

The implementation plan translates that intent into technical decisions.

Code becomes an implementation of the plan.

Tests and verification check whether the implementation satisfies the specification.

The gap doesn't magically disappear. But the transformation becomes explicit.

---

# The power inversion

For a long time, software development has effectively treated code as the king.

Specifications serve code.

Design documents serve code.

Architecture diagrams serve code.

Tests validate code.

Documentation explains code.

SDD reverses that relationship.

> **The specification becomes the primary artifact. Code becomes its expression in a particular language, framework, and runtime.**

This is the most important idea in SDD.

It means that when we want to change the behavior of a system, we shouldn't necessarily start by searching through the code.

We start by asking:

**What should the system do now?**

Then we update the specification.

From there, the implementation can be reconsidered.

This makes software development more about maintaining **intent** and less about manually maintaining every implementation detail.

---

# What is a specification?

A specification is more than a prompt.

A useful definition is:

> **A specification is a structured, behavior-oriented artifact—or a set of related artifacts—written primarily in natural language that describes software functionality and provides guidance for implementing and verifying that functionality.**

A specification can contain:

* the problem being solved
* desired outcomes
* user behavior
* functional requirements
* non-functional requirements
* constraints
* business rules
* edge cases
* failure behavior
* acceptance criteria
* security requirements
* explicit non-goals
* important decisions

The exact format doesn't matter nearly as much as the role it plays.

A good specification should make the intended behavior clear enough that an AI agent can reason about it without having to invent critical requirements.

Consider:

> "Users should be able to export their data."

That's an idea, not yet a specification.

A specification needs to answer questions such as:

* What data can be exported?
* Who can export it?
* What formats are supported?
* How large can the export be?
* Is the export synchronous or asynchronous?
* What happens when export generation fails?
* How long is the exported file available?
* Which fields are excluded?
* What should the user see while the export is being generated?

The purpose isn't to create an enormous document.

The purpose is to **remove consequential ambiguity before it becomes implementation behavior**.

---

# SDD is not "write a really long prompt"

This distinction is important.

AI-assisted development already encourages developers to write detailed prompts.

But a prompt and a specification are not necessarily the same thing.

A prompt is primarily an instruction to an AI during an interaction.

A specification is a development artifact.

A prompt might say:

> "Add API key rotation."

A specification describes what API key rotation actually means:

* who can rotate a key
* how many active keys are allowed
* what happens to the old key
* how existing clients behave
* what happens when rotation fails
* what gets logged
* what security constraints apply
* how the behavior is verified

The prompt may disappear after the session.

The specification can remain part of the system's long-term knowledge.

This is why SDD is better understood as a **workflow and source-of-truth model**, rather than simply a prompting technique.

---

# The SDD workflow

A practical SDD workflow looks something like this:

```text
Idea
  ↓
Specification
  ↓
Clarification & Research
  ↓
Validation
  ↓
Implementation Plan
  ↓
Tasks / Tests
  ↓
Implementation
  ↓
Verification
  ↓
Production Feedback
  ↓
Specification evolves
```

AI can participate at almost every stage.

But the human remains responsible for intent and important decisions.

Let's walk through the workflow.

---

# 1. Start with an idea, not a solution

Most work starts vaguely.

> "We need to let users share dashboards."

That's enough to start a conversation.

It is not enough to start coding.

Instead of immediately asking:

> "Build dashboard sharing."

we ask:

> "Help me define dashboard sharing."

This changes the first interaction with AI.

The AI can ask:

* Who can share?
* Who can receive access?
* Can recipients edit?
* Can links be public?
* Can access expire?
* What happens when access is revoked?
* What happens when the dashboard is deleted?
* Are there different permission levels?

The goal is to turn an ambiguous idea into a set of explicit decisions.

This is one of the areas where AI can be particularly useful—not because it knows the product better than the product team, but because it can systematically surface questions humans may otherwise overlook.

---

# 2. Write the specification

The output of that conversation is the specification.

The specification should focus primarily on **what the system should do and why**.

For example:

```text
Feature: Dashboard Sharing

Goal:
Allow dashboard owners to share dashboards with other users.

Requirements:
1. An owner can grant another user access.
2. The owner can choose viewer or editor access.
3. The owner can revoke access.
4. Revoked users can no longer access the dashboard.
5. Access changes take effect immediately.

Non-goals:
- Public anonymous links
- Cross-organization sharing

Acceptance criteria:
- Given a user has viewer access...
- When the owner revokes access...
- Then the user can no longer view the dashboard.
```

The specification doesn't need to describe the database schema yet.

It doesn't need to decide whether the implementation uses REST or GraphQL.

It doesn't need to specify which framework component to use.

Those decisions belong later—unless they are genuine constraints of the requirement.

This separation allows the intent to remain stable even when implementation technology changes.

---

# 3. Clarify, research, and refine

A specification is rarely correct on the first attempt.

This is where SDD becomes an iterative process rather than a documentation phase.

AI can review the specification and look for:

* ambiguity
* contradictions
* missing requirements
* edge cases
* inconsistent terminology
* impossible assumptions
* security concerns
* missing acceptance criteria

It can also research technical context where necessary.

For example:

> "Can our current authentication system support expiring access tokens?"

> "Does the database support the required uniqueness constraint?"

> "What are the performance implications of this approach?"

> "Does the existing API already expose this capability?"

The important point is that research feeds back into the specification.

The workflow becomes:

```text
Spec
 ↓
Questions
 ↓
Research
 ↓
New information
 ↓
Refined Spec
```

This is continuous refinement.

Not a one-time review gate.

---

# 4. Separate context from the specification

An important part of an effective SDD workflow is distinguishing **general context** from **feature-specific intent**.

A codebase contains knowledge that applies to every feature.

For example:

* architecture principles
* repository structure
* coding conventions
* testing standards
* security rules
* technology constraints
* deployment requirements
* organizational policies

This is persistent project context.

Different tools call it different things: rules, steering, memory, constitution, project context, and so on.

The specification is different.

It describes the particular functionality being created or changed.

Conceptually:

```text
Project Context
├── Architecture
├── Principles
├── Conventions
├── Constraints
└── Rules

Feature Specification
├── Problem
├── Requirements
├── Behavior
├── Edge Cases
├── Acceptance Criteria
└── Non-goals
```

The context tells the AI:

> **"This is how this codebase works."**

The specification tells it:

> **"This is what we're trying to change."**

This separation prevents every coding session from becoming one giant prompt containing the entire history of the project.

It also means the same feature specification can be interpreted consistently by different AI coding tools.

---

# 5. Generate an implementation plan

Once the specification is sufficiently clear, the next step is to determine how it should be implemented.

This is where the **implementation plan** comes in.

The specification answers:

> **What should we build?**

The implementation plan answers:

> **How should we build it?**

The plan connects requirements to technical decisions.

For example:

```text
Requirement
    ↓
Technical decision
    ↓
Affected components
    ↓
Implementation tasks
    ↓
Verification
```

A good plan should make important decisions traceable.

Why this data model?

Why this API?

Why this architecture?

Why this migration strategy?

Why this caching strategy?

Why this testing approach?

The goal isn't to create documentation for its own sake.

The goal is to make technical reasoning explicit.

---

# 6. Turn the plan into executable work

For a small feature, an implementation plan might be a short checklist.

For a larger feature, it might include:

* data model
* API contracts
* UI behavior
* migration strategy
* testing strategy
* observability
* security considerations
* rollout plan
* implementation tasks

The key is that these artifacts are **derived from the specification**.

They shouldn't become an independent source of truth.

For example:

```text
Specification
      ↓
Implementation Plan
      ↓
Tasks
      ↓
Code
```

If the requirements change, the plan should be reconsidered.

If the plan changes because of new technical information, the specification should be checked to make sure the intended behavior hasn't changed.

---

# 7. Make tests part of the specification

One of the most powerful aspects of SDD is bringing verification closer to requirements.

Instead of thinking:

> Write code → then figure out how to test it

we can think:

> Define behavior → define how that behavior will be verified → implement it.

Acceptance criteria can become test scenarios.

For example:

```text
Given a user has viewer access
When the owner revokes that access
Then the user can no longer access the dashboard
```

This can inform:

* automated tests
* API contracts
* integration tests
* end-to-end scenarios
* manual verification

The specification therefore becomes a common source for both implementation and verification.

The result is a stronger chain:

```text
Requirement
    ↓
Acceptance Criterion
    ↓
Test
    ↓
Implementation
```

This doesn't mean every sentence in a specification must become an automated test.

It means important behavior should have a clear path to verification.

---

# 8. Generate and review the implementation

Only now does code become the primary concern.

The AI agent can use:

* project context
* specification
* implementation plan
* existing code
* tests
* technical research

to implement the feature.

But SDD does not mean:

> "Generate everything and trust the result."

Quite the opposite.

A core part of the workflow is **review and verification**.

The human should continuously ask:

* Does this implementation satisfy the specification?
* Did the agent make an assumption that wasn't specified?
* Did it introduce unnecessary complexity?
* Did it change behavior outside the scope?
* Does the architecture still make sense?
* Are the tests actually verifying the requirements?

The human role moves upward.

Instead of reviewing only individual lines of code, the developer can review the relationship between **intent, plan, implementation, and behavior**.

---

# 9. Keep refining during implementation

Specifications shouldn't be treated as frozen documents.

Implementation often teaches us something.

Maybe an assumption was wrong.

Maybe an existing system imposes a constraint nobody knew about.

Maybe two requirements conflict.

Maybe a simpler design is possible.

That information should flow back into the specification.

```text
Specification
     ↓
Implementation
     ↓
Discovery
     ↓
Specification refinement
     ↓
Implementation adjustment
```

This is particularly important with AI because AI makes experimentation cheap.

You can try an implementation.

Evaluate it.

Change the requirement.

Try another approach.

The specification becomes a place where the team can reason about those alternatives.

---

# 10. Production becomes part of the loop

The workflow doesn't end when the pull request merges.

Production generates new information.

Metrics reveal performance problems.

Users reveal unexpected behavior.

Incidents reveal missing constraints.

Security findings reveal weaknesses.

Operational experience reveals requirements that weren't obvious during development.

In an SDD workflow, those signals can feed back into the specification.

```text
Specification
      ↓
Implementation
      ↓
Production
      ↓
Metrics / Feedback / Incidents
      ↓
Specification refinement
```

A performance problem can become a non-functional requirement.

A security incident can become a new constraint.

A recurring support issue can become an explicit behavioral requirement.

The specification therefore becomes a living representation of what the system is supposed to do.

---

# Three levels of SDD

Not every implementation of SDD needs to go all the way to generated code that humans never edit.

There is a useful spectrum.

### 1. Spec-first

A well-defined specification is created before implementation.

It is used to guide the AI coding workflow for a particular task.

```text
Spec → Implementation → Code
```

After the task is complete, the specification may no longer be maintained.

This is the simplest form of SDD.

It is also probably the easiest place for most teams to start.

---

### 2. Spec-anchored

The specification survives the implementation.

It becomes the durable reference for the feature.

```text
Spec
 ↓
Implementation
 ↓
Code

Future change
 ↓
Update Spec
 ↓
Update Implementation
```

When the feature evolves, you go back to the specification.

This is where SDD becomes a maintenance model, not just an implementation workflow.

The specification becomes the feature's long-term anchor.

---

### 3. Spec-as-source

At the strongest end of the spectrum, the specification becomes the primary source file.

Humans edit the specification.

AI derives the implementation.

```text
Human
  ↓
Specification
  ↓
Generated Implementation
```

In this model, code is effectively an output artifact.

The human doesn't normally edit the generated code directly.

This is a powerful idea, but it is also the most ambitious and difficult version of SDD.

Current experiments show why: natural-language specifications can still be ambiguous, and AI-generated implementations are not deterministic. More detail can improve repeatability, but it doesn't guarantee identical or correct output.

So **spec-as-source should be viewed as an evolution of SDD, not a prerequisite for practicing it.**

---

# The specification is the lingua franca

As this workflow becomes more mature, something interesting happens.

The primary language of development moves upward.

Instead of communicating primarily through implementation details, the team communicates through:

* intent
* behavior
* constraints
* acceptance criteria
* design principles
* examples
* decisions
* tradeoffs

Natural language becomes part of the programming interface between humans and machines.

This is what makes SDD different from simply using AI to write code faster.

The abstraction level changes.

> **Code becomes the last-mile representation of intent.**

The same specification might eventually be implemented in different languages, frameworks, architectures, or infrastructure.

The implementation can change while the underlying behavior remains stable.

That is the long-term promise of treating specifications as primary artifacts.

---

# SDD is not one rigid workflow

There is an important caveat.

SDD is still an emerging term, and different tools and practitioners use it differently. There isn't one universally agreed structure for a specification or one mandatory sequence of documents. Fowler's comparison of several approaches makes this especially clear: the tools share the spec-first idea but differ substantially in how far they go toward spec-anchored and spec-as-source development.

That flexibility is important.

A tiny bug fix shouldn't require a dozen documents.

A small feature may only need:

```text
Short spec
    ↓
AI implementation
    ↓
Tests
```

A larger feature may need:

```text
Context
    ↓
Specification
    ↓
Research
    ↓
Design / Implementation Plan
    ↓
Tasks
    ↓
Tests
    ↓
Implementation
```

A complex system might need even more structure.

**The process should scale with the uncertainty, complexity, and consequences of the change.**

The goal is not to maximize documentation.

The goal is to maximize alignment between intent and implementation.

This is also one of the important practical lessons from early SDD tooling: highly elaborate workflows can become counterproductive for small changes, and having many specification files does not automatically mean having better control.

---

# The danger of false precision

There is another important lesson.

A detailed specification isn't necessarily a good specification.

You can write hundreds of lines describing the wrong thing.

You can also create a beautifully structured document that hides unresolved assumptions.

The real goal is not **more specification**.

It is **better specification**.

A good specification should make uncertainty visible.

If something is unknown, say so.

If a decision hasn't been made, don't let the AI silently invent one.

If there are multiple valid approaches, identify the decision that still needs to be made.

For example:

```text
Authentication mechanism:
[NEEDS DECISION]

Options:
- Existing session authentication
- OAuth
- API token

Decision required because:
The choice affects authorization, token lifetime,
and integration behavior.
```

This is often better than allowing an AI agent to confidently choose one.

AI is very good at filling gaps.

SDD should help us distinguish between:

**what we know,**

**what we've decided,**

and

**what we haven't decided yet.**

---

# Research is part of specification

A specification doesn't exist in isolation.

Sometimes the right answer requires research.

Before finalizing a design, the team may need to understand:

* existing code
* dependencies
* framework capabilities
* performance characteristics
* security implications
* infrastructure constraints
* external APIs
* organizational standards

This research should inform the specification and implementation plan.

For example:

```text
Product requirement
       ↓
Technical research
       ↓
Constraints discovered
       ↓
Specification refined
       ↓
Implementation plan
```

This is especially valuable in existing systems.

A common AI failure mode is to treat the desired feature as a greenfield problem when the repository already contains functionality that should be extended rather than recreated.

Good SDD therefore isn't just about generating documents.

It is about building enough context to make the specification **grounded in reality**.

---

# SDD and existing codebases

SDD is often easiest to demonstrate on greenfield projects.

But most real software development happens in existing systems.

That makes the workflow more interesting.

In a brownfield codebase, the AI needs two different kinds of information:

```text
Existing system
     ↓
"What exists today?"

Specification
     ↓
"What should change?"
```

These should not be confused.

Existing code is evidence of the current implementation.

The specification expresses the desired behavior.

The implementation plan is the bridge between them.

This distinction is particularly important because AI agents can otherwise mistake descriptions of existing functionality for requirements to build new functionality.

---

# What changes when requirements change?

This is where the model becomes particularly powerful.

Imagine the original requirement is:

> A user can have one active API key.

Later, the requirement changes:

> A user can have two active API keys so they can rotate credentials without downtime.

In a conventional workflow, an engineer has to find every place where the original assumption was encoded.

In a specification-driven workflow:

```text
Old requirement
    ↓
Update specification
    ↓
Identify affected decisions
    ↓
Update implementation plan
    ↓
Update tests
    ↓
Update implementation
```

The change begins at the source of intent.

This doesn't mean affected code magically updates itself in every SDD system.

It means there is a clear place to start and a traceable path through the change.

That is a much healthier model for evolving software.

---

# SDD enables exploration

Another underappreciated benefit is that specifications can make experimentation cheaper.

Suppose the requirement is:

> The system should process 100,000 events per second while keeping operational complexity low.

There may be several possible implementations.

You could ask AI to explore:

```text
Specification
     ├── Implementation A
     ├── Implementation B
     └── Implementation C
```

Then compare them on:

* performance
* cost
* complexity
* maintainability
* operational burden

The specification remains stable.

The implementation becomes something you can experiment with.

This is a significant change in the economics of architecture.

Instead of debating every technical possibility abstractly, we can increasingly use AI to explore concrete implementations and compare them against the same requirements.

---

# The role of the developer changes

SDD doesn't eliminate developers.

It changes where developers spend their attention.

If AI handles more of the mechanical transformation from specification to code, developers can spend more time on:

* understanding the problem
* making product decisions
* designing systems
* evaluating tradeoffs
* reviewing architecture
* challenging assumptions
* validating behavior
* exploring alternatives
* maintaining the specification

The developer becomes less of a translator between requirements and syntax.

They become more of a **designer, decision-maker, and verifier**.

The hard part of software engineering moves upward.

---

# What SDD is really about

It is easy to describe SDD as:

> "Write documentation before coding."

That's technically true, but it misses the point.

The deeper idea is:

> **Make intent a first-class engineering artifact.**

Traditional development tends to make implementation the durable artifact.

SDD attempts to make intent durable.

The specification describes what should exist.

The implementation plan explains how it can exist.

The code realizes that plan.

The tests verify the behavior.

Production tells us what needs to change.

And the specification evolves.

```text
                    ┌──────────────┐
                    │    Intent    │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │Specification │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │   Research   │
                    │  & Decisions │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │Implementation│
                    │     Plan     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │     Code     │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Verification │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │  Production  │
                    └──────┬───────┘
                           │
                           └────────→ refine specification
```

This is the real shift.

**Software development becomes a continuous transformation of intent into implementation—and back again through feedback.**

---

# From code-first to intent-first

The most important change isn't that AI can generate code.

AI generating code is a capability.

**SDD is a way of organizing development around that capability.**

Instead of:

> "Here's the code. Now let's explain what it does."

we move toward:

> "Here's what the system should do. Now let's derive the implementation."

Instead of:

> "The requirement changed. Find all the code we need to modify."

we move toward:

> "The intent changed. Update the specification and determine what implementation must change."

Instead of:

> "Let's ask the AI to build this."

we move toward:

> "Let's work with the AI to make the desired behavior precise, then let it derive the implementation."

That is the fundamental idea behind Spec-Driven Development.

**Specifications don't serve code. Code serves specifications.**

And as AI becomes better at translating intent into software, the specification may become the most important artifact we maintain.

Code is still what runs.

But the specification is what tells us **what should run, why it should run that way, and what it should become next.**
