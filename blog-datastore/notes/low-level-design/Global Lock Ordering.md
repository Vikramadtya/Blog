---
id: 129731d4-21a6-43e6-8646-0749fdcdcdc7
tags:
---
# Global Lock Ordering

> A lock is a mechanism that allows only one thread at a time to access a protected resource or critical section.

A deadlock occurs when two or more threads are permanently waiting for locks held by one another, so none of them can proceed.


Scenario, User A transfers $50 to B. At the exact same time, B transfers $20 back to A. For a transfer, we need to modify two accounts. We must lock both accounts to prevent another transaction from changing their balances midway through the transfer.
- Thread 1 locks Account A → then waits for Account B.
- Thread 2 locks Account B → then waits for Account A.
Both threads are waiting. Neither can proceed.

```mermaid
flowchart TD
    T1["Thread 1: Transfer A → B"]
    T2["Thread 2: Transfer B → A"]

    A["🔒 Account A locked by Thread 1"]
    B["🔒 Account B locked by Thread 2"]

    T1 --> A
    A -->|"Waits for"| B
    T2 --> B
    B -->|"Waits for"| A

    style A fill:#fce4e4,stroke:#d32f2f
    style B fill:#fce4e4,stroke:#d32f2f
```


The Coffman conditions, all four must hold simultaneously for a deadlock.

| Condition | Meaning | Bank transfer example |
|---|---|---|
| 1. Mutual Exclusion | A resource can be held by only one thread at a time. | Only one thread can hold Account A's lock. |
| 2. Hold and Wait | A thread holds one resource while waiting for another. | Thread 1 holds A and waits for B. |
| 3. No Preemption | A lock cannot simply be forcibly taken away from its owner. | Thread 2 cannot forcibly take Account B's lock from Thread 1. |
| 4. Circular Wait | Threads form a circular chain of dependencies. | Thread 1 waits for B, while Thread 2 waits for A. |




**Global Lock Ordering** prevents deadlocks caused by circular wait by ensuring every thread acquires shared resources in the same predefined order, irrespective of the business operation it is performing. For example, always acquire locks in ascending order of their resource ID


```mermaid
sequenceDiagram
    participant T1 as Thread 1 (A → B)
    participant T2 as Thread 2 (B → A)
    participant A as Account A (ID 10)
    participant B as Account B (ID 20)

    T1->>A: Acquire lock A
    Note over T1,A: Lock A acquired

    T2->>A: Request lock A
    Note over T2: Waits without holding B

    T1->>B: Acquire lock B
    Note over T1,B: Lock B acquired

    T1->>T1: Execute transfer A → B
    T1->>B: Release lock B
    T1->>A: Release lock A

    A-->>T2: Lock A available
    T2->>A: Acquire lock A
    T2->>B: Acquire lock B
    T2->>T2: Execute transfer B → A
    T2->>B: Release lock B
    T2->>A: Release lock A
```

