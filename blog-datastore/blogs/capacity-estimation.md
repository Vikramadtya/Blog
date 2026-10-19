---
id: 0fe45e96-35fc-4a43-9dd8-ed210040f3b1
title: Capacity Estimation
slug: capacity-estimation
createdAt: '2026-10-02T06:58:42.296Z'
updatedAt: '2026-10-02T06:58:42.296Z'
tags:
  - blog
publish: false
type: blog
summary: 'Capacity estimation of the system under design '
previewImageSrc: ''
series: cap-scalability-latency-durability-fault-tolerance--other-design-jargon
seriesOrder: 1
---
# Capacity Estimation

Fermi estimations are less about the numerical answer and more about the journey to it and how it improves your design. Great estimations are quick, reasonably accurate, and answer an important question about the problem you are tackling.

Using an approach called Dimensional Analysis you can create a mental graph of the quantities/dimensions need to develop.


For example for twitter search index storage size
- Tweets are typically 140 characters. (storage/tweet)
- Twitter daily active users is O(250m). (users/day)
- With `(storage/tweet) * (tweet/user) * (user/day) we can get to (storage/day).


Metrics

| Power of 1000 (1000^x) | Number       | Prefix |
|-------------------------|--------------|--------|
| 0                       | Unit         |        |
| 1                       | Thousand     | Kilo   |
| 2                       | Million      | Mega   |
| 3                       | Billion      | Giga   |
| 4                       | Trillion     | Tera   |
| 5                       | Quadrillion  | Peta   |



| Latency Comparison Numbers (~2012/2026)                    | Latency          | Notes                                      |
|------------------------------------------------------------|------------------|--------------------------------------------|
| L1 cache reference                                         | 0.5 ns           |                                            |
| Branch mispredict                                          | 5 ns             |                                            |
| L2 cache reference                                         | 7 ns             | 14× L1 cache                              |
| Mutex lock/unlock                                          | 25 ns            |                                            |
| Main memory reference                                      | 100 ns           | 20× L2 cache, 200× L1 cache               |
| Compress 1K bytes with Zippy                               | 3,000 ns (3 µs)  |                                            |
| Send 1K bytes over 1 Gbps network                          | 10,000 ns (10 µs) |                                           |
| Read 4K randomly from SSD*                                 | 150,000 ns (150 µs) | ~1 GB/sec SSD                           |
| Read 1 MB sequentially from memory                        | 250,000 ns (250 µs) |                                         |
| Round trip within same datacenter                          | 500,000 ns (500 µs) |                                       |
| Read 1 MB sequentially from SSD*                           | 1,000,000 ns (1 ms) | ~1 GB/sec SSD, 4× memory                |
| Disk seek                                                  | 10,000,000 ns (10 ms) | 20× datacenter roundtrip                |
| Local LLM, generate 1 token                                | 15,000,000 ns (15 ms) | Small model on consumer GPU (2026)     |
| Read 1 MB sequentially from disk                           | 20,000,000 ns (20 ms) | 80× memory, 20× SSD                    |
| Frontier LLM, generate 1 token                             | 20,000,000 ns (20 ms) | Hosted model output (2026)              |
| Local LLM, time to first token                             | 75,000,000 ns (75 ms) | Small model, short prompt (2026)       |
| Local LLM (CPU), generate 1 token                          | 100,000,000 ns (100 ms) | Small model, no GPU (2026)            |
| Send packet CA → Netherlands → CA                          | 150,000,000 ns (150 ms) |                                          |
| Fast LLM, time to first token                              | 250,000,000 ns (250 ms) | Specialized inference hardware (2026) |
| Frontier LLM, time to first token                          | 1,000 ms          | Short prompt, no cache (2026)             |
| Frontier LLM, short response                               | 3,000 ms (3 s)    | ~100 output tokens (2026)                |
| Frontier LLM, long context prefill                         | 10,000 ms (10 s)  | ~100K input tokens, no cache (2026)      |
| Frontier LLM, reasoning response                            | 30,000 ms (30 s)  | Single call with thinking (2026)          |



Common Mistakes
- Estimating something that doesn't matter.
- Getting stuck in the math
- Getting quantities outrageously wrong (small mistakes are ok!)