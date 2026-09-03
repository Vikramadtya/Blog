# Flatten A Linked List

## Intuition

Each node in the linked list has:

* A `next` pointer to another node (head of another sorted list).
* A `child` pointer to a **sorted** linked list.

Since every list is already sorted, we can leverage a **min-heap (priority queue)** to always pick the node with the smallest value among all available nodes and build a final **flattened sorted list**.

## Complexity

| Space Complexity | Time Complexity         |
| ---------------- | ----------------------- |
| $$\text{O}(1)$$  | $$\text{O}(N*\log{N})$$ |

## Code

```java
public static Node flattenLinkedList(Node mainHead) {
    // Dummy node to build the result list
    Node dummyNode = new Node(-1);
    Node flattenedTail = dummyNode;

    // Min-heap to get the smallest node at each step
    PriorityQueue&lt;Node&gt; minHeap = new PriorityQueue&lt;Node&gt;((a, b) -> Integer.compare(a.data, b.data));

    // Push all head nodes (connected via next) into the heap
    while (mainHead != null) {
        Node nextHead = mainHead.next;
        mainHead.next = null; // disconnect to avoid interference
        minHeap.add(mainHead);
        mainHead = nextHead;
    }

    // Process nodes in heap
    while (!minHeap.isEmpty()) {
        // Extract the node with the smallest value
        Node currentMinNode = minHeap.remove();
        Node childNode = currentMinNode.child;
        currentMinNode.child = null;

        // If the node has a child, add it to the heap
        if (childNode != null) {
            minHeap.add(childNode);
        }

        // Add current node to the flattened list
        flattenedTail.child = currentMinNode;
        flattenedTail = currentMinNode;
    }

    // Return the flattened list starting after dummy node
    return dummyNode.child;
}

```
