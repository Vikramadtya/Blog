# HTTP

HTTP (Hypertext Transfer Protocol) is an application layer protocol in the Internet protocol suite. 

HTTP is a request–response protocol in the client–server model. A transaction starts with a client submitting a request to the server, the server attempts to satisfy the request and returns a response to the client that describes the disposition of the request and optionally contains a requested resource such as an HTML document or other content.

HTTP is designed to permit intermediate network elements to improve or enable communications between clients and servers.

To allow intermediate HTTP nodes (proxy servers, web caches, etc.) to accomplish their functions, some of the HTTP headers (found in HTTP requests/responses) are managed hop-by-hop whereas other HTTP headers are managed end-to-end (managed only by the source client and by the target web server).

A web resource is located by a uniform resource locator (URL), using the Uniform Resource Identifier (URI) schemes http and https. URIs are encoded as hyperlinks in HTML documents, so as to form interlinked hypertext documents.

!!! note ""
    HTTP is a stateless application-level protocol and it requires a reliable network transport connection to exchange data between client and server.

## Version
The protocol has been revised over time. A version is identified as HTTP/# where # is the version number.

- In HTTP/1.0, a separate TCP connection to the same server is made for every resource request.
- In HTTP/1.1, instead a TCP connection can be reused to make multiple resource requests.
- HTTP/2 adds support for:
  - a compressed binary representation of metadata (HTTP headers) instead of a textual one, so that headers require much less space.
  - a single TCP/IP (usually encrypted) connection per accessed server domain instead of 2 to 8 TCP/IP connections.
  - one or more bidirectional streams per TCP/IP connection in which HTTP requests and responses are broken down and transmitted in small packets to almost solve the problem of the HOLB.
  - a push capability to allow server application to send data to clients whenever new data is available (without forcing clients to request periodically new data to server by using polling methods).
- HTTP/3 uses the application transport protocol QUIC + UDP transport protocols instead of TCP.

!!! npte ""
    HTTP/3 uses a different transport layer called QUIC, which provides reliability on top of the unreliable User Datagram Protocol (UDP).


## Request and response messages through connections

Data is exchanged through a sequence of request–response messages which are exchanged by a session layer transport connection Closing a connection is usually advertised by one or more HTTP headers in the last request or response.

In HTTP/1.1, a keep-alive-mechanism was officially introduced so that a connection could be reused for more than one request/response. Such persistent connections reduce request latency perceptibly because the client does not need to re-negotiate the TCP 3-Way-Handshake connection after the first request has been sent.

HTTP/2 extended the usage of persistent connections by multiplexing many concurrent requests/responses through a single TCP/IP connection.

## Application session

As a stateless protocol, HTTP does not require the web server to retain information or status about each user for the duration of multiple requests.

## Message format
At the highest level, a message consists of a header followed by a body.

A body is optional it consists of data in any format; not limited to ASCII. The format must match that specified by the Content-Type header field if the message contains one. A body is optional or, in other words, can be blank.

A header field represents metadata about the containing message. A header field line is formatted as a name-value pair with a colon separator. Whitespace is not allowed around the name, but leading and trailing whitespace is ignored for the value part. Unlike a method name that must match exactly (case-sensitive),[28] a header field name is matched ignoring case 


A request is sent by a client to a server. The start line includes a method name, a request URI and the protocol version with a single space between each field.

```text
GET /customer/123 HTTP/1.1
```

Request header fields allow the client to pass additional information beyond the request line, acting as request modifiers.

## Method

A request identifies a method (sometimes informally called verb) to classify the desired action to be performed on a resource.

!!! note ""
    Method names are case sensitive

### `GET`

The request is for a representation of a resource. The server should only retrieve data; not modify state. For retrieving without making changes, GET is preferred over POST  as it can be addressed through a URL. This enables bookmarking and sharing and makes GET responses eligible for caching, which can save bandwidth.

### `HEAD`

The request is like a GET except that the response should not include the representation data in the body. This is useful for retrieving the representation metadata in the response header, without having to transfer the entire representation. Uses include checking whether a page is available via the status code and getting the size of a file via header field Content-Length.

### `POST`

The request is to process a resource in some way.

### `PUT`

The request is to create or update a resource with the state in the request. A distinction from POST is that the client specifies the target location on the server.

### `DELETE`

The request is to delete a resource.

### `TRACE`

Requests the server to respond with the received request in the response body. That way a client can see what (if any) changes or additions have been made by intermediaries. Useful for debugging.

### `PATCH`

The request is to modify a resource according to its partial state in the request. Compared to PUT, this can save bandwidth by sending only part of a resource's representation instead of all of it.

## Response

A response is sent to the client by the server. The start line of a response consists of the protocol version, a status code and optionally a reason phrase with fields separated by a single space character.

```text
HTTP/1.1 400 Bad Request
```

### Status code

The status code is a three-digit, decimal, integer value that represents the disposition of the server's attempt to satisfy the client's request.

A client may not understand each status code that a server reports but it must understand the class as indicated by the first digit and treat an unrecognized code as equivalent to the x00 code of that class. The classes are as follows:

1XX informational - The request was received, continuing process.
2XX successful - The request was successfully received, understood, and accepted.
3XX redirection - Further action needs to be taken in order to complete the request.
4XX client error - The request cannot be fulfilled due to an issue that the client might be able to control.
5XX server error - The server failed to fulfill an apparently valid request.

### Reason phrase

The standard reason phrases are only recommendations. A web server is allowed to use a localized equivalent.

## Reference

- [HTTP](https://en.wikipedia.org/wiki/HTTP) 