# Database locking / atomic updates

Locking prevents multiple access from modifying shared state at the same time in a way that breaks correctness.

> - Locking coordinates concurrent access to shared state.
>   - Lock around a state transition that must happen atomically not just around a read.
> - A transaction groups database changes into a unit with properties such as atomicity and consistency.
> - A database constraint rejects invalid states even if application code has a bug or concurrent requests race.

## Optimistic vs. pessimistic locking


These are two approaches to handling conflicting operations.

### Pessimistic locking
Acquire a lock before modifying the resource, preventing conflicting work while the lock is held.

- Good when contention is frequent and conflicts are expensive.
- Other transactions may wait, reducing throughput.

#### Row-level locks

Row-level locks `SELECT ... FOR UPDATE`

### Optimistic locking
Read a version number, then update only if the version is unchanged.

- Good when conflicts are relatively uncommon.
- A conflicting update fails and the application must retry or report a conflict.

#### Conditional Update

The database executes this state transition atomically.

```sql
UPDATE parking_spot
SET status = 'OCCUPIED',
    vehicle_id = :vehicleId
WHERE id = :spotId
  AND status = 'AVAILABLE';
```
