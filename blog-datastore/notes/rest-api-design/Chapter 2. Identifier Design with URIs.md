# Identifier Design with URIs

## 1. URI Fundamentals

REST APIs use **Uniform Resource Identifiers (URIs)** to address resources. A URI is the unique name and address of a resource in your API's ecosystem.

* **API Designers:** Should strive for URIs that are clean, readable, and intuitive. A URI should reflect the resource model, not the underlying database schema.
* **API Clients:** Should treat URIs as **opaque links**. This follows the **HATEOAS** (Hypermedia as the Engine of Application State) principle—clients should follow links provided by the server in resource representations rather than manually constructing URIs via string concatenation.

### The Generic URI Syntax
Defined by **RFC 3986**, the generic structure of a URI is:


```
$$URI = scheme "://" authority "/" path [ "?" query ] [ "#" fragment ]$$
```

The **authority** component consists of:

```
$$authority = [ userinfo "@" ] host [ ":" port ]$$
```
---

## 2. URI Format Rules



### Rule: Forward slash (/) indicates hierarchical relationships
The forward slash is the primary delimiter used in the path to indicate a parent-child relationship between resources.
* **Example:** `/leagues/seattle/teams/trebuchet`

### Rule: Do not include trailing forward slashes (/)
A trailing slash adds no semantic value and may cause confusion for caches or result in 404 errors in strict routing systems. 
* **Modern Standard:** If a client requests `/shapes/`, the server should ideally issue a `301 Moved Permanently` redirect to `/shapes`. Every character in a URI contributes to its identity; technically, these are two different resources.

### Rule: Use hyphens (-) for readability; avoid underscores (`_`)
Hyphens are the web's standard word separator. 
* **Reason:** Hyperlinks are often underlined in documentation and UIs. This underline can hide an underscore (making `my_resource` look like `my resource`), leading to input errors.

### Rule: Prefer lowercase letters in URI paths
While the scheme and host are case-insensitive, **RFC 3986** defines the path component as case-sensitive. To prevent 404 errors caused by simple typos, lowercase is the mandatory industry default.

### Rule: Do not include file extensions
Artificial extensions (e.g., `.json`, `.xml`) should be avoided. Use **Content Negotiation** via the `Accept` and `Content-Type` HTTP headers.
* **Anti-pattern:** `GET /transcripts/2026/fall.json`
* **Standard:** `GET /transcripts/2026/fall` (with Header `Accept: application/json`)

---

## 3. URI Authority & Versioning Design

### Rule: Consistent subdomain names for APIs
Identify the service owner in the TLD and use a dedicated `api` subdomain to isolate traffic and apply specific security (CORS) policies.
* **Example:** `https://api.soccer.restapi.org`

### Rule: Consistent subdomain names for developer portals
By convention, developer-facing documentation and onboarding should live on a `developer` or `docs` subdomain.
* **Example:** `https://developer.soccer.restapi.org`

### Rule: API Versioning (Modern Expansion)
API versioning is critical for backward compatibility. The most common standard is **path-based versioning**, placed as the first segment.
* **Standard:** `https://api.example.com/v1/users`

---

## 4. Resource Modeling

The URI path conveys the API's resource model. Each segment separated by a slash corresponds to an addressable resource in the hierarchy.

If the URI is `http://api.soccer.restapi.org/leagues/seattle/teams/trebuchet`, the design implies:
* `/leagues/seattle/teams` (The collection of teams)
* `/leagues/seattle` (The specific league)
* `/leagues` (The root collection)
* `/` (The API root/docroot)

---

## 5. Resource Archetypes

A REST API should align each resource with exactly one of these four archetypes to maintain a consistent interface.



### Document
A singular concept, akin to a database record or object instance. It can contain fields and links to related resources.
* **Naming:** Singular noun.
* **Example:** `/users/morgan`

### Collection
A server-managed directory of resources. The server decides the URI of new items added to it (usually via `POST`).
* **Naming:** Plural noun.
* **Example:** `/users`

### Store
A client-managed resource repository. The client decides the URI when putting resources in (usually via `PUT`).
* **Naming:** Plural noun.
* **Example:** `/users/morgan/favorites/soccer` (Client decides 'soccer' is the ID).

### Controller
Models a procedural concept or "action." Like a function, it has inputs and outputs.
* **Naming:** Verb or verb phrase.
* **Example:** `POST /alerts/245743/resend`

---

## 6. URI Path Design

### Rule: Naming Conventions
* **Documents:** Singular noun (`/players/claudio`).
* **Collections/Stores:** Plural noun (`/players`).
* **Controllers:** Verb (`/register`, `/reindex`).

### Rule: Variable segments should use identity-based values
Static segments are chosen by the designer; variable segments represent unique IDs.
* **2026 Security Note:** Avoid sequential integer IDs (`/users/1`). Use **UUIDs** or **ULIDs** (Sortable Unique IDs) to prevent **IDOR** (Insecure Direct Object Reference) and data harvesting.

### Rule: Do not use CRUD names in URIs
HTTP methods already describe the action. Using them in the URI is redundant and non-RESTful.
* **Bad:** `POST /deleteUser?id=1` or `GET /users/1/delete`
* **Good:** `DELETE /users/1`

---

## 7. URI Query Design

Queries identify variations or derivatives of a resource (filtering, sorting, and searching).

### Rule: Filter collections or stores with query parameters
* **Example:** `GET /cars?color=red&status=available`

### Rule: Paginate results using query parameters
While `pageSize` and `pageStartIndex` are classic, modern high-scale APIs prefer **Limit/Offset** or **Cursor-based pagination**.
* **Limit/Offset:** `?limit=20&offset=100`
* **Cursor-based (2026 Industry Standard):** `?after=Y29udGVudA&limit=20`. Cursors are opaque strings that point to the last record seen, ensuring stability even if data is added during pagination.

### Rule: Use query for sorting and field selection
* **Sorting:** `GET /users?sort=-created_at` (The `-` prefix often denotes descending order).
* **Sparse Fieldsets:** `GET /users/1?fields=name,email`.

---

## 8. Privacy and Security (New Expansion)

### Rule: Never put PII in URIs
Personally Identifiable Information (PII) like emails or phone numbers should be avoided in URIs, as URIs are often logged in plaintext across proxies and server logs. Use a non-identifying `user_id`.

### Rule: No sensitive data in query strings
Query parameters are visible in browser history and server logs. Never pass API keys, passwords, or tokens in the query string. Use the **Authorization header**.
