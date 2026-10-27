# Scaling Reads

Different read patterns need fundamentally different solutions.

| Workload | Example | Strong starting point |
| :--- | :--- | :--- |
| Point lookups | Get account by ID | Index, cache, read replica |
| Repeated reads | Popular product or configuration | Local/distributed cache |
| Range queries | Recent orders for a tenant | Composite index, keyset pagination |
| Search | Full-text product search | Search index |
| Analytical scans | Revenue by region over six months | Columnar lakehouse, analytical warehouse |
| Aggregations | Daily API usage by tenant | Materialized aggregates or streaming projections |
| Read-after-write | Update profile, immediately retrieve it | Primary or version-aware read |
| Globally distributed reads | User reads data from nearby regions | Regional replicas/caches with explicit consistency rules |
| Hot-key workload | One celebrity profile receives millions of reads | Replication, local caching, request coalescing |

!!! info "Key Principle"
    The goals:
    - **Throughput**: more requests per second.
    - **Latency**: lower response time, especially p95/p99.
    - **Concurrency**: more simultaneous in-flight reads.
    - **Freshness**: less delay between a write and a visible read.

Scale the layer that is actually saturated, and choose how much staleness your product can tolerate before choosing the read-scaling technique.

## Reduce unnecessary work
Fix query plans, indexes, N+1 queries, excessive payloads, unnecessary joins, and repeated calculations.

## Reuse results safely

Serve repeated requests from a local cache, Redis, or a CDN instead of querying the database every time.

| Cache layer | Best use | Main limitation |
| :--- | :--- | :--- |
| CDN / edge cache | Public, reusable responses close to clients | Cache-key correctness, freshness, origin protection |
| Process-local cache | Very hot, compact data needed with minimal latency | Per-instance duplication and invalidation |
| Distributed cache | Shared, dynamic data accessed by many application instances | Network latency, cache availability, consistency |
| Database buffer/page cache | Repeated access to the same database pages | Memory contention with other database work |
| Analytical disk/data cache | Repeated scans of the same files or datasets | Effectiveness depends on locality and data reuse |

Use layered caching when it fits the workload.

### Redis
Caching stores the result of a read so that later requests can reuse it rather than recomputing or reloading it.

### CDN

### Precompute on Write (Materialised View)

When reads are expensive to compute dynamically

#### denormalized read models

#### Materialized views
Use when a repeatable aggregation or join is costly to recompute.

#### CQRS


## Distribute remaining reads
### Read Replicas

A read replica is a secondary database instance that applies changes originating from an authoritative database and serves eligible reads.

Distribute eligible read queries across database replicas rather than sending every read to the primary.


!!! warning "Replication can become the bottleneck"
    Suppose a write-heavy application produces a high volume of updates to a large number of records. Every replica must keep up with those changes. If the apply rate is lower than the incoming change rate, replication lag grows.

#### Read consistency

| Consistency requirement | Possible implementation |
| :--- | :--- |
| Eventual consistency | Any healthy replica; updates become visible eventually |
| Bounded staleness | Route only to replicas within an agreed freshness bound, or use a source that can enforce that bound |
| Read-your-writes | Route a session to an eligible primary or wait for the replica to reach the client's write version |
| Monotonic reads | Track the latest version observed by a client and prevent later reads from returning older state |
| Strong consistency | Use an appropriate authoritative or consensus-backed read mechanism |


### Query-serving fleets

A query-serving fleet is a horizontally scaled tier of stateless or semi-stateful servers dedicated entirely to executing read-only user queries with ultra-low latency

## Partition the workload

### Sharding

Partitioning the data can increase aggregate capacity. A shard router maps a key to a partition 

!!! "info" 
    For a multi-tenant platform, `tenant_id` can make tenant-scoped queries efficient, but a very large tenant can become a hot shard. Hashing a record ID may distribute records more evenly, but can make tenant-wide queries expensive.

### Independent read stores



## Observability and SLOs for read systems

| Signal | Why it matters |
| :--- | :--- |
| End-to-end p50/p95/p99 | Captures the user-visible read path |
| Requests by endpoint and query class | Identifies workload growth and hotspots |
| Cache hit/miss/error ratio | Measures whether the cache actually reduces source load |
| Database query latency and throughput | Shows the source database's real performance |
| Replica lag / applied version | Indicates whether a replica is eligible for a freshness-sensitive read |
| Connection-pool wait time | Detects contention before the query reaches the database |
| CPU, memory, I/O and network | Helps locate resource bottlenecks |
| Queue depth and rejected work | Shows saturation and backpressure |
| Read fallback and stale-serving rate | Exposes degraded correctness or resilience modes |
| Cost per successful request/query | Helps evaluate whether a scaling change was worthwhile |