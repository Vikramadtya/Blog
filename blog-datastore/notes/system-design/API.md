# API
An API (Application Programming Interface) defines how software components interact. A web API exposes operations and data over a network, commonly using HTTP.

REST is an architectural style, not simply “JSON over HTTP.” A well-designed HTTP API can use REST-like resource modeling without implementing every REST constraint.

## API design choices and tradeoffs

### Resource naming
Prefer consistent plural nouns


```
/users
/users/123
/users/123/orders
```

### Pagination

#### Offset pagination

```
GET /orders?offset=100&limit=50
```

- Simple.
- Can become slow at large offsets.
- Results can shift when rows are inserted or deleted.

#### Cursor pagination

```
GET /orders?cursor=eyJ...&limit=50
```

- Better for large or changing datasets.
- Requires stable ordering and cursor design.
- Often preferred for high-scale APIs.

### Versioning
Common approaches:
- URI version: /v1/users
- Header-based versioning.
- Additive, backward-compatible schema evolution.

Prefer additive changes when possible. Removing fields, changing field meaning, or tightening validation can break existing clients even if the endpoint path remains unchanged.

## Validation and error design
A consistent API error format makes clients easier to implement and troubleshoot.

```
{
  "type": "https://api.example.com/problems/validation",
  "title": "Validation failed",
  "status": 400,
  "detail": "The request contains invalid fields.",
  "errors": [
    {"field": "email", "code": "invalid_format"}
  ]
}
```