---
layout:
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# Topological Sort

Topological sort is a technique used in graph theory to order the vertices of a [**directed acyclic graph** (**DAG**)](https://app.gitbook.com/o/iaM0TCjo55Di1aoNZCrS/s/MQ6PIO0HHybjoa5n1vsw/\~/changes/3/graph/directed-acyclic-graph). &#x20;

<figure><img src="/notes-assets/image%20(2)%20(1).png" alt="" width="375" /><figcaption></figcaption></figure>

* It ensures that for every directed edge from vertex A to vertex B, vertex A comes before vertex B in the ordering.
* It orders the vertices on a line such that all directed edges go from left to right. &lt;mark style="background-color:yellow;"&gt;Such an ordering cannot exist if the graph is not a&lt;/mark&gt; &lt;mark style="background-color:yellow;"&gt;&lt;/mark&gt;_&lt;mark style="background-color:yellow;"&gt;**DAG**&lt;/mark&gt;_ &lt;mark style="background-color:yellow;"&gt;&lt;/mark&gt;&lt;mark style="background-color:yellow;"&gt;and contains one or more directed cycle(s), because there is no way we can keep going on the right on a line and still return to a vertex already visited (we are talking about&lt;/mark&gt; &lt;mark style="background-color:yellow;"&gt;&lt;/mark&gt;&lt;mark style="background-color:yellow;"&gt;**Back Edges**&lt;/mark&gt; &lt;mark style="background-color:yellow;"&gt;&lt;/mark&gt;&lt;mark style="background-color:yellow;"&gt;here).&lt;/mark&gt;

\


!!! danger
    &lt;mark style="color:orange;"&gt;The topological sort is not necessarily unique.&lt;/mark&gt;



* An acyclic graph always has a topological sort

#### Usecases

* This is useful in scheduling problems, where tasks depend on the completion of other tasks.
* Topological sort can sequence tasks while respecting all sequence constraints without any conflict.



## Topological Sort using DFS

* [DFS](https://app.gitbook.com/o/iaM0TCjo55Di1aoNZCrS/s/MQ6PIO0HHybjoa5n1vsw/\~/changes/3/graph/depth-first-search) is a highly efficient way to compute topological sort of a graph in linear time  $$\text{O}(E + V)$$



!!! info
    Sink vertices are the only candidates for the final/last vertex position in the topological ordering.



*   We will search for the _**sink vertices**_, and as we get a sink vertex we will disconnect that vertex from the graph and will then backtrack and search for the next sink vertex along the search path, until all the vertices in the graph are visited.&#x20;


* This way we will get all the vertices in totally reverse order of that of what a topological ordering should be. So we would need to reverse the order to get the topological sort.



!!! info
    In DFS we print the nodes as we see them, which means when we print a node, it has just been discovered but not yet processed, which means it is in the _**Visiting**_ state.&#x20;
    
    * So DFS gives the order in which the nodes enter the _**Visiting**_ state and not the _**Visited**_ state.
    * For topological sorting we need to have the order in which the nodes are completely processed, i.e, the order in which the nodes are marked as _**Visited**_. Because when a node is marked _**Visited**_ then all of its child node have already been processed&#x20;

*   At any point during the DFS traversal of a graph we can divide the nodes in 3 groups

    1. Nodes that we finished visiting, i.e. popped from the stack.
    2. Nodes that are currently on the stack.
    3. Nodes that are yet to be discovered.



    If we are on node $$A$$  that has an outgoing edge to another node $$B$$. If the graph is a DAG we can be certain that $$B$$  falls in categories 1 or 3. If $$B$$ would be on the stack, than the arc $$A → B$$would close a cycle, and this is impossible on a DAG.



    This property actually tells us that any node is popped from the stack _after_ all of its outgoing neighbours are popped. So in order to get a topological sorting we should just keep track of a list with the popped nodes in reverse order.



#### **Complexity Analysis**

* **Time Complexity:** $$\text{O}(V+E)$$\
  The outer for loop will be executed V number of times and the inner for loop will be executed E number of times.
* **Auxiliary Space:**  $$\text{O}(V)$$ \
  The queue needs to store all the vertices of the graph. So the space required is $$\text{O}(V)$$



## **Topological Sort by BFS**

* The BFS version for topological sort is known as **Kahn's Algorithm**.

!!! info
    &#x20;The **indegree** of a node represents the number of arcs coming into a node. The **outdegree** represents the number of arcs going from a node.

*   The first node in a topological sorting should have the indegree equal to 0.&#x20;

    If the first node would have an arc coming into it, that particular arc would contradict the sorting property.



#### Algorithm

1.  Find the **in-degree** of each node by initially calculating the number of incoming edges to each node.&#x20;

    Iterate through all the edges in the graph and **increment** the **in-degree** of the **destination** **node** for each edge.&#x20;
2. Add all nodes with in-degree **0** to a queue.
3. While the queue is not empty:
   1. Remove a node from the queue.
   2. For each outgoing edge from the removed node, decrement the in-degree of the destination node by **1**.
   3. If the in-degree of a destination node becomes **0**, add it to the queue.
4. If the queue is empty and there are still nodes in the graph, the graph contains a cycle and cannot be topologically sorted.



!!! info
    We can also use Kahn's algorithm to extract the lexicographically minimum topological sort by breaking ties lexographically. One can simply replace the `queue` with a `priority_queue` to implement this extension.



#### **Complexity Analysis**

* **Time Complexity:** $$\text{O}(V+E)$$\
  The outer for loop will be executed V number of times and the inner for loop will be executed E number of times.
* **Auxiliary Space:**  $$\text{O}(V)$$ \
  The queue needs to store all the vertices of the graph. So the space required is $$\text{O}(V)$$



## Reference&#x20;

* [GeekForGeeks Kahn's algorithm for Topological Sorting](https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/)
* [Topological Sort : DFS, BFS and DAG](https://efficientcodeblog.wordpress.com/2017/11/28/topological-sort-dfs-bfs-and-dag/)
* [Topological Sorting](https://csacademy.com/lesson/topological\_sorting) with graph visualisation
* [Topological sort explaination from USCAO](https://usaco.guide/gold/toposort?lang=cpp)
*   [Directed graphs chapter from "Competitive Programmer’s Handbook"](https://usaco.guide/CPH.pdf#page=159)









