# Interaction Design with HTTP

## 1. Request Methods

In a REST API, HTTP methods (verbs) define the semantics of the interaction. They are not merely "tags" but a contract that describes how a client intends to interact with the server's resource model.

### Core Method Semantics


| Method | Action | Archetype | Safe? | Idempotent? |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Retrieve state | All | Yes | Yes |
| **HEAD** | Retrieve metadata | All | Yes | Yes |
| **PUT** | Replace/Insert | Store, Document | No | Yes |
| **PATCH** | Partial Update | Document | No | No* |
| **POST** | Create/Action | Collection, Controller | No | No |
| **DELETE** | Remove | Store, Document | No | Yes |
| **OPTIONS** | Metadata Discovery | All | Yes | Yes |

> **Note on Idempotency:** An idempotent operation is one that has no additional effect if it is called more than once with the same input parameters. **Safety** implies the method does not change the state of the resource (read-only).

---

### Method Rules and Best Practices

#### Rule: GET and POST must not be used to tunnel other request methods
Tunneling (e.g., using `POST /deleteUser?id=123`) violates the transparency of the HTTP protocol. It prevents intermediaries (proxies, caches, and firewalls) from correctly interpreting the intent of the message.

#### Rule: GET must be used to retrieve a representation
GET is strictly for retrieval. A GET request must have no side effects on the resource's state. While headers are permitted, modern standards dictate that **GET requests should not contain a body**.

#### Rule: HEAD should be used to retrieve response headers
HEAD is identical to GET, but the server **must not** return a message-body. It is used to check if a resource exists, verify metadata (like `Content-Length`), or check if a cache is fresh (`ETag`).

#### Rule: PUT must be used to replace or insert a resource
PUT is a "replacement" operation.
* **Update:** PUT replaces the entire state of a document. If fields are omitted in the request body, the server should typically set them to null or default values.
* **Insert:** PUT can be used to add a resource to a **Store** if the client provides the full URI (e.g., `PUT /favorites/my-id`).

#### Rule: PATCH must be used for partial updates
Unlike PUT, **PATCH** applies a partial modification to the resource. It is more bandwidth-efficient than PUT when dealing with large resources where only a few fields need changing.
* *Note:* PATCH is technically not guaranteed to be idempotent unless the server implements it as such (e.g., JSON Merge Patch).

#### Rule: POST must be used to create in a collection or execute controllers
POST is the most flexible method. 
* **Collections:** Use POST to add a resource where the server decides the ID (e.g., `POST /users`).
* **Controllers:** Use POST to trigger procedural actions that don't map to CRUD (e.g., `POST /alerts/1/resend`).

#### Rule: DELETE must be used to remove a resource from its parent
Once a DELETE is processed, future GET or HEAD requests for that URI must result in a $404$ ("Not Found") or $410$ ("Gone"). 
* **Soft Deletes:** If the API provides a "soft delete" (keeping the data but marking it inactive), use a controller (`POST /users/1/deactivate`) or PATCH instead of DELETE, as the resource URI remains addressable.

#### Rule: OPTIONS should be used for discovery
OPTIONS returns the `Allow` header, listing the HTTP methods supported by the resource. This is critical for **CORS** (Cross-Origin Resource Sharing) preflight checks.

---

## 2. Response Status Codes

Status codes are divided into five distinct classes. Proper use allows clients to handle errors and successes programmatically without parsing the response body.



| Category | Description |
| :--- | :--- |
| **$1xx$** | **Informational:** Transfer protocol-level status. |
| **$2xx$** | **Success:** The request was received, understood, and accepted. |
| **$3xx$** | **Redirection:** Further action is needed to complete the request. |
| **$4xx$** | **Client Error:** The request contains bad syntax or cannot be fulfilled. |
| **$5xx$** | **Server Error:** The server failed to fulfill an apparently valid request. |

---

### Success ($2xx$)

* **$200$ (“OK”):** Generic success. Must include a body. **Never** use $200$ to wrap an error message.
* **$201$ (“Created”):** Used when a resource is successfully created (via POST/PUT). The response **must** include a `Location` header with the URI of the new resource.
* **$202$ (“Accepted”):** Used for **asynchronous** operations. The request is valid but processing isn't finished. Usually returns a "task" URI to track progress.
* **$204$ (“No Content”):** Success where no body is needed (common for DELETE or updates where the client doesn't need to see the reflected state).

### Redirection ($3xx$)

* **$301$ (“Moved Permanently”):** Resource has a new permanent URI. 
* **$303$ (“See Other”):** Redirects to a different resource. Often used after a POST controller to send the client to a status page or the created resource without repeating the POST.
* **$304$ (“Not Modified”):** Preserves bandwidth. Used when the client's cached version is still valid (based on `If-None-Match` or `ETag`).
* **$307$ (“Temporary Redirect”):** The client should resubmit the request to the new URI but **must not** change the HTTP method.
* **$308$ (“Permanent Redirect”):** The modern (2026) equivalent of $301$. Like $307$, it ensures the client keeps the original HTTP method (e.g., a POST remains a POST).

### Client Error ($4xx$)

* **$400$ (“Bad Request”):** Generic client error. Used for malformed syntax.
* **$401$ (“Unauthorized”):** Missing or invalid credentials.
* **$403$ (“Forbidden”):** Credentials provided but insufficient permissions. $403$ is final; unlike $401$, re-authenticating won't help.
* **$404$ (“Not Found”):** The URI maps to no resource.
* **$405$ (“Method Not Allowed”):** The URI is valid, but the method isn't. Must include the `Allow` header.
* **$406$ (“Not Acceptable”):** The server cannot produce a response matching the `Accept` headers provided by the client.
* **$409$ (“Conflict”):** Violates the resource state (e.g., trying to create a user with an email that already exists).
* **$412$ (“Precondition Failed”):** Used with conditional headers (like `If-Match`). Critical for preventing the "Lost Update" problem in concurrent environments.
* **$415$ (“Unsupported Media Type”):** The server doesn't support the format of the **request body** (e.g., client sent XML, server only likes JSON).
* **$422$ (“Unprocessable Entity”):** Modern standard for **validation errors**. The syntax is correct, but the business logic is failed (e.g., a field is missing or out of range).
* **$429$ (“Too Many Requests”):** Rate limiting. Should include a `Retry-After` header.

### Server Error ($5xx$)

* **$500$ (“Internal Server Error”):** Generic catch-all for server crashes.
* **$503$ (“Service Unavailable”):** Server is temporarily down for maintenance or overloaded. 
* **$504$ (“Gateway Timeout”):** An upstream server (like a database or microservice) failed to respond in time.
