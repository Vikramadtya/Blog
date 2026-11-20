---
id: 1e3db558-555e-49ae-aab2-14d860aa4e5c
tags:
---
# ReadWriteLock vs synchronized vs ReentrantLock

```mermaid
flowchart TD
    subgraph S["synchronized / ReentrantLock"]
        direction LR
        T1["Thread 1"] --> L["Exclusive lock"]
        T2["Thread 2"] --> W["Wait"]
        T3["Thread 3"] --> W
        L --> R["Shared resource"]
    end

    subgraph RW["ReadWriteLock"]
        direction LR
        R1["Reader 1"] --> RL["Read lock"]
        R2["Reader 2"] --> RL
        R3["Reader 3"] --> RL
        RL --> RS["Shared resource"]
        WR["Writer"] --> WL["Write lock"]
        WL -. "Waits for readers" .-> RL
    end
```

| Feature | synchronized | ReentrantLock | ReentrantReadWriteLock |
|---|---|---|---|
| Exclusive write access | Yes | Yes | Yes |
| Multiple concurrent readers | No, with the same monitor | No, with the same lock | Yes |
| Explicit lock/unlock | No | Yes | Yes |
| Try lock / timed acquisition | No | Yes | Yes |
| Fairness option | No | Yes | Yes |
| Reentrant | Yes | Yes | Yes |
| Complexity | Low | Medium | Higher |

`ReentrantLock` is useful when you need explicit locking features such as `tryLock()`, timed acquisition, or interruptible lock acquisition.

`ReentrantReadWriteLock` is useful when reads are frequent and writes are relatively infrequent.

## Synchronized — one thread at a time
Java's synchronized provides mutual exclusion. Only one thread at a time can execute a protected critical section using the same monitor. ( a critical section is the part of the program that accesses or modifies shared state )

- Only one thread can hold the monitor at a time.
- Readers cannot run concurrently when they synchronize on the same monitor.
- Lock acquisition and release are automatic when entering and leaving the synchronized block/method.
- Reentrant: a thread holding the monitor can enter another synchronized block using the same monitor.
- Good for relatively simple, low-contention operations.

```java
synchronized (wallet) {
    if (wallet.getBalance() >= amount) {
        wallet.withdraw(amount);
    }
}
```

## ReentrantLock — one thread at a time, with more control
It still allows only one thread to hold the lock, but gives you additional control over acquiring and releasing it.


Additional capabilities
- tryLock() — attempt to acquire without waiting indefinitely.
- tryLock(timeout) — wait for a limited time.
- lockInterruptibly() — allow a waiting thread to be interrupted.
- Optional fairness policy.
- Explicit unlock() in a finally block.

## ReadWriteLock — multiple readers, one writer

Optimised for read-heavy workloads, multiple readers can safely read the same consistent value at the same time, provided writers are excluded.

`ReadWriteLock` has two locks:
- `Read lock` : Multiple threads can hold it simultaneously.
- `Write lock` : Only one thread can hold it, and no readers can hold the read lock at the same time.

This can improve throughput for read-heavy workloads.
- Multiple threads can read the balance concurrently.
- A writer waits until existing readers finish.
- Once a writer has the lock, new readers also wait.


!!! warning "Writer starvation"
    Imagine a continuous stream of balance-read requests.
    A writer wants to update the balance, but new readers keep acquiring read locks before the writer gets a chance. The writer may wait for a very long time. This is called writer starvation.