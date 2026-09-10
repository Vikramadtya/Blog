---
id: ea87ad8b-6f27-4332-9b91-0ca97d28c739
title: 'Distributed Observability : Logs, Trace, Span, Context'
slug: distributed-observability-logs-trace-span-context
createdAt: '2026-09-10T18:50:38.931Z'
updatedAt: '2026-09-10T19:04:03.485Z'
tags:
  - Logs
  - Trace
  - Span
  - Context
  - Observability
publish: false
type: blog
summary: >-
  Distributes Observability helps us to trace a request as it moves across
  components, services in a distributed environment.
previewImageSrc: ''
publishAt: ''
---
# Distributed Observability : Logs, Trace, Span, Context


| Concept | What it represents                                                 | Question it helps anser                           |
| ------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| Log     | A record of an event, usually with a timestamp                     | What happened at this point ?                     |
| Span    | A timed collection of logs for a single unit of work or operation  | What happened for a particular step of request ?  |
| Trace   | A group of span describing a single request path across components | What all happened across to process the request ? |
| Context |                                                                    |                                                   |
| Metric  | A measurement recorded over time commonly aggregated               | How much or How often                             |


Logs
A log is a timestamped message emitted by services or other components