---
description: Heap data structure
---

# Heap

A heap is a tree-like structure, each value has a relationship with its parent and child nodes.

* In a max heap, every parent value is greater than or equal to its children.&#x20;
* In a min heap, each parent value is less than or equal to its children.

<figure><img src="/notes-assets/image%20(1).png" alt="" /><figcaption></figcaption></figure>

Heap is a complete binary tree, it’s filled from the left side, and there are no “holes” except, on the last level.



In a heap the highest (or lowest) priority element is always stored at the root, hence the name "heap".

A heap is not a sorted structure and can be regarded as partially ordered. There is no particular relationship among nodes on any given level, even among the siblings.

Since a heap is a complete binary tree, it has a smallest possible height - a heap with N nodes always has $$\text{O}(\log{N})$$ height.



!!! info
    A heap is useful data structure when to remove the object with the highest (or lowest) priority and a common use of a heap is to implement a priority queue.

\


\
