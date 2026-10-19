---
id: 30673b9b-6880-4027-a02f-191f0053f26c
title: How to system design
slug: how-to-system-design
createdAt: '2026-09-30T18:52:05.887Z'
updatedAt: '2026-09-30T18:52:05.887Z'
tags:
  - blog
publish: false
type: blog
summary: How to navigate a system design interview
previewImageSrc: ''
---
System design interviews are a way to assess your ability to take an ambiguously defined, high-level problem and break it down into the pieces of infrastructure needed to solve it.


design interviews are not about getting to a single right answer.Interviewer is looking to assess your ability to navigate a complex problem, reason about trade-offs, and communicate your thinking clearly.


Majority of system design interviews will be what we'll call "Product Design" or "Infrastructure Design" interviews.


A senior engineer will quickly work through the basics leaving time for them to show off the depth of their knowledge in deep dives.


Strong themes that are common across all interviews: 
- Problem Navigation
  - assess your ability to navigate a complex, under-specified problem.
  - able to break down the problem into smaller, more manageable pieces, prioritize the most important ones, and then navigate through those pieces to a solution
  - common ways that candidates fail with this competency are
    - Insufficiently exploring the problem and gathering requirements.
    - Focusing on uninteresting/trivial aspects of the problem vs the most important ones.
    - Getting stuck on a particular piece of the problem and not being able to move forward.
    - Failing to deliver a working system.
- Solution Design
  -  should be able to describe how you would solve each piece of the problem, and how those pieces fit together into a cohesive whole.
  -  The most common ways that candidates fail with this competency are:
    -  Not having a strong enough understanding of the core concepts to solve the problem.
    -  Ignoring scaling and performance considerations.
    -  "Spaghetti design" - a solution that is not well-structured and difficult to understand.
- Technical Excellence
  - describe how you would use current technologies, with well-recognized patterns, to solve the problems
  -  most common ways that candidates fail with this competency are
    -  Not knowing about available technologies.
    -  Using antiquated approaches or being constrained by outdated hardware constraints.
    -  Not knowing how to apply those technologies to the problem at hand.
    -  Not recognizing common patterns and best practices.
- Communication and Collaboration
  - ability to communicate complex concepts, respond to feedback and questions, and in some cases work together with the interviewer to solve the problem.
  - most common ways that candidates fail with this competency are
    - Not being able to communicate complex concepts clearly.
    - Being defensive or argumentative when receiving feedback.
    - Getting lost in the weeds and not being able to work with the interviewer to solve the problem.


Delivery framework is a sequence of steps and recommended for interview.

## Requirements (~5 minutes)

- get a clear understanding of the system to be designed

- Functional requirements
  - Functional requirements are your "Users/Clients should be able to..." statements.
  - These are the core features
  - Ask targeted questions as if you were talking to a client, customer, or product manager ("does the system need to do X?", "what would happen if Y?") to arrive at a prioritized list of core features.
  - Many of these systems have hundreds of features, but it's your job to identify and prioritize the top 3-5.
  - The who? (Producer): Who's sending data?
  - The what? (Request): What kind of data are they sending? What does it include?
  - The where? (Outcome): What is the desired output or event?

- Non-functional Requirements
  - Statements about the system qualities that are important to your users.
  - important that non-functional requirements are put in the context of the system and, where possible, are quantified
    - For example, "the system should be low latency" is obvious and not very meaningful
  - checklist of things to consider
    - CAP Theorem
      - system to prioritize consistency or availability as partition tolerance is a given in distributed systems.
    - Environment Constraints
      - any constraints on the environment in which your system will run
    - Scalability
      - any unique scaling requirements
    - Latency
    - Durability
    - Security
    - Fault Tolerance
    - Compliance

## Capacity estimation
    - explain to the interviewer that you would like to skip on estimations upfront and that you will do math while designing when/if necessary.

## Core Entities
-  identify and list the core entities of the system
-  These are the core entities that your API will exchange and that your system will persist in a Data Model.
-  useful questions to ask yourself to help identify core entities
  -  Who are the actors in the system? Are they overlapping?
  -  What are the nouns or resources necessary to satisfy the functional requirements?

## API or System Interface (~5 minutes)
- define the contract between your system and its users
- which API protocol to use
  - REST (Representational State Transfer)
    - Uses HTTP verbs (GET, POST, PUT, DELETE) to perform CRUD operations on resources
  - GraphQL
    - Allows clients to specify exactly what data they want to receive, avoiding over-fetching and under-fetching.
    - When you have diverse clients with different data needs.
  - RPC (Remote Procedure Call)
    - Action-oriented protocol (like gRPC) that's faster than REST for service-to-service communication.
    - For internal APIs when performance is critical.
  - WebSockets
  - Server-Sent Events
  - Webhooks

## [Optional] Data Flow (~5 minutes)
- For data-processing systems, it can be helpful to describe the high level sequence of actions or processes that the system performs on the inputs to produce the desired outputs.
- If the system doesn't involve a long sequence of actions, skip this!

## High Level Design (~10-15 minutes)
- primary goal is to design an architecture that satisfies the API you've designed and, thus, the requirements you've identified.
- Focus on a relatively simple design that meets the core functional requirements, and then layer on complexity to satisfy the non-functional requirements in your deep dives section. It's natural to identify areas where you can add complexity, like caches or message queues, while in the high-level design.
- Be talking through your thought process with your interviewer. Be explicit about how data flows through the system and what state (either in databases, caches, message queues, etc.) changes with each request, starting from API requests and ending with the response.

## Deep Dives (~10 minutes)
