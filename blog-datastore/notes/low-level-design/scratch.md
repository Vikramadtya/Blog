# 60-Day LLD & Machine Coding Mastery Roadmap

| Day | Problem | Concepts to Learn |
|---:|---|---|
| 1 | Parking Lot | Encapsulation, abstraction, interfaces, inheritance vs composition, SRP, Factory, Strategy, class relationships |
| 2 | Vending Machine | State machines, State pattern, transitions, invariants, enum vs State objects, validation |
| 3 | ATM | Transaction boundaries, State, Chain of Responsibility, error handling, hardware/business logic separation |
| 4 | Elevator System | Controllers, scheduling Strategy, state, command queues, extensible algorithms |
| 5 | Chess | Polymorphism, OCP, inheritance vs composition, legal moves, Command and undo |
| 6 | Splitwise / Expense Sharing | SOLID, dependency injection, Strategy, value objects, rounding, money invariants |
| 7 | Library Management | Entities vs value objects, Book vs BookCopy, Repository abstraction, lending lifecycle |
| 8 | Car Rental | Factory, Strategy, reservation lifecycle, interface segregation, dependency inversion |
| 9 | Notification Framework | Strategy, Factory, Adapter, Observer, provider abstraction, test doubles |
| 10 | Food Delivery / Order Management | Aggregate boundaries, composition, state transitions, events, immutable price snapshots |
| 11 | Movie Ticket Booking | Seat inventory, holds, pricing Strategy, atomic reservation |
| 12 | Meeting Room Booking | Interval overlap, recurrence, availability, concurrency, conflict prevention |
| 13 | Doctor Appointment Booking | Scheduling, rescheduling, cancellation, idempotency, reminders |
| 14 | Hotel Reservation | Room types vs physical rooms, date ranges, pricing policies, cancellation |
| 15 | Flight Booking & Seat Assignment | Flight segments, seat maps, multi-leg bookings, inventory consistency |
| 16 | E-commerce Cart & Checkout | Cart vs Order, immutable price snapshots, checkout orchestration, transactions |
| 17 | Payment Processing | State, Strategy, Adapter, idempotency keys, duplicate callbacks, refunds, compensation |
| 18 | Coupon & Promotion Engine | Strategy, Chain of Responsibility, rule composition, priorities, conflicting discounts |
| 19 | Subscription Billing | Billing lifecycle, proration, retries, failed payments, time-based operations |
| 20 | Ride Sharing | Matching Strategy, fare calculation, driver assignment, state transitions, events |
| 21 | In-memory File System | Composite, tree modeling, recursion, path resolution |
| 22 | Organization Directory / File Explorer | Composite, Iterator, recursive traversal, filtering |
| 23 | Logger Framework | Chain of Responsibility, Decorator, Strategy, asynchronous logging |
| 24 | Configuration Management | Adapter, Observer, configuration precedence, validation |
| 25 | Metrics Collection Library | Factory, Template Method, Strategy, thread safety, efficient APIs |
| 26 | LRU Cache | HashMap + doubly linked list, O(1) operations, invariants, encapsulation |
| 27 | LFU Cache | Frequency buckets, eviction rules, data structure invariants |
| 28 | In-memory Key-Value Store with TTL | Expiration, lazy vs eager cleanup, clock abstraction, atomic operations |
| 29 | Rate Limiter | Strategy, Token Bucket, Sliding Window, concurrent counters |
| 30 | Pub-Sub Message Broker | Observer, subscriptions, acknowledgments, delivery semantics, retries, backpressure |
| 31 | Thread Pool | Producer-Consumer, worker lifecycle, bounded queues, shutdown, rejection |
| 32 | Thread-safe Blocking Queue | Mutexes, condition variables, wait/notify, bounded buffers, spurious wakeups |
| 33 | Read-Write Lock | Mutual exclusion, fairness, starvation, lock semantics |
| 34 | Concurrent LRU Cache | Atomic compound operations, critical sections, lock granularity, deadlocks |
| 35 | Task Scheduler | Priority queues, delayed jobs, worker pools, retries, cancellation |
| 36 | Job Orchestration Engine | DAG dependencies, parallel execution, failure propagation, task states |
| 37 | VM Upgrade Scheduler | Bounded concurrency, atomic task claims, leases, retries, health checks, rollback |
| 38 | Distributed Lock / Lease Manager | Expiry, ownership tokens, fencing tokens, stale owners, safe release |
| 39 | Concurrent Ticket / Inventory Reservation | Race conditions, atomic holds, expiry, double booking, idempotency |
| 40 | Parallel Batch Processing Engine | Task decomposition, partitioning, Fork-Join, backpressure, cancellation, partial failure |
| 41 | Tic-Tac-Toe | Game engine, board abstraction, polymorphism, validation, extensible rules |
| 42 | Snake and Ladder | Board, dice abstraction, turn management, deterministic tests |
| 43 | Connect Four | Board state, move validation, win detection, rule encapsulation |
| 44 | Card Game / Blackjack | Deck, Hand, Card value objects, polymorphism, lifecycle |
| 45 | Task Management / Kanban Board | Entities, state transitions, filtering/sorting Strategy, notifications |
| 46 | Shopping Cart with Multiple Pricing Rules | Decorator, Strategy, discount composition, tax, money precision |
| 47 | Text Editor with Undo/Redo | Command, Memento, history stacks, snapshots vs reversible operations |
| 48 | Spreadsheet Engine | Cell dependencies, Observer, dependency graph, recalculation, cycle detection |
| 49 | Search & Filtering Framework | Specification pattern, composable predicates, sorting, pagination |
| 50 | Workflow / Rules Engine | State, Strategy, Chain of Responsibility, rule evaluation, configurable workflows |
| 51 | API Client / SDK Framework | Adapter, Builder, Decorator, middleware, request/response abstractions |
| 52 | Resilient Service Client | Retries, exponential backoff, timeouts, circuit breaker, bulkhead, fallback |
| 53 | File Synchronization Engine | Conflict-resolution Strategy, versioning, checksums, incremental updates |
| 54 | In-memory Database with Transactions | Unit of Work, Command, rollback, isolation concepts |
| 55 | Dependency Injection Container | Object graphs, Factory, constructor injection, lifecycle scopes |
| 56 | Extensible Plugin Framework | Plugin contracts, Factory/Registry, Adapter, lifecycle, Open/Closed Principle |
| 57 | Event Processing Engine | Routing, filters, ordering, retries, duplicate delivery, idempotent handlers |
| 58 | Resource / Connection Pool | Bounded resources, reuse, timeouts, validation, safe return, shutdown


# 60-Day LLD Plan (1 problem/day) — Java

| Day | Phase | Problem | Concepts it teaches |
|---|---|---|---|
| 1 | Foundations | Parking Lot | Requirements gathering, SRP, OCP, Strategy (pricing, spot allocation), Factory, enums vs polymorphism |
| 2 | Foundations | Tic-Tac-Toe | Encapsulation, O(1) win detection, generalizing to NxN, player abstraction |
| 3 | Foundations | Vending Machine | State pattern, illegal transitions, replacing if/else chains |
| 4 | Foundations | Library Management | Entity modeling, composition over inheritance, Repository, Observer (due-date alerts) |
| 5 | Foundations | Snake and Ladder | Factory, Strategy (dice), Builder (board config), separating game rules from game loop |
| 6 | Foundations | Coffee Machine | Decorator (add-ons), Template Method (brew steps), recipes as data, Builder |
| 7 | Foundations | ATM | State, Chain of Responsibility (cash dispensing), Liskov Substitution |
| 8 | Foundations | Traffic Signal | State with timers, Observer, scheduling basics |
| 9 | Foundations | Logging Framework | Singleton (and pitfalls), Chain of Responsibility, appenders, Factory, thread-safe init |
| 10 | Foundations | Notification Service | Strategy, Bridge, Adapter, retries, Interface Segregation, Dependency Inversion |
| 11 | Pattern-heavy domains | Splitwise | Strategy (split types), BigDecimal money, debt simplification graph |
| 12 | Pattern-heavy domains | Elevator System | State, SCAN/LOOK scheduling, Command, Observer |
| 13 | Pattern-heavy domains | Chess | Polymorphism, Template Method, Flyweight, Command (move undo), move validation |
| 14 | Pattern-heavy domains | Text Editor | Command, Memento, undo/redo stacks, Flyweight |
| 15 | Pattern-heavy domains | Shopping Cart and Pricing | Decorator and Strategy for discounts, Chain of Responsibility, value objects |
| 16 | Pattern-heavy domains | Coupon and Promotion Rules Engine | Specification, Composite rules, Interpreter-style rule evaluation |
| 17 | Pattern-heavy domains | Movie Ticket Booking | Seat holds with TTL, State, first concurrency hazards (double booking) |
| 18 | Pattern-heavy domains | Hotel and Flight Booking | Date-range overlap, inventory modeling, reservation lifecycle |
| 19 | Pattern-heavy domains | Car Rental | Builder, pricing strategies, availability search, Specification filters |
| 20 | Pattern-heavy domains | Food Delivery | Order lifecycle (State), Observer, Strategy for agent assignment |
| 21 | Pattern-heavy domains | Ride Sharing | Strategy (matching, pricing), State, Observer, geo abstractions |
| 22 | Pattern-heavy domains | Digital Wallet | Ledger design, immutability, idempotency keys, Command |
| 23 | Pattern-heavy domains | Payment Gateway | Adapter, Facade, Strategy routing, retries, idempotency |
| 24 | Pattern-heavy domains | Order Matching Engine | Priority queues, price-time priority, Strategy, Observer (trade events) |
| 25 | Pattern-heavy domains | Online Auction | Observer, Template Method, concurrent bids, closing rules |
| 26 | Frameworks and infra | Social Feed | Observer, Iterator, Strategy (ranking), pagination design |
| 27 | Frameworks and infra | Chat Application | Mediator, Observer, State (message status), Composite (groups) |
| 28 | Frameworks and infra | Pub-Sub System | Generics, topic registry, subscriber isolation, Observer done right |
| 29 | Frameworks and infra | File System | Composite, Iterator, Visitor (size, search), path handling |
| 30 | Frameworks and infra | Linux `find` | Specification, fluent API design, Visitor, Composite |
| 31 | Frameworks and infra | Spreadsheet | Dependency graph, topological sort, cycle detection, Observer |
| 32 | Frameworks and infra | In-Memory KV Store with TTL and Transactions | Nested transactions, Memento or Command, lazy vs active expiry |
| 33 | Frameworks and infra | LRU Cache | HashMap + doubly linked list, generics, API design |
| 34 | Frameworks and infra | LFU and Pluggable Eviction | Strategy, policy abstraction, O(1) LFU |
| 35 | Frameworks and infra | Rate Limiter | Strategy (token bucket, sliding window), Factory, per-key state |
| 36 | Frameworks and infra | Middleware Pipeline | Chain of Responsibility, Decorator, Proxy, ordering and short-circuiting |
| 37 | Frameworks and infra | Feature Flags and Config Manager | Observer (hot reload), Proxy, Singleton vs DI, immutable snapshots |
| 38 | Frameworks and infra | DI Container | Reflection, Registry, Factory, Abstract Factory, Dependency Inversion in depth |
| 39 | Frameworks and infra | Workflow and State Machine Engine | State, Strategy, Builder DSL, guards and transitions |
| 40 | Frameworks and infra | Document and Report Generator | Builder, Visitor, Template Method, Bridge (PDF/HTML/DOCX), Prototype |
| 41 | Concurrency | Producer-Consumer and Blocking Queue | Monitors, wait/notify, ReentrantLock + Condition, bounded buffers |
| 42 | Concurrency | FooBar, Zero-Even-Odd and H2O | Thread ordering, Semaphore, CyclicBarrier, CountDownLatch |
| 43 | Concurrency | Dining Philosophers | Four deadlock conditions, lock ordering, tryLock, starvation |
| 44 | Concurrency | Custom Thread Pool | Worker lifecycle, task queue, rejection policy, graceful shutdown, Future |
| 45 | Concurrency | Read-Write Lock, Semaphore and Latch from Scratch | Fairness, reentrancy, how AQS-style synchronizers work |
| 46 | Concurrency | Thread-Safe Cache with TTL | ConcurrentHashMap, lock striping, cleanup threads, memory visibility |
| 47 | Concurrency | Job Scheduler | Cron and delay scheduling, DelayQueue, priorities, retry with backoff |
| 48 | Concurrency | DAG Task Executor | Dependency resolution, parallel execution, CompletableFuture, failure propagation |
| 49 | Concurrency | In-Memory Message Queue | Partitions, consumer groups, offsets, concurrent producers/consumers |
| 50 | Concurrency | Overselling-Proof Inventory and Ticketing | Pessimistic vs optimistic locking, CAS, versioning, AtomicInteger, LongAdder |
| 51 | Concurrency | Bank Transfers | Atomicity, deadlock-free multi-lock acquisition, consistency invariants |
| 52 | Concurrency | Parallel Web Crawler and Fork/Join Merge Sort | Work stealing, thread-safe visited sets, parallel streams and pitfalls |
| 53 | Concurrency | Circuit Breaker and Retry Library | State, Decorator, sliding-window metrics, atomics |
| 54 | Concurrency | Async Pipeline and Mini Actor Framework | CompletableFuture composition, message passing, backpressure, mailboxes |
| 55 | Concurrency | Metrics Library | Lock-free counters, histograms, Observer, low-contention design |
| 56 | Staff capstones | RBAC and Permissions | Proxy, Composite roles, policy evaluation, clean authorization API |
| 57 | Staff capstones | Audit Log and Event Sourcing | Immutable events, Command, replay, CQRS-lite at class level |
| 58 | Staff capstones | Mini-Git | Composite, content hashing, commit DAG, Memento, branching |
| 59 | Staff capstones | Multi-Tenant SaaS Billing | Many patterns together, money and proration, extensibility, plugin-style pricing plans |
| 60 | Staff capstones | Final Mock Day | Timed 45-min mock on an unseen problem (e.g., Calendar/Meeting Scheduler), then redo Parking Lot and compare with Day 1 |
| 61  | Inventory with Optimistic Locking (standalone) | Version columns, CAS, retry with exponential backoff and jitter, when to pick optimistic vs pessimistic techinterview+1                            |
| 62  | Chunked File Upload                            | Upload session state machine, chunk manifest, idempotent part IDs, resumable transfers, checksum validation, parallel chunk upload techinterview+2 |
| 63  | Sync Cursor Design (offline-first sync)        | Cursor/version vectors, delta sync, conflict detection, last-write-wins vs merge, tombstones for deletes                                           |
| 64  | Collaborative Document Editing with OT         | Insert/Delete operations, transform function, server as ordering authority, operation log, snapshotting every N ops techinterview+1                |
| 65  | Real-Time Presence and Cursor Sync             | Ephemeral cursor events over pub/sub, throttling to ~10 Hz, cursor adjustment after remote ops applied techinterview+2                             |
| 66  | CRDT vs OT comparison design                   | Character-level vs operation-level CRDTs, causal context, convergence guarantees, when to pick CRDT over OT techinterview+1                        |