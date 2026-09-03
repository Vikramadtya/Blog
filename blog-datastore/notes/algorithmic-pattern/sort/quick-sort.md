# Quick Sort

* based on the idea of divide-and-conquer
* is cache-friendly due to its in-place sorting property and reduced memory accesses.

<figure><img src="/notes-assets/image%20(5).png" alt="" /><figcaption></figcaption></figure>

#### Intuition of quick sort

* partition an unsorted array around some input value (pivot) into two parts such that values in the left part are less than the pivot and values in the right part are greater than the pivot.
* the pivot will get placed in the correct position in the sorted output after the partition

<figure><img src="/notes-assets/image%20(4).png" alt="" /><figcaption></figcaption></figure>

* if we sort both halves recursively, using the same function, the entire array will get sorted
  * repeat the same process for smaller subarrays until we reach the base case.

## Implementation

### **Divide Part**

* Divide the problem into two smaller subproblems by partitioning the array $$X[l...r]$$.&#x20;
* The partition process will return the **pivotIndex i.e.** the index of the pivot after the partition.
  * **Subproblem 1:** Sort array X\[] from **l** to **pivotIndex - 1**.
  * **Subproblem 2:** Sort array X\[] from **pivotIndex + 1** to **r.**
* Define the $$partition(X, l, r)$$ function to divide the array around the pivot and return the $$pivotIndex$$.

#### Partition algorithm

* Choose the rightmost value as the pivot, i.e., $$pivot = X[r]$$, and scan the array from left to right.&#x20;
* The starting part of the array should contain values less than the pivot.&#x20;
  * Whenever an element is less than the pivot, we will place it at the starting part of the array and move forward.&#x20;
  * Otherwise, ignore that element and move forward.

```java
int partition (int X[], int l, int r)
{
    int pivot = X[r]  
    int i = l - 1
    for (int j = l; j &lt; r; j = j + 1)
    {
        if (X[j] < pivot)
        {
            i = i + 1
            swap (X[i], X[j])
        }
    }
    swap (X[i + 1], X[r])
    return i + 1
}
```

### **Conquer Part**&#x20;

* Sort both subarrays recursively.
  * recursively sort the left subarray by calling the same function i.e., $$quickSort(X, l, pivotIndex - 1)$$
  * recursively sort the right subarray by calling the same function i.e., $$quickSort(X, pivotIndex + 1, r)$$

**Base case**

* The base case occurs when the sub-array size is either 0 (empty) or 1.&#x20;
  * In other words, **l &gt;= r** is the condition for the base case.



```java
void quickSort(int X[], int l, int r)
{
    if (l < r)
    {
        int pivotIndex = partition(X, l, r)
        quickSort(X, l, pivotIndex - 1)
        quickSort(X, pivotIndex + 1, r)
    }
}
```

### **Combine Part**

* A trivial case after sorting both smaller arrays, the entire array will be sorted.&#x20;
  * There is no need for the combine part.\




## References

*   [Quick Sort Algorithm](https://www.enjoyalgorithms.com/blog/quick-sort-algorithm)

    \
