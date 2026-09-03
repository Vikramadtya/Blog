# Stack

A _stack_ is a data structure where items are added and removed in last-in-first-out order ( sometimes called _LIFO lists_ or _LIFOs_ )

Adding an object to a stack is called pushing the object onto the stack, and removing an object from the stack is called popping the object off of the stack.

<figure><img src="/notes-assets/stack.png" alt="" /><figcaption></figcaption></figure>

## Linked-List Stacks <a href="#head-3-55" id="head-3-55"></a>

Implementing a stack is easy using a linked list, with a linked list, pushing and popping items both have $$\text{O}(1)$$ run times.

* the `Push` method simply adds a new cell to the top of the list
* the `Pop` method removes the top cell from the list.



## Array Stacks

Allocate space for an array enough to hold the data expected to put in the stack. Then use a variable to keep track of the next empty position in the stack.\
\
\


<figure><img src="/notes-assets/c05f003.jpg" alt="" /><figcaption></figcaption></figure>

With an array-based stack, `Push` and `Pop` have $$\text{O}(1)$$ run times.&#x20;



!!! info
    Setting and getting a value from an array generally is faster than creating a new cell in a linked list, so this method may be slightly faster than using a linked list.



An array-based stack requires extra space to hold new items, resizing the array will take extra time. If the array holds N items when you need to resize it, it will take $$\text{O}(n)$$ steps to copy those items into the newly resized array.



## Double Stacks <a href="#head-3-57" id="head-3-57"></a>

In case an algorithm needs to use two stacks whose combined size is bounded by some amount. Then can store both stacks in a single array, with one at each end and both growing toward the middle,

<figure><img src="/notes-assets/c05f004.jpg" alt="" /><figcaption></figcaption></figure>

