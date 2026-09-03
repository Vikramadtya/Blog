# Binary Heap

A complete binary tree can be uniquely represented by storing its level order traversal in an array.



We skip the index zero cell of the array for the convenience of implementation so the the root is the second item in the array.&#x20;

<figure><img src="/notes-assets/image.png" alt="" /><figcaption></figcaption></figure>

Consider $$k^{\text{th}}$$ element of the array, the

* its left child is located at $$2*k$$ index&#x20;
* its right child is located at $$2*k+1$$  index&#x20;
* its parent is located at $$\frac{k}{2}$$ index

## Insert

The new element is appended to the end of the heap (as the last element of the array).&#x20;

* The heap property is repaired by comparing the added element with its parent and moving the added element up a level (swapping positions with the parent).&#x20;
* The comparison is repeated until the parent is larger than or equal to the percolating element.

```java
public void insert(Comparable x)
{
	if(size == heap.length - 1) doubleSize();

	//Insert a new item to the end of the array
	int pos = ++size;

	//Percolate up
	for(; pos > 1 && x.compareTo(heap[pos/2]) < 0; pos = pos/2 )
		heap[pos] = heap[pos/2];

	heap[pos] = x;
}
```

The worst-case runtime of the algorithm is $$\text{O}(\log{n})$$, since we need at most one swap on each level of a heap on the path from the inserted node to the root.\


## DeleteMin/Max

The minimum element can be found at the root, which is the first element of the array.&#x20;

We remove the root and replace it with the last element of the heap and then restore the heap property by _percolating down_.&#x20;

The worst-case runtime is O&#123;log n).\


## Reference&#x20;

* [Binary Heaps](https://www.andrew.cmu.edu/course/15-121/lectures/Binary%20Heaps/heaps.html)
* [Binary Heap Implementation](https://runestone.academy/ns/books/published/pythonds/Trees/BinaryHeapImplementation.html)
