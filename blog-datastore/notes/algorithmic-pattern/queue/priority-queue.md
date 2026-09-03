# Priority Queue

Each item has a priority, and the dequeue method removes the item that has the highest priority. Basically, high-priority items are handled first.\
\


When we implemented a priority queue with an array or a linked list, the efficiency of some operations is $$\text{O}(n)$$

<table><thead><tr><th></th><th>insert</th><th width="146">deleteMin</th><th>remove</th><th>findMin</th></tr></thead><tbody><tr><td> ordered array </td><td> O(n) </td><td> O(1) </td><td> O(n) </td><td> O(1) </td></tr><tr><td> ordered list </td><td> O(n) </td><td> O(1) </td><td> O(1)</td><td> O(1) </td></tr><tr><td> unordered array </td><td> O(1) </td><td> O(n) </td><td> O(1)</td><td> O(n) </td></tr><tr><td> unordered list </td><td> O(1) </td><td> O(n) </td><td> O(1)</td><td> O(n) </td></tr></tbody></table>



Using a binary heap, the runtime of both the deleteMin and insert operations is $$\text{O}(\log n)$$\
&#x20;

|              | insert     | deleteMin  | remove     | findMin |
| ------------ | ---------- | ---------- | ---------- | ------- |
|  binary heap |  O(log n)  |  O(log n)  |  O(log n)  |  O(1)   |

