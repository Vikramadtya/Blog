# HTTP

HTTP (Hypertext Transfer Protocol) is the application-layer protocol used for communication between clients and servers. It defines the semantics and framing of messages exchanged over a connection.

```
Application:  HTTP
Security:     TLS (for HTTPS)
Transport:    TCP (HTTP/1.1, HTTP/2) or QUIC (HTTP/3)
Network:      IP
Link:         Ethernet / Wi-Fi / cellular
```


## HTTP message structure


```
GET /products/42?currency=USD HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>
User-Agent: ExampleClient/1.0
```

Main components:
- Method — intended action, such as GET, POST, PUT, DELETE.
- Target — path and optional query; HTTP/1.1 commonly uses origin-form.
- Version — e.g. HTTP/1.1.
- Headers — metadata about request, representation, authentication, caching, etc.
- Body — optional payload, commonly used with POST, PUT, and PATCH.

## Methods and their semantics

| Method  | Typical purpose                | Safe? | Idempotent?    |
| :------ | :----------------------------- | :---- | :------------- |
| GET     | Retrieve representation        | Yes   | Yes            |
| HEAD    | GET metadata, no response body | Yes   | Yes            |
| POST    | Submit/process data            | No    | Not inherently |
| PUT     | Replace resource at target URI | No    | Yes            |
| PATCH   | Partial modification           | No    | Not inherently |
| DELETE  | Remove resource                | No    | Yes            |
| OPTIONS | Discover communication options | Yes   | Yes            |
| TRACE   | Diagnostic loopback            | Yes   | Yes            |
| CONNECT | Establish tunnel               | No    | No             |

- **Safe** means the client is not asking for a state-changing operation.
- **Idempotent** means repeating the same request has the same intended effect as performing it once.

> `DELETE` is idempotent in semantics even if the first request returns 204 and a repeat returns 404.
> `POST` is not inherently idempotent



### GET — Retrieve a resource

```
GET /products?category=books&sort=price
GET /orders?limit=50&cursor=eyJ...
GET /users/123
```

- Retrieves a representation of a resource.
- Safe and idempotent.
- Usually cacheable, subject to cache directives and authorization.
- Request bodies on GET have no generally defined semantics and should be avoided.
- Query parameters are commonly used for filtering, sorting, pagination, or search.

Some things to keep in mind
- Do not use GET to mutate state.
- Avoid putting secrets in query strings; URLs may be logged or exposed through history and referrers.
- Large or complex search criteria may be better handled by a dedicated search endpoint using POST, if necessary.

### POST — Create or process a resource
POST asks the target resource to process the submitted representation. Common uses:
- Create a resource when the server assigns its ID.
- Submit a command or workflow.
- Start asynchronous work.
- Perform a search with a complex body.


> POST is not inherently idempotent. Repeating a create request may create duplicate resources.

#### Idempotency keys
A common pattern:

```
POST /payments
Idempotency-Key: 8f1c...
Content-Type: application/json
```

The server stores the key and result atomically with the operation. Repeated requests with the same key return the original result rather than executing the operation again.


### PUT — Replace a resource


> “Replace” means replacement of the resource’s intended state, not necessarily that every database column must be overwritten literally. The API contract must define omitted fields.

- The client identifies the target resource URI.
- The request generally represents the desired full state.
- PUT is idempotent.Repeating the same PUT should converge to the same intended resource state.
- PUT may create the resource if the API supports creation at that URI.


### PATCH — Partially modify a resource
PATCH is used when the client wants to modify only part of a resource.

### DELETE — Remove a resource

- Requests removal of the target resource.
- Idempotent in intended effect.
- The first request may return 204; a repeat may return 404.
- The server may implement soft deletion rather than immediate physical erasure.

## Status codes

### 2xx — Success
- 200 OK: successful request; response body often included.
- 201 Created: resource created; often includes Location.
- 202 Accepted: accepted for asynchronous processing, not necessarily completed.
- 204 No Content: successful request with no response body.
- 206 Partial Content: range request response.

### 3xx — Redirection
- 301 Moved Permanently
- 302 Found
- 303 See Other
- 304 Not Modified — cache validation result, no representation body.
- 307 Temporary Redirect — preserves method and body.
- 308 Permanent Redirect — preserves method and body.

> `301/302` historically may cause clients to change POST to GET; `307/308` explicitly preserve the method.

### 4xx — Client/request-side issue
- 400 Bad Request
- 401 Unauthorized — authentication is missing or invalid; often accompanied by WWW-Authenticate.
- 403 Forbidden — server understood but refuses.
- 404 Not Found
- 405 Method Not Allowed — should include Allow.
- 409 Conflict
- 412 Precondition Failed
- 413 Content Too Large
- 415 Unsupported Media Type
- 429 Too Many Requests — often includes Retry-After.

### 5xx — Server or upstream failure
- 500 Internal Server Error
- 502 Bad Gateway — proxy received an invalid upstream response.
- 503 Service Unavailable — temporary overload/maintenance; may include Retry-After.
- 504 Gateway Timeout — proxy did not receive a timely upstream response.


## HTTP/1.1 connection behavior
A single TCP connection can carry multiple requests over time.  However, HTTP/1.1 does not natively multiplex independent responses on one connection: requests are generally processed in order, and responses must preserve that order.

- Application-Level Head-of-line blocking
  - If request A takes a long time, response B on the same connection may be delayed even if B is ready.
 
Message framing
  - HTTP/1.1 determines message-body boundaries using:
    - Content-Length
    - Transfer-Encoding: chunked

## HTTP/2
HTTP/2 keeps HTTP semantics but changes transport framing.

Key features:
- Binary frames.
- Multiple concurrent streams over one TCP connection.
- Header compression using HPACK.
- Stream-level flow control.
- Stream prioritization mechanisms (implementation and behavior vary).

> Transport-Layer HOL Blocking Still Happens in HTTP/2.  Even if the missing packet belongs to just one specific HTTP/2 stream (e.g., Stream 1), all other active streams on that same TCP connection (e.g., Streams 2 through 10) freeze and wait, completely erasing the benefit of multiplexing until the packet loss is resolved.

## HTTP/3 and QUIC
HTTP/3 maps HTTP semantics onto QUIC, which runs over UDP.

Key characteristics:
- QUIC provides reliable streams, congestion control, encryption, and connection management.
- TLS 1.3 is integrated into QUIC.
- Independent streams avoid TCP’s cross-stream head-of-line blocking.
  - QUIC implements streams natively at the transport layer, providing per-stream loss recovery. If a packet is lost on one stream, only that specific stream pauses while all other independent streams continue flowing without interruption.
- Connection migration can support network changes, such as Wi-Fi to cellular, using connection IDs.
- QUIC has stream-level and connection-level flow control.

## HTTP caching

!!! info "ETag"
    An ETag (Entity Tag) is an HTTP response header that acts as a unique, server-generated identifier for a specific version of a web resource 

### Cache-Control directives

Cache-Control: public, max-age=300, s-maxage=600
- max-age: freshness lifetime for caches.
- s-maxage: freshness lifetime for shared caches.
- public: shared caches may store the response.
- private: only private caches, such as a browser, may store it.
- no-cache: may store, but must revalidate before reuse.
- no-store: do not store.
- must-revalidate: stale response must be revalidated before reuse.


### Validators
- `ETag / If-None-Match`: entity-tag based validation.
  - ```
    GET /profile HTTP/1.1
    If-None-Match: "v42"
    
    // If unchanged:
    HTTP/1.1 304 Not Modified
    ETag: "v42"
    Cache-Control: max-age=60
    ```
- `Last-Modified / If-Modified-Since`: timestamp-based validation.

> ETags are often more precise than timestamps. A strong ETag indicates byte-level representation equivalence; a weak ETag (W/"...") indicates semantic equivalence suitable for some cache validation scenarios.

### Key
A cache key commonly includes scheme, host, path, and query, with implementation-specific rules.

The HTTP `Vary` response header tells a browser or a CDN (content delivery network) which request headers influenced the content of the server's response. It tells the cache how to build a unique cache key so that it does not serve the wrong version of a page or resource to a user.


## Concurrency control: preventing lost updates

Two clients may read the same resource and then update it concurrently. Use optimistic concurrency control with ETags. Client updates only if the resource is still at that version.