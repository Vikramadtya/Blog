---
tags:
  - cc
  - two-pointers
  - in-place-algorithms
---

# Merge Sorted Array (In-Place)

## Question

Given two sorted integer arrays $nums1$ and $nums2$, merge $nums2$ into $nums1$ as one sorted array. 

- $nums1$ has a length of $m + n$.
- The first $m$ elements are the actual sorted data.
- $nums2$ has a length of $n$.
- The merge must happen **in-place** within $nums1$.

## Solution

### Pattern

**Backwards Two-Pointer**
Instead of starting from the beginning and shifting elements, we compare elements from the ends of the sorted portions and fill the target array from the largest to the smallest.



### How to Identify

- Input arrays are already sorted.
- Requirement for **In-Place** modification.
- One array has trailing "empty" space (usually represented as 0s) to accommodate the other.

### Description

Step-by-step explanation:

- Initialize three pointers: 
    1.  `p1` at index $m-1$ (end of actual data in `nums1`).
    2.  `p2` at index $n-1$ (end of `nums2`).
    3.  `pMerged` at index $m+n-1$ (the very end of the $nums1$ array).
- Compare $nums1[p1]$ and $nums2[p2]$.
- Place the larger of the two at $nums1[pMerged]$ and decrement the respective pointers.
- Continue until $p2 &lt; 0$.
- **Crucial Choice:** We do not need a cleanup loop for $p1$. If $p2$ finishes first, the remaining elements in $nums1$ are already sorted and in their final positions.



### The Intuition

Think of this as **Reverse Competitive Filling**. If you started from the front, you would have to "push" existing elements in $nums1$ out of the way to make room for $nums2$, which is expensive ($O(m \cdot n)$). By starting from the back, where we know there is "useless" empty space, we fill the largest values first. It’s like filling a shelf from right to left because the left side is already occupied by books you don't want to drop.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(m + n)$     | $O(m + n)$       |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
We iterate through both arrays exactly once. In the worst case (all elements of $nums2$ are smaller than $nums1$), we perform $m+n$ operations.

#### Space Complexity
The modification is done in-place, using only three integer pointers regardless of the input size.

### Code

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Pointer for the end of the sorted data in nums1
        int p1 = m - 1;
        // Pointer for the end of nums2
        int p2 = n - 1;
        // Pointer for the end of the total nums1 capacity
        int pMerged = m + n - 1;

        // While there are elements to process in nums2
        while (p2 &gt;= 0) {
            // If nums1 still has elements and its current element is larger
            if (p1 >= 0 && nums1[p1] > nums2[p2]) {
                nums1[pMerged--] = nums1[p1--];
            } else {
                // Otherwise, nums2's element is larger or p1 is exhausted
                nums1[pMerged--] = nums2[p2--];
            }
        }
        // No need to copy nums1's remaining elements; they are already in place.
    }
}
```

## Caveats

- **Empty nums1:** If $m=0$, the logic correctly falls into the `else` block and copies all of $nums2$.
- **Empty nums2:** If $n=0$, the `while (p2 >= 0)` loop never executes, and $nums1$ remains unchanged (correct).
- **Overwriting:** This approach *only* works because the extra space is at the **end** of the array. If it were at the beginning, we would merge from front to back.

## Concepts to Think About

- **Stability:** Is this merge stable? (Yes, if we use `>=` correctly, though usually not a requirement for primitives).
- **Memory Management:** In-place algorithms are vital in embedded systems or high-frequency trading where memory allocation is a bottleneck.
- **Two-Pointer Variations:** This is a "Three-Pointer" variation, but the logic follows the standard Two-Pointer merge pattern found in Merge Sort.
- **Sentinel Values:** Could we use sentinels? Theoretically, but it's less efficient than pointer bounds checks.

## Logical Follow-up

Question: What if `nums1` did NOT have extra space at the end?
Solution: We would be forced to use $O(m)$ extra space to store a copy of $nums1$ or use the **Gap Method** (based on Shell Sort) to achieve $O(1)$ space with $O((n+m) \log(n+m))$ time.

Question: What if the arrays were too large to fit in memory?
Solution: We would use **External Merge Sort**, reading chunks of each array, merging them, and writing them to a new external storage file.
