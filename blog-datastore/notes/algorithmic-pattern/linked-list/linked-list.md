# Linked List

A linked list is built of objects that are often called nodes.&#x20;

<figure><img src="/notes-assets/image%20(7).png" alt="" /><figcaption></figcaption></figure>

The nodes class contains whatever data the list must store plus a link to another cell.&#x20;

```
class IntegerCell
{
    public int Value;
    public IntegerCell Next;
}
```

The link is simply a reference or pointer to another object of a cell's class.&#x20;

Linked lists are a good way to store a list of items that can grow or shrink over time. To add a new cell, just add it at the beginning or end of the linked list.

## Singly Linked Lists <a href="#head-2-63" id="head-2-63"></a>

In a _singly linked list_, each cell is connected to the following cell by a single link.&#x20;

### Iterating Over the List

This examines every cell in the linked list, it has run time  $$\text{O}(n)$$

```java
void iterateOverList(Node head) {
    while(!head == null) {
        System.out.println(head.value);
        head = head.next;
    }
}
```

### Finding Cells <a href="#head-3-23" id="head-3-23"></a>

Iterate over the list till we find the node, it has run time  $$\text{O}(n)$$

```java
Node findNode(Node head, int value) {
    while(!head == null) {
        if(head.value == value) return head;
        head = head.next;
    }
    return null;
}
```

### Using Sentinels

A _sentinel_ is a cell that is part of the linked list but that doesn't contain any meaningful data. It is used only as a placeholder so that algorithms can refer to a cell that comes before the first cell.



A sentinel may seem like a waste of space, but it removes the need for special-purpose code and makes the algorithm simpler and more elegant.

\




If we want to get the cell pointing to the target node

```java
// A dummy node before the first node
Node sentinel = new Node(-1,head);

Node findNodeBefore(Node sentinel, int value) {
    
    while(!head.next == null) {
        if(head.next.value == value) return head;
        head = head.next;
    }
    return null;
}
```

This version of the algorithm can return the sentinel cell before the first real cell if appropriate. Therefore, the program using the algorithm doesn't need customized code to handle the special case in which the target value is at the beginning of the list.



### Adding Cells at the Beginning <a href="#head-3-25" id="head-3-25"></a>

The easiest way to add an item to a linked list is to place a new cell at the beginning, right after the sentine

### Adding Cells at the End

First traverse the list to find the last cell and then add the node.

```
void addToEnd(Node sentinel, Node newNode) {
    while(sentinel.next != null) sentinel = sentinel.next;
    sentinel.next = newNode;
}
```

Without sentinel would have to use special code to handle the case when the list is empty so `sentinal` points to `null`.

### Inserting Cells After Other Cells

Find the cell after which we need to insert and add the node.

### Deleting Cells

Find the cell before the target cell and point it to the next of the next.

## Doubly Linked Lists <a href="#head-2-64" id="head-2-64"></a>

The node have links that point to both the `next` and `previous` cells in the list.



!!! info
    It is convenient to have both top and bottom sentinels for doubly linked lists so that the program can easily manipulate the list from either end.



## Sorted Linked List

Sometimes convenient to keep the items in a linked list in sorted order.&#x20;

When adding a new item to the list, search through the list to find the position where the item belongs and update the appropriate links to insert it there.



## Self-Organizing Linked Lists <a href="#head-2-66" id="head-2-66"></a>

A _self-organizing linked list_ is a list that uses some sort of heuristic to rearrange its items to improve expected access times.

!!! info
    A _heuristic_ is an algorithm that is likely but not guaranteed to produce a good result.



If numbering the items in the list ![images](/notes-assets/c03-i0012.png)$$1,2,3 .. n$$  and the probability to find item $$i$$ is $$P_i$$, then the expected number of steps to move down the list to find an item is given by the following formula

$$
\text{Expected Search Length} = 1.P_1 + 2.P_2 + 3.P_3 ...... + N.P_n
$$

If it is equally likely to find any given item, then all of the probabilities $$P_i$$ have the same value $$\frac{1}{N}$$ and the expected search length is&#x20;

$$
\text{Expected Search Length} = 1.\frac{1}{N} + 2.\frac{1}{N} + 3.\frac{1}{N} ...... + N.\frac{1}{N} = \frac{N+1}{2}
$$

This value depends only on the length of the list, so it doesn't matter how the items are arranged. Because the $$P_i$$ values are all the same, will need to search roughly halfway through the list on average to find any given item.



&lt;mark style="background-color:yellow;"&gt;If the&lt;/mark&gt; $$P_i$$ &lt;mark style="background-color:yellow;"&gt;values are different, then it makes sense to move the more popular items to the front of the list.&lt;/mark&gt;



### Move To Front (MTF) <a href="#head-3-29" id="head-3-29"></a>

The list moves the most recently accessed item to the front of the list.&#x20;

* Moving an item to the front of a link list only takes a few steps, so is fast and easy.&#x20;
* Frequently accessed items will tend to remain near the top of the list while those that are accessed less often will usually be near the bottom of the list.

drawback to this method is that an infrequently accessed item will occasionally jump to the front of the list and slow down subsequent searches until it is pushed back down the list.

### Swap <a href="#head-3-30" id="head-3-30"></a>

The _swap method_ or _transpose method_ swaps the most recently accessed item with the item before it so that frequently accessed items gradually move toward the front of the list.



It prevents an infrequently accessed item from jumping to the front of the list and slowing down later searches.

A drawback to this method is that items move slowly frequently accessed items can take a long time to move to the front of the list, so it can take a while before the items reach an effective arrangement.



### Count

In the _count method_,  keep track of the number of times each item is accessed.&#x20;

When searching for an item, increment its count and then move it up in the list until it lies before any items that have smaller counts.&#x20;

Eventually, the items move close to their optimal arrangement where they are sorted by their probabilities.



Drawback to this method are

* it requires extra storage to hold the item counts.&#x20;
* It also takes more work to move an item several positions through the list than it does simply to move it to the front of the list or to swap it with one neighboring item.

!!! info
    Use a doubly linked list to easily swap the found item toward the front of the list as far as necessary.

### Hybrid

!!! info
    * the MTF method makes large adjustments to the items' order relatively quickly, but later searches for less commonly accessed items can mess up the arrangement.&#x20;
    * Swapping produces a better arrangement but is slower.&#x20;
    * Counting produces a very good arrangement but requires extra storage.

Use a combination of techniques to produce a better overall result.

For example,&#x20;

* use an MTF strategy to move the most commonly accessed items quickly to the front part of the list then switch to a swapping strategy to adjust the list more slowly.
* initially use MTF while updating item counts, after performing enough searches to get useful statistics, sort the items by their counts and then switch to a counting strategy.

## Multithreaded Linked Lists <a href="#head-2-68" id="head-2-68"></a>

There's no reason why we can't add other links to a list's nodes to provide other ways to move through the nodes.

<figure><img src="/notes-assets/image%20(6).png" alt="" /><figcaption></figcaption></figure>

It's easy to work with a single thread, thinking of it as a simple linked list, as visualizing all of the threads at the same time can be messy.\
\


## Circular Linked List

A circular linked list is a linked list in which the last link points back to the first item in the list. They are useful when need to loop through a sequence of items indefinitely.
