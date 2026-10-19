# Web Architecture and RESTful Principles

## Core Technologies of the Web
* The Uniform Resource Identifier (URI), a syntax that assigns each web document a unique address.
    * 💡 **Clarification:** A URI can be further classified as a URL (Uniform Resource Locator), which provides the location of the resource, or a URN (Uniform Resource Name), which names the resource in a persistent way regardless of its location.
* The HyperText Transfer Protocol (HTTP), a message-based language that computers could use to communicate over the Internet.
    * ➕ **Added:** HTTP is a stateless protocol, meaning each request from a client to a server must contain all the information necessary to understand and complete the request. It primarily utilizes methods such as GET, POST, PUT, DELETE, and PATCH to perform operations.
* The HyperText Mark-up Language (HTML), to represent informative documents that contain links to related documents.
    * ➕ **Added:** While HTML defines the structure and semantic meaning of web content, it is often paired with CSS (Cascading Style Sheets) for presentation and JavaScript for interactive functionality.

---

## Client–Server Architecture
The Web is a client-server based system, in which clients and servers have distinct parts to play. They may be implemented and deployed independently, using any language or technology, so long as they conform to the Web’s uniform interface.

* 💡 **Clarification:** This separation of concerns allows the user interface (client) to evolve independently from the data storage and business logic (server), improving portability and scalability across different platforms.

---

## The Uniform Interface
The interactions between the Web’s components depend on the uniformity of their interfaces.

* ➕ **Added:** According to Roy Fielding's REST (Representational State Transfer) architectural style, the uniform interface is defined by four constraints:
    1.  **Identification of resources:** Individual resources are identified in requests (usually via URIs).
    2.  **Manipulation of resources through representations:** When a client holds a representation of a resource, it has enough information to modify or delete the resource on the server.
    3.  **Self-descriptive messages:** Each message includes enough information to describe how to process the message (e.g., Media Types/MIME types).
    4.  **Hypermedia as the Engine of Application State (HATEOAS):** Clients examine the representations returned by the server to discover what further actions are possible.

---

## Resources and Representations
Each distinct Web-based concept is known as a resource and may be addressed by a unique identifier, such as a URI. 
Clients manipulate representations of resources. The representation is a way to interact with the resource but it is not the resource itself.

* 💡 **Clarification:** A "resource" is any entity that can be named (an image, a user profile, a collection of data). A "representation" is the specific format used to transfer the state of that resource, such as JSON, XML, or HTML.

A resource’s desired state can be represented within a client’s request message. A resource’s current state may be represented within the response message that comes back from a server.

---

## History and Standardization
Fielding worked alongside Tim Berners-Lee and others to increase the Web’s scalability. To standardize their designs, they wrote a specification for the new version of the Hypertext Transfer Protocol, HTTP/1.1.

* ➕ **Added:** Roy Fielding's doctoral dissertation in 2000 formally defined the REST architectural style, which served as the guiding framework for the development of HTTP/1.1 and the modern web's scalability.
* ⚠️ **Correction:** While HTTP/1.1 was the primary focus for a long time, the modern web has since moved toward HTTP/2 and HTTP/3 to further improve performance through features like multiplexing and header compression.

---

## Application Programming Interfaces (APIs)
, an API exposes a set of data and functions to facilitate interactions between computer programs and allow them to exchange information.

* 💡 **Clarification:** In the context of the web, this usually refers to a Web API (or Web Service), which uses the HTTP protocol to allow different software applications—often written in different languages—to communicate seamlessly.
