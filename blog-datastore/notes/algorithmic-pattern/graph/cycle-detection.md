# Cycle detection

* Graphs without cycles are called acyclic, and those with cycles are called cyclic.



## Detect Cycles in a Directed Graph

* A sequence of vertices and directed edges in which the last vertex is connected back to the first vertex, forming a closed loop.

<figure><img src="/notes-assets/image%20(1)%20(1).png" alt="" /><figcaption></figcaption></figure>

* There is a cycle in a graph **only if there is a back edge**

### **Steps**

* Track the visited vertices and the vertices in current path.&#x20;
* Iterate over all the vertex, if vertex is already visited skip it.
* For selected verted explore as far as possible along each branch before backtracking.
* If we encounter a vertex that has already been visited then return.
  * Since this vertex is already visited it means the paths beginning from this vertex have been traverssed once and since we are still searching for a cycle the paths originating from this vertex don't have a cycle.
* If we encounter a vertex is part of the current path, we have found a cycle&#x20;

### Usecase

* Real world usecase are
  *   Deadlock detection in concurrent systems

      Detecting cycles in the resource allocation graph is a common technique to identify deadlocks in a system.
  *   Dependency management

      Detecting cycles in the dependency graph helps in identifying circular dependencies, which can cause issues during the build process.
  *   Infinite loop detection in computer programs

      detecting cycles in the control flow graph of a program can help in identifying infinite loops. \
      \






## References&#x20;

* [Cycle detection from book "Competitive Programmer’s Handbook"](https://usaco.guide/CPH.pdf#page=161)
* [Detect Cycles in a Directed Graph](https://www.altcademy.com/blog/detect-cycles-in-a-directed-graph/)



\
