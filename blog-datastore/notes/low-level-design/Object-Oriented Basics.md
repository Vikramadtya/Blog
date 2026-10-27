# The Four Pillars of OOP

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects," which can contain data (attributes/properties) and code (methods/functions). Instead of focusing on logic and functions, OOP focuses on the data objects that developers want to manipulate.


??? tip "Click to expand tip"
    - A **Class** is a blueprint, prototype, or template that defines the variables and the methods common to all objects of a certain kind. It exists only in the source code; it does not occupy memory at runtime until it is instantiated.
    - An **Object** is a self-contained unit of a system, an **instance** of a class. It represents a real-world entity (e.g., a specific "User" or a "Bank Account") and holds its own unique state.
  

To be considered truly object-oriented, a language or design must implement these four principles:

### I. Encapsulation (Data Hiding) : protect valid state
Encapsulation is the bundling of data and the methods that act on that data into a single unit (the class). It restricts direct access to some of an object's components, which is a vital way to prevent accidental state corruption.

* **Mechanism:** Achieved using **Access Modifiers**:
    * `Private`: Accessible only within the class.
    * `Protected`: Accessible within the class and its subclasses.
    * `Public`: Accessible from anywhere.
* **Benefit:** The internal "how-to" is hidden; users interact only through a public interface (Getters/Setters).

> Encapsulation asks: Who is allowed to change this state, and how do we keep it valid?

### II. Abstraction : expose what callers need

Abstraction is the process of hiding the complex implementation details and showing only the necessary features of an object. It reduces complexity by letting the programmer focus on *what* an object does instead of *how* it does it.

* **Mechanism:** Achieved through **Interfaces** and **Abstract Classes**.
* **Analogy:** You know that pressing the accelerator makes the car go faster, but you don't need to understand the internal combustion process to drive.

> Abstraction asks: What does a caller need to know, and what implementation details can remain hidden?

### III. Inheritance

Inheritance is a mechanism where a new class (Subclass/Derived) acquires the properties and behaviors of an existing class (Superclass/Base).

* **Relationship:** It models an **"Is-A"** relationship (e.g., a "Dog" *is a* "Mammal").
* **Benefit:** Promotes **Code Reusability**. 
* **Modern Note:** Favor **Composition over Inheritance** where possible to avoid rigid, deep hierarchies.

> Inheritance is appropriate when a subtype genuinely satisfies the contract of its parent.

### IV. Polymorphism

Polymorphism (meaning "many forms") allows objects of different classes to be treated as objects of a common superclass. 

* **Static (Compile-time) Polymorphism:** Method Overloading (same method name, different parameters).
* **Dynamic (Runtime) Polymorphism:** Method Overriding (a subclass provides a specific implementation of a method already defined in its parent).



## OOAD: Object-Oriented Analysis and Design

The process of building a system involves identifying objects and mapping their interactions:

1.  **Identify Objects:** Determine the entities within the system domain.
2.  **Define Relationships:** Determine how objects interact (Inheritance, Composition, etc.).
3.  **Establish Interfaces:** Define the public methods/contracts for each object.
4.  **Implementation:** Convert the design into executable code using an OO language (Java, C++, Python, C#, etc.).