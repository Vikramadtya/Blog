# Composition, Asociation & Aggregation


| Property | Association | Aggregation | Composition |
| :--- | :--- | :--- | :--- |
| **Meaning** | Objects are related | Whole groups independent parts | Whole strongly owns parts |
| **Ownership** | Not implied | Weak / shared or independent | Strong |
| **Part can exist independently?** | Usually yes; no lifecycle claim | Yes | Conceptually tied to the whole |
| **Part can be shared?** | Yes, if allowed | Commonly yes | Generally no simultaneous ownership by multiple wholes |
| **UML notation** | Plain line or arrow | Hollow diamond | Filled diamond |

## Association
Two objects have a relationship, but neither necessarily owns the other. It says that one object knows about, refers to, or interacts with another object.


```mermaid
classDiagram
    Ticket "*" --> "1" Vehicle : identifies vehicle
```

## Aggregation

It is a more specific kind of association. It represents a whole-part relationship, but the parts can exist independently of the whole. One object groups or references other objects, but those objects can exist independently and may be shared. 


```mermaid
classDiagram
    ParkingLot o--> PaymentGateway : uses shared gateway
```

Use it when:
- The whole groups parts.
- The parts have an independent lifecycle.
- The parts may be shared or reassigned.
- The distinction from ordinary association adds useful meaning.

> UML aggregation has relatively weak, often ambiguous semantics. Many designs use an ordinary association instead.

## Composition 
Composition is a relationship where one object is made up of, or owns, other objects that help form it. So instead of making one giant class do everything, ==we build a larger object using smaller objects, each with its own responsibility==.

```mermaid
classDiagram
    ParkingLot "1" *-- "1..*" ParkingFloor : owns
    ParkingFloor "1" *-- "0..*" ParkingSpot : owns
```


> The filled diamond `*--` indicates composition

composition does not mean an object must be deleted whenever its parent is deleted in every implementation. It communicates strong ownership in the domain model. Actual deletion and persistence behavior depend on the requirements

### Composition vs Inheritance
**Composition** means “has-a” or “is made of”, whereas **Inheritance** means “is-a”


```mermaid

classDiagram
    Vehicle <|-- Car : is-a
    Vehicle <|-- Motorcycle : is-a
    ParkingLot *-- ParkingFloor : has
    ParkingFloor *-- ParkingSpot : has
```

Prefer composition over inheritance when combining functionality. Use inheritance when a genuine subtype relationship exists and the subtype can safely stand in for its parent



## How to choose ?

```mermaid
flowchart TD
    Start([Start]) --> Q1{Do the objects need a relationship?}
    
    Q1 -- No --> EndNo[Don't add a relationship]
    Q1 -- Yes --> Q2{Is it genuinely a whole-part relationship?}
    
    Q2 -- No --> ResAssoc[Ordinary Association]
    Q2 -- Yes --> Q3{Are the parts independently owned and managed?}
    
    Q3 -- Yes --> ResAggr[Aggregation or Association <i>Choose aggregation only if grouping adds value</i>]
    Q3 -- No --> Q4{Does the whole strongly own the parts?}
    
    Q4 -- Yes --> ResComp[Composition <i>Parts aren't shared among multiple wholes</i>]
    Q4 -- No --> ResFallback[Aggregation or Association]
```
