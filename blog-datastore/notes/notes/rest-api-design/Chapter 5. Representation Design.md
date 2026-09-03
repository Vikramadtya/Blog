# Representation Design: Resource State and Hypermedia

![image](/notes-assets/c5-summary.jpg)


In a RESTful architecture, the response body conveys the **representation** of a resource's state. This representation should be decoupled from the internal database schema, focusing instead on a contract that is meaningful to the client.

---

## 1. Format and Structure

### Rule: JSON is the primary standard for resource representation

Unless a specific binary standard exists (e.g., `image/webp`, `application/pdf`), JSON is the default language for REST APIs. 

* **Modern Context:** While JSON is the default, high-performance internal microservices in 2026 often support **Protocol Buffers (Protobuf)** or **MessagePack** for efficiency, using Content Negotiation to toggle between them.
* **Media Types:** Distinguish between the format (`JSON`) and the media type (`application/json`). Custom media types (e.g., `application/vnd.example.user+json`) are preferred to describe specific schemas.



### Rule: JSON must be well-formed and follow naming conventions

* **Naming:** Use `camelCase` for names (e.g., `birthDate`). This is the industry standard for JSON, aligning with JavaScript/TypeScript.
* **Strictness:** Always use double quotes for keys and string values. Avoid special characters in keys to maintain compatibility across different programming languages.
* **Dates:** Use **ISO 8601** strings (e.g., `"1985-11-11T00:00:00Z"`) for all timestamps to ensure timezone clarity and machine-readability.

```json
{
    "firstName": "Osvaldo",
    "lastName": "Alonso",
    "number": 6,
    "isActive": true,
    "birthDate": "1985-11-11T00:00:00Z"
}
```

### Rule: Support Content Negotiation for Alternative Formats

APIs may optionally support XML, YAML, or Protobuf. Clients should use the Accept header to request their preferred representation.


### Rule: Additional envelopes must not be created
A REST API must leverage the HTTP message as the "envelope." Do not wrap the resource state in transport-oriented wrappers like data, status, or message.

- Anti-pattern: `{"status": 200, "data": {"id": 1}}`
- Standard: `{"id": 1}` (The status code 200 is already in the HTTP header).
- Benefit: This allows infrastructure (proxies, CDNs) to cache and interpret the response correctly.

## 2. Hypermedia and Navigation (HATEOAS)

Hypermedia as the Engine of Application State (HATEOAS) allows a client to navigate the API dynamically through links & discover available actions and related resources dynamically.

### Rule: Use a consistent form to represent links
A link should provide the client with the URI and the relationship context.

```json
{
    "href": "[https://api.soccer.example.org/v1/players/2113](https://api.soccer.example.org/v1/players/2113)",
    "rel": "self",
    "type": "GET",
    "title": "Player Details"
}
```

- `href`: The target URI. Can be a URI Template (RFC 6570) for parameterized lookups.
- `rel` (Relation): Describes the relationship (e.g., next, previous, self). Use the IANA Link Relation Registry whenever possible.
- `type`/ `method`: (Expansion) It is now common to include the HTTP method allowed for that link to help the client understand available actions.

### Rule: A consistent form should be used to advertise links
Links should be grouped in a predictable structure, typically named `_links` or `links`, located at the top or bottom of the resource representation.

```json
{
  "firstName": "Osvaldo",
  "lastName": "Alonso",
  "_links": {
    "self": { "href": "/players/2113" },
    "team": { "href": "/teams/seattle" },
    "stats": { "href": "/players/2113/stats" }
  }
}
```

## 3. Schemas and Contracts

### Rule: Separate schema resources should be exposed

A REST API should provide separate, cacheable schema resources (such as JSON Schema or OpenAPI fragments). These define the data types, required fields, and constraints, acting as the formal contract between the client and the server.

## 4. Error Representation

### Rule: Use the "Problem Details" standard (RFC 7807)
The modern 2026 standard for error handling is RFC 7807. Instead of custom "error containers," use the standardized fields to ensure compatibility with generic clients.

```
{
    "type": "[https://api.example.org/probs/out-of-stock](https://api.example.org/probs/out-of-stock)",
    "title": "Item is out of stock.",
    "status": 400,
    "detail": "The requested jersey size is currently unavailable.",
    "instance": "/orders/987/items/2",
    "balance": 0
}
```

- type: A URI that identifies the problem type (provides documentation).
- title: Short, human-readable summary.
- status: The HTTP status code (redundancy check).
- detail: Human-readable explanation specific to this occurrence.
- instance: URI identifying the specific occurrence of the problem.

!!! note
    The balance field above is an example of an Extension Member, which allows developers to add custom, machine-readable data relevant to the specific error.

