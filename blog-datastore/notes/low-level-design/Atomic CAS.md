---
id: 72a6b160-ae62-49f8-8bd0-6ada25236388
tags:
---
# Atomic CAS

If we want to avoid traditional lock-based mutual exclusion for a very small state update atomic variables and CAS come into the picture.

**CAS** stands for **Compare-And-Set (also commonly called Compare-And-Swap)** it is an atomic operation that conceptually does three things:
1. Read the current value.
2. Compare it with an expected value.
3. If it matches, replace it with a new value.
The comparison and replacement happen as one indivisible operation.


Multiple threads can execute concurrently, but only one wins the atomic update. There is no explicit application-level lock around the operation.


CAS-based retry algorithms can be lock-free, but a CAS loop is not automatically wait-free. A particular thread might repeatedly lose the race and retry.

!!! danger "ABA problem"
    Suppose a thread reads a value A. Before it performs CAS, another thread changes the value `A → B → A` the original thread checks the value and sees A again. It assumes nothing changed, even though the state changed in between.

    One mitigation is a version or stamp:
    ```
      (A, version 1)
      → (B, version 2)
      → (A, version 3)
    ```