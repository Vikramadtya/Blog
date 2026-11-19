---
id: 1e3db558-555e-49ae-aab2-14d860aa4e5c
tags:
---
# ReadWriteLock vs synchronized vs ReentrantLock


| Feature | synchronized | ReentrantLock | ReentrantReadWriteLock |
|---|---|---|---|
| Exclusive write access | Yes | Yes | Yes |
| Multiple concurrent readers | No, with the same monitor | No, with the same lock | Yes |
| Explicit lock/unlock | No | Yes | Yes |
| Try lock / timed acquisition | No | Yes | Yes |
| Fairness option | No | Yes | Yes |
| Reentrant | Yes | Yes | Yes |
| Complexity | Low | Medium | Higher |

ReentrantLock is useful when you need explicit locking features such as tryLock(), timed acquisition, or interruptible lock acquisition.

ReentrantReadWriteLock is useful when reads are frequent and writes are relatively infrequent.