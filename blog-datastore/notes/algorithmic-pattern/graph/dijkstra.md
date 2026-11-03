
# Dijkstra

![Dijkstra’s Algorithm_ Visual Guide](../../../images/Dijkstra-s-Algorithm_-Visual-Guide.png)


Dijkstra's Algorithm is used to find the shortest path in a weighted graph when all edge weights are non-negative.

> Works on directed and undirected graphs.

Look for these clues:
- Minimum distance, cost, time, or effort to reach a destination.
- A graph or grid where edges have different weights.
- Need to find the shortest path from one source to other nodes.
- Edge weights are non-negative


!!! tip "Tip"
    If you need to minimize the total cost of a path in a weighted graph with non-negative edge weights, think Dijkstra.



Dijkstra uses two main concepts:
- Greedy:
  - Always process the currently closest unprocessed node.
  - Because edge weights are non-negative, once the closest node is selected with its current best distance, no future route can make that distance smaller.
- Relaxation
  - Update a neighbor if going through the current node gives a cheaper path.


> Dijkstra is not always about adding distances. The priority queue can prioritize different path costs when the problem has a suitable greedy property.



## Algorithm using a min-

At every step, Dijkstra needs to select the node with the smallest tentative distance. 

```java
function Dijkstra(Graph, source): 
    create distance[] and set all to infinity 
    distance[source] = 0 
    create a priority queue Q 
 
    while Q is not empty: 
        u = vertex in Q with smallest distance 
        remove u from Q 
 
        for each neighbor v of u: 
            alt = distance[u] + weight(u, v) 
            if alt < distance[v]: 
                distance[v] = alt 
                update v in Q with new distance 
 
    return distance[] 
```

A min-heap allows us to retrieve that node efficiently.

Operations:
- Push a node: $\text{O}(\log{V})$
- Pop the minimum: $\text{O}(\log{V})$

