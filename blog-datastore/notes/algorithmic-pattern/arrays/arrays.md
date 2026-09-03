---
tags:
  - Algorithm
  - Arrays
---

# Arrays

An array is a chunk of contiguous memory that a program can access by using indices—one index per dimension in the array.



!!! info
    Behind the scenes, the program allocates enough contiguous memory to hold the array's data.
    
    * For one-dimensional arrays, the mapping from array indices to memory entries is simple: index i maps to entry i.&#x20;
    * For two-dimensional arrays, the program can map the array entries in one of two ways:&#x20;
      * In row-major order, the program maps the first row of array entries to the first set of memory locations. It then maps the second row to the set of memory locations after the first and so on..&#x20;
      * In column-major order, the program maps the first column of array entries to the first set of memory locations. It then maps the second column to the second set of memory locations, and so forth.
    
    Normally, how a program maps array entries to memory locations is irrelevant to how a program works,



## One-Dimensional Arrays <a href="#head-2-75" id="head-2-75"></a>



<figure><img src="/notes-assets/Arrays_in_ds-what-is-array-img1.PNG" alt="" /><figcaption></figcaption></figure>



### Finding Items

If the items in the array are not sorted, finding an item is a matter of performing a _linear search_ or _exhaustive search_.&#x20;

The linear search run-time algorithm's run time $$\text{O}(n)$$



Finding every item would take a total of&#x20;

$$
1+2+3 ... +n = \frac{n(n+1)}{2}
$$

&#x20;steps. Divide this by the number of searches, $$n$$ , to get the average number of steps to find an item in the array $$\frac{(n+1)}{2}$$ which means that the average run time for finding an item in the array is $$\text{O}(n)$$





#### Finding Minimum, Maximum, and Average

We cannot avoid looking at every item in the array to find these values,  so they have run time $$\text{O}(n)$$

#### Finding Median

In case of an unsorted array either&#x20;

1.  sort the array and find the middle element&#x20;

    Time complexity $$\text{O}(n\log{n})$$
2.  use the quick select to find the mid - element&#x20;

    Time complexity $$\text{O}(n)$$

#### Find mode

In case of unsorted array

1.  sort the array and iterate to find the longest contiguous sequence&#x20;

    Time complexity $$\text{O}(n\log{n})$$, Time complexity $$\text{O}(1)$$&#x20;
2.  store the count of occurrence using count array or hash table&#x20;

    Time complexity $$\text{O}(n)$$ , Space complexity $$\text{O}(n)$$&#x20;

#### Inserting Items <a href="#head-3-47" id="head-3-47"></a>

Inserting an item at the end of a linear array is easy (time complexity $$\text{O}(1)$$) if the array has enough space and doesn't need extending.

For inserting anywhere

1. Find the position to insert the array
2. Move the items to create space&#x20;

#### Deleting Items <a href="#head-3-47" id="head-3-47"></a>

Removing the item with index `k` from an array means moving the items that come after position `k` one position closer to the beginning of the array.&#x20;

!!! info
    In some cases, it may be possible to flag an entry as unused instead of actually removing it.&#x20;
    
    This technique can be particularly useful in hash tables, where resizing the array and rebuilding the hash table would be time-consuming.
    
    If flagging many entries as unused, the array could eventually fill up with unused entries. Then, to find an item, would need to examine a lot of empty positions.&#x20;
    
    At some point, may want to compress the array to remove the empty entries.

## Nonzero Lower Bounds <a href="#head-2-76" id="head-2-76"></a>

Programming languages require that all arrays use 0 for a lower bound in every dimension. But sometimes it's convenient to treat an array's dimension as if it had nonzero lower bounds.



## Higher dimensional array in to a sigle dimension <a href="#head-2-77" id="head-2-77"></a>

Can pack an $$N$$-dimensional into a one-dimensional array in row-major order.

If there are $$N$$rows and $$M$$ columns,  allocate an array with $$N*M$$ entries.



For an item in a given row and columns to find its index

$$
index = row 
× &lt;row size&gt; + column
$$

* because there are `&lt;row size&gt;` items in each row, that means those rows account for `r × &lt;row size&gt;` items before this one.
* if the item's column number is $$c$$, then there are $$c$$ items before this item in its row numbered $$0,1,2,3 ...c$$ Those items take up $$c$$ positions in the values array.

## Triangular Arrays <a href="#head-2-77" id="head-2-77"></a>

&#x20;In a _triangular array_, the values on one side of the diagonal have some default value, such as 0, `null`, or blank.&#x20;

<figure><img src="/notes-assets/image%20(10).png" alt="" /><figcaption></figcaption></figure>

* In an _upper-triangular array_, the real values lie on or above the diagonal.
* In a _lower-triangular array_, the nondefault values lie on or below the diagonal.&#x20;



!!! info
    Some applications can save space by using triangular arrays instead of normal rectangular arrays.
    
    
    
    For example, a _connectivity matrix_ represents the connections between points in some sort of network.
    
    > The array's entry `connected[i, j]` is set to true if there is a flight from airport `i` to airport `j`. If you assume that there is a flight from airport `j` to airport `i` whenever there is a flight from airport `i` to airport `j`, then `connected[i, j] = connected[j, i]`. In that case, there's no need to store both `connected[i, j]` and `connected[j, i]` because they are the same.
    
    it's probably not worth making a $$100*100$$ triangular array because you would save only $$4,960$$ entries, which still isn't all that much memory, and working with the array would be harder than using a normal array. However, a $$10000*10000$$ triangular array would save about $$50$$million entries, which begins to add up to real memory savings, so it may be worth making it into a triangular array.

To build a triangular array simply pack the array's values into a one-dimensional array, skipping the entries that should not be included.&#x20;

To build a triangular array with $$N$$ rows, allocate a one-dimensional array containing $$\frac{N+N^2}{2}$$ items.

To find the index for an entry with row $$r$$ and column $$c$$

$$
\frac{(r-1)^2+(r-1)}{2}+c
$$

## Sparse Arrays <a href="#head-2-78" id="head-2-78"></a>

A _sparse array_ lets you save even more space than a triangular array by not representing the missing entries.&#x20;



One way to implement a sparse array is to make a linked list of linked lists.&#x20;

* The first list holds information about rows.&#x20;
* Each item in that list points to another linked list holding information about the array's columns for that row.

<figure><img src="/notes-assets/image%20(11).png" alt="" /><figcaption></figcaption></figure>

* To make it easier to determine when a value is missing from the array, the `ArrayRow` objects are stored in increasing order of `RowNumber`.
*   &#x20;the `ArrayEntry` objects are stored in increasing order of `ColumnNumber`.

    \


