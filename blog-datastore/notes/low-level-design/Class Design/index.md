# Advanced Class Design & Robust Architecture


![image](../../assets/images/Low%20Level%20Design/Class%20Design/summary.jpg)

## 1. Fundamental Principles of Class Design
Class design principles are not rigid rules but heuristic guidelines aimed at maximizing readability, maintainability, and reusability.

### I. Naming and Intent
* **Descriptive Naming:** Classes should be named using **nouns** that represent their responsibility (e.g., `UserAuthenticator` instead of `UserHelper`). 
* **The "Single Responsibility" Rule:** A class should represent a single conceptual entity. If you struggle to name a class without using "And," it likely needs to be split.

### II. State and Complexity Management
* **High Cohesion / Low Variable Count:** Keep the number of member variables low. If a class has too many variables, it is likely doing too much. Aim for high cohesion—where all methods in the class utilize most of the variables.
* **Minimize Cyclomatic Complexity:** Use few control structures (`if`, `switch`, `while`). 
    * *Modern Standard:* Prefer **Polymorphism** or the **Strategy Pattern** over deeply nested `if-else` or `switch` blocks to handle behavioral variations.
* **Immutability by Default:** In modern (2026) development, favor immutable state. Use `readonly` or `final` fields where possible. This makes the class thread-safe and easier to reason about.



---

## 2. Preparing for Change (The Open/Closed Principle)
Software is "soft" because it must change. However, change introduces risk. Great design focuses on **Extension** rather than **Modification**.

### I. The Risk of Fragility
* **System Breakage:** Modifying existing, "battle-tested" code carries the risk of side effects that can break seemingly unrelated parts of the system.
* **Testing Burden:** Changing a class's internal logic often requires a total rewrite of its unit tests. If you find yourself frequently changing tests for existing features, your classes are likely too "tightly coupled."

### II. Strategies for Extensibility
* **Open/Closed Principle (OCP):** Software entities should be **open for extension but closed for modification**. Use interfaces or abstract classes to allow new functionality to be added via new subclasses rather than changing the base code.
* **Composition over Inheritance:** Avoid deep inheritance trees. Use composition (holding instances of other classes) to build complex behavior. This makes the system more flexible and "pluggable."
* **Dependency Injection (DI):** Do not hard-code dependencies inside a class. Pass them in (inject them) via the constructor. This allows you to change behavior (or swap in "mocks" for testing) without touching the class's internal logic.
