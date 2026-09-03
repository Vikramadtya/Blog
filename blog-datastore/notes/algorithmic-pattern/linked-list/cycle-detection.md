# Cycle Detection

For the following linked list&#x20;

<figure><img src="/notes-assets/image%20(8).png" alt="" /><figcaption></figcaption></figure>

1. How to tell whether a linked list contains such a loop ?
2. How to find where the loop starts and break it there to “fix” the list ?&#x20;

## Tortoise and Hare <a href="#head-3-41" id="head-3-41"></a>

It is called the _tortoise-and-hare algorithm_ or _Floyd's cycle-finding algorithm_ after Robert Floyd.

\
The algorithm starts two objects called `tortoise` and `hare` moving through the list at different speeds starting at the beginning of the list.&#x20;

* The tortoise moves one cell per step.&#x20;
* The hare moves two cells per step.

If the two meet at the same node, it indicates that there is a cycle present in the linked list.



#### How we can detect the first node of the cycle ?

The following pseudocode shows the algorithm at a high level:

1. Start the tortoise moving through the list at one cell per step.&#x20;
2. Start the hare moving through the list at two cells per step.
3. If the hare finds a `null` link, then the list has no loop, so stop.
4.  Otherwise, when the hare catches the tortoise,

    Restart the hare at the beginning of the list, moving one cell per step this time.&#x20;

    Continue moving the tortoise at one cell per step.
5. When the tortoise and hare meet again, they are at the start of the loop.&#x20;
6. Leave the hare at the loop's starting point to take a well-deserved rest while the tortoise takes one more lap around the loop.&#x20;
7. When the tortoise's `Next` pointer gives the cell where the hare is waiting, the tortoise is at the end of the loop.
8. To break the loop, set the tortoise's cell's `Next` pointer to `null`.\


## Marking Cells <a href="#head-3-37" id="head-3-37"></a>

Easiest way to tell whether a linked list has a loop is to traverse its cells, marking each as you visit it. If on a cell that is already marked, know that the list has a loop and that it starts at that point.\


```java
Node findLoopStart(Node head) {
    Node previous = null, current = head;
    while(current != null) {
        if(current.visited) {
          // can use previous to break the loop
          return current;
        }
        previous = current;
        current = current.next;
    }
    
    return null;
}
```

This algorithm also requires that each cell have an added Visited field.

## Using Hash Tables <a href="#head-3-38" id="head-3-38"></a>

Move through the list, adding each cell to a hash table.

* On visiting a node checks the hash table to see whether the node is already in the table.&#x20;
* If it comes to a node that is already in the hash table, the list contains a loop that starts at that node.

This algorithm obeys the restriction that we are not allowed to modify the `node` class, but it uses extra storage



## Loops in Doubly Linked Lists <a href="#head-3-42" id="head-3-42"></a>

If there is a loop, somewhere a `Next` pointer jumps back to an earlier part of the list

The `Prev` pointer in that cell points to an earlier cell, not the one that created the loop.

## References&#x20;

* [Floyd's Linked List Cycle Finding Algorithm\
  ](https://cp-algorithms.com/others/tortoise\_and\_hare.html)\
