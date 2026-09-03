# Hello World Wide Web
The Uniform Resource Identifier (URI), a syntax that assigns each web document a unique address
The HyperText Transfer Protocol (HTTP), a message-based language that computers could use to communicate over the Internet.
The HyperText Mark-up Language (HTML), to represent informative documents that contain links to related documents. 



### Client–Server
The Web is a client-server based system, in which clients and servers have distinct parts to play. They may be implemented and deployed independently, using any language or technology, so long as they conform to the Web’s uniform interface.


### Uniform Interface

The interactions between the Web’s components—meaning its clients, servers, and network-based intermediaries—depend on the uniformity of their interfaces.


#### Identification of resources

Each distinct Web-based concept is known as a resource and may be addressed by a unique identifier


#### Manipulation of resources through representations
Clients manipulate representations of resources. The same exact resource can be represented to different clients in different ways.  The key idea here is that the representation is a way to interact with the resource but it is not the resource itself. 

#### Self-descriptive messages
A resource’s current state may be represented within the response message that comes back from a server.

#### Hypermedia as the engine of application state (HATEOAS)
A resource’s state representation includes links to related resources.

### Layered System
The layered system constraints enable network-based intermediaries such as proxies and gateways to be transparently deployed between a client and server using the Web’s uniform interface. 



### Stateless
The stateless constraint dictates that a web server is not required to memorize the state of its client applications

## Web Standards
To standardize their designs, they wrote a specification for the new version of the Hypertext Transfer Protocol, HTTP/1.1. They also formalized the syntax of Uniform Resource Identifiers (URI) in RFC 3986.



## REST
The REST architectural style is commonly applied to the design of APIs for modern web services. A Web API conforming to the REST architectural style is a REST API. Having a REST API makes a web service “RESTful.” A REST API consists of an assembly of interlinked resources. This set of resources is known as the REST API’s resource model.

