# Client-Side Concerns and Infrastructure

![image](/notes-assets/c6-summary.jpg)


A REST API's design must account for the diverse needs of its clients—ranging from bandwidth conservation on mobile devices to the security restrictions of browser-based JavaScript environments.

---

## 1. Versioning and Resource Evolution

In RESTful theory, a URI identifies a **concept**, not a specific snapshot of data. Effectively managing changes without breaking clients is a hallmark of a mature API. While many developers default to putting version numbers in the URI, this can lead to "URI bloat." 


### Rule: New URIs should be used to introduce new concepts

A URI identifies a resource that remains conceptually constant over time. If a "User" resource evolves from having a `name` field to having `firstName` and `lastName`, the concept of "User" hasn't changed—only its representation has.

* **Academic REST Approach:** Versioning should happen in the **Media Type** or via **Content Negotiation** (e.g., `Accept: application/vnd.example.v2+json`). This keeps the URI clean and permanent.
* **Industry Pragmatism (2026 Standard):** While URI versioning (e.g., `/v1/users`) is technically "un-RESTful," it is the industry standard for developer experience (DX). It provides clear, breaking-change boundaries that are easy to debug and cache.

### Rule: Schemas should be used to manage representational versions
Instead of changing the URI, version the **schema**.

* **Forward Compatibility:** Design APIs to be additive. Adding a new field to a JSON response is generally not a breaking change for well-behaved clients.
* **Deprecation:** Use the `Deprecation` and `Link` (with `rel="deprecation"`) HTTP headers to inform clients that a specific representation version is nearing end-of-life.

### Rule: Entity Tags (ETags) for fine-grained state versioning

`ETag` values act as a versioning system for the *state* of an individual resource.

* Use `ETag` to implement **Optimistic Concurrency Control**. A client sends `If-Match: "etag_value"` with a `PUT` request to ensure they aren't overwriting a version of the resource they haven't seen.



---

## 2. Security and Protection

### Rule: Use OAuth 2.1 for Resource Protection
OAuth is the industry-standard authorization framework. In 2026, **OAuth 2.1** has consolidated best practices (like mandatory PKCE for all clients) and **OpenID Connect (OIDC)** (the identity layer) are the defaults.

* **Statelessness:** REST APIs should utilize **JWTs (JSON Web Tokens)** for authorization. This allows the API to remain stateless, as the token contains all the necessary claims (identity and scopes) to authorize the request without a database lookup on every call.
* **Scope-based Access:** Protect resources by defining granular scopes (e.g., `read:orders`, `write:profile`).

### Rule: Utilize API Gateways and Management Solutions
Modern infrastructure utilizes an **API Gateway** (a specialized reverse proxy) as a "front door."

* **Responsibilities:** The gateway handles cross-cutting concerns: **Rate Limiting** (preventing DDoS), **IP Whitelisting**, **SSL Termination**, and **Telemetry**.
    * **Rate Limiting:** Protecting the API from "thundering herd" issues or DDoS attacks.
    * **Protocol Translation:** Converting modern requests (REST/JSON) to legacy backends (SOAP/XML).
    * **Telemetry:** Centralized logging, metrics, and tracing (OpenTelemetry).

* **Identity Bridging:** Gateways can translate external OAuth tokens into internal identifiers for downstream microservices.



---

## 3. Response Representation Composition

Clients often have different data requirements. A mobile app may need a tiny snippet, while a desktop dashboard needs the full object.

### Rule: The query component should support partial responses
To save bandwidth, support "Sparse Fieldsets."

* **Inclusion Syntax:** `GET /users/123?fields=firstName,lastName,email`
* **Exclusion Syntax (Negation):** While rare, some APIs use `!` to exclude heavy fields, though explicit inclusion is generally safer for performance.
* **Modern Alternative:** For extremely complex data composition, consider providing a **GraphQL** endpoint alongside your REST resources to allow clients total control over the response shape.

---

## 4. JavaScript Clients and Cross-Origin Resource Sharing (CORS)

### The Same-Origin Policy (SOP)
Browser-based security restricts scripts from interacting with resources of a different origin. An origin is defined by the **Scheme + Host + Port**.

| Origin A            | Origin B              | Result        | Reason                          |
| :------------------ | :-------------------- | :------------ | :------------------------------ |
| `http://api.com`    | `https://api.com`     | **Different** | Scheme mismatch (HTTP vs HTTPS) |
| `http://api.com:80` | `http://api.com:8080` | **Different** | Port mismatch                   |
| `http://api.com`    | `http://v2.api.com`   | **Different** | Host mismatch (Subdomain)       |

### Rule: Support CORS for multi-origin access

**CORS** is the standardized mechanism to relax SOP for trusted clients.

#### 1. Simple Requests

Requests using `GET`, `HEAD`, or `POST` (with specific content types) are sent directly with an `Origin` header.

#### 2. Preflight Requests (The OPTIONS Interaction)

For "unsafe" methods (`PUT`, `DELETE`, `PATCH`) or custom headers, the browser sends a **Preflight** request using the `OPTIONS` verb.

- **The Handshake:** The server must respond with `Access-Control-Allow-Origin` and `Access-Control-Allow-Methods`.
- **Credential Sharing:** If the client needs to send cookies or Authorization headers, the server must return `Access-Control-Allow-Credentials: true`.
- The Result: Only if the preflight is successful will the browser send the actual JavaScript request.