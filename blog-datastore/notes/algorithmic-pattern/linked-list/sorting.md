# Sorting

## Sorting with Insertion Sort <a href="#head-3-35" id="head-3-35"></a>

Basic idea behind `insertionsort` is to take an item from the input list and insert it into the proper position in a sorted output list (which initially starts empty).



The algorithm&#x20;

* &#x20;starts by building an empty list to hold the sorted output.&#x20;
* Then loops through the unsorted list of input nodes.&#x20;
* For each input nodes, looks through the growing sorted list and finds the node after which the new value belongs.&#x20;
* It then inserts the node there.



Since we end up comparing with all in worst case the time complexity is $$O(n^2)$$

## Sorting with Selection Sort

Basic idea behind the selectionsort algorithm is to search the input list for the largest item it contains and then add it to the front of a growing sorted list.



For  an input list contains $$n$$ items, finding the largest item in the list takes $$n$$ steps but adding the largest item to the sorted list takes only a few steps.&#x20;

The input lenght also shrinks but still the time complexity is $$O(n^2)$$

\
\
