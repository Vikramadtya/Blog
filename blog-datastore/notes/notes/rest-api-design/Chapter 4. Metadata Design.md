# Metadata Design: HTTP Headers and Media Types

![image](/notes-assets/c4-summary.jpg)

## 1. Metadata and Representation Headers
Metadata in HTTP serves as the "data about data," conveying essential information through headers. Modern REST architecture distinguishes between **Request/Response headers** (control info) and **Representation headers** (description of the payload).

---

## 2. Content Metadata Rules

### Rule: `Content-Type` must be used
The `Content-Type` header identifies the media type of the message body. Without it, recipients are forced to perform "MIME-sniffing," which is a significant security risk (e.g., executing a `.txt` file as a `.js` script).

* **Standard:** Always include the character encoding if applicable (e.g., `application/json; charset=utf-8`).

### Rule: `Content-Length` should be used
This header specifies the size of the body in decimal number of octets (bytes). 

1. **Verification:** Allows the client to ensure the full payload was received.
2. **Optimization:** Allows a `HEAD` request to determine file size without a full download.
3. **Persistent Connections:** Crucial for HTTP/1.1 keep-alive to know where one message ends and the next begins.


### Rule: `Last-Modified` should be used in responses
A timestamp indicating when the resource was last altered. This enables "Conditional GET" requests via the `If-Modified-Since` header, saving bandwidth if the resource hasn't changed.

### Rule: `ETag` should be used in responses
An `ETag` (Entity Tag) is an opaque, unique identifier (often a hash) for a specific version of a resource.

* **Validation:** Clients store the `ETag` and send it back in future requests using `If-None-Match`. If the server's current `ETag` matches, it returns a **304 Not Modified**, instructing the client to use its cached version.

| Header              | Type          | Description                                                  |
| :------------------ | :------------ | :----------------------------------------------------------- |
| **`Last-Modified`** | Timestamp     | The UTC date and time the resource was last altered.         |
| **`ETag`**          | Opaque String | A unique fingerprint (hash) of the resource's current state. |


---

## 3. Conditional Requests and Concurrency

### Rule: Stores must support conditional `PUT` requests
Store resources (client-managed) use `PUT` for both creation and updates. Without conditional headers, a "Lost Update" problem occurs where two clients overwrite each other's changes.

* **Implementation:** APIs must require `If-Match` or `If-Unmodified-Since` for `PUT` operations.
    * **`If-Match`:** Ensures the client is updating the version they originally retrieved. The operation proceeds only if the current `ETag` matches the one provided. If not, the server returns **412 Precondition Failed**.
    * **`If-Unmodified-Since`:** Prevents updates if the resource state has shifted since a specific time. The operation proceeds only if the resource hasn't changed since a specific timestamp.
* **Failure State:** If the condition is not met, the server returns **412 Precondition Failed**.

---

## 4. Redirection and Location

### Rule: `Location` must specify the URI of new resources
The `Location` header is mandatory for **201 Created** responses to point the client to the newly minted URI.

* **Asynchronous Tasks:** In a **202 Accepted** response, `Location` should point to a "Status Monitor" resource where the client can track the progress of the long-running operation.

---

## 5. Caching Design

Caching is the primary mechanism for improving REST API scalability and reducing latency.

### Rule: Use `Cache-Control` to encourage caching
The `Cache-Control` header is the modern standard for defining cacheability.

* **`max-age`:** Defines freshness in seconds.
* **`must-revalidate`:** Instructs the cache that once a resource becomes stale, it **must** be re-validated with the origin server before being served.



### Rule: Discourage caching only when necessary
Use `no-store` and `no-cache` to prevent sensitive or highly volatile data from being stored. 

- Use `no-store` to prevent any caching (including the browser's disk cache) 
- Use `no-cache` to force revalidation every single time.

```http
Cache-Control: no-store, no-cache, must-revalidate
```

* **Modern Pro-Tip:** Instead of `no-cache`, use a very low `max-age` (e.g., 1 second). This allows for "micro-caching," which can absorb thundering-herd traffic spikes without sacrificing data freshness.

### Rule: Support "Negative Caching"
Apply `Cache-Control` headers to **3xx** and **4xx** responses. Caching a **404 Not Found** for a short period (e.g., 60 seconds) prevents repetitive, expensive lookups for resources known to be missing.

---

## 6. Custom Headers and Security

### Rule: Do not use custom headers to change HTTP semantics
Custom headers (formerly prefixed with `X-`, now deprecated per RFC 6648) should only be used for informational purposes (e.g., `RateLimit-Limit`). They must not be required for basic protocol compliance.

### Modern Standard: Security Headers
Every REST API in 2026 should implement:

* **`Strict-Transport-Security` (HSTS):** Enforces HTTPS, forces the browser to use HTTPS only
* **`Content-Security-Policy` (CSP):** Mitigates XSS, by limits where the browser can load scripts and data from
* **`X-Content-Type-Options: nosniff`:** Disables MIME-sniffing i.e prevents the browser from trying to guess the Content-Type
* **`X-Frame-Options`**: Prevents Clickjacking by disallowing the API documentation or UI from being loaded in an `<iframe>`.

---

## 7. Media Types and Negotiation

### Media Type Syntax
The formal syntax for a media type is:

```
type "/" subtype *( ";" parameter )$$
```

### Common Registered Types

Common types include application, audio, image, text, and video.

* `application/json`: The current industry default for structured data.
* `application/problem+json`: The standard for communicating API error details (RFC 7807).
* `multipart/form-data`: Used for file uploads.

### Vendor-Specific Media Types (`vnd`)
Used to convey domain-specific semantics. While `application/json` tells you the syntax is JSON, a vendor type tells you the **schema**.

Vendor-specific types describe the semantics (the "what").

* **Example:** `application/vnd.github.v3+json`

### Rule: Support Content Negotiation

Clients use the `Accept` header to request specific formats.
```http
Accept: application/vnd.example.user+json; q=1.0, application/json; q=0.8
```

The `q` parameter (Quality Value) allows the client to rank preferences.

### Rule: Support Query Parameter "Tunneling" for Debugging

While headers are the standard, allowing `?accept=application/xml` facilitates testing via browsers and simple `curl` commands. This is known as **Format Tunneling** and should be treated as a secondary override.



---

## 8. Cross-Origin Resource Sharing (CORS)
When an API is accessed from a browser-based frontend on a different domain, the server must provide CORS headers.

* **`Access-Control-Allow-Origin`:** Defines which domains are permitted.
* **`Access-Control-Allow-Methods`:** Defines permitted verbs.
* **`Access-Control-Allow-Headers`**: Lists which custom headers can be sent.
* **`Access-Control-Expose-Headers`:** Allows the client to read custom headers like `ETag` or `Location`.
