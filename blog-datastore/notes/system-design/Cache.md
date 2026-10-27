# Cache


## Cache-aside

## Hot Key


Cache invalidation is a consistency protocol
- use versioned cache entries or conditional writes so that an older in-flight write can not overwrite a newer value.

## Production improvements

### Single-flight/request coalescing 
one in-flight refresh per key, with a bounded number of waiters.

### TTL jitter
spread expiration times to prevent synchronized expiry.

### Stale-while-revalidate
serve stale data only where the freshness policy permits it.

### Negative caching
cache selected “not found” results briefly, while avoiding poisoning or stale authorization outcomes.

### Refresh-ahead
proactively refresh hot keys whose expiry would cause an expensive miss.

### Bounded fallback
Prevent every request from independently hitting the source during a cache failure.

## HTTP Cache 
For shared HTTP caches, define Cache-Control, validators such as ETag, and variation behavior correctly. A GET request is not automatically safe to cache, and cache directives must align with the response's authorization semantics.
