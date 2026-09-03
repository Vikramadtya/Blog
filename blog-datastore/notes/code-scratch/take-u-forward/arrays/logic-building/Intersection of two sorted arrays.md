---
tags:
  - cc
  - array
  - two-pointers
---

# Intersection of Two Sorted Arrays (with Duplicates)

## Question
Given two sorted arrays `nums1` and `nums2`, return their intersection. Each element in the result must appear as many times as it appears in both arrays ($\min(x, y)$ frequency). The result must be in ascending order.

## Solution

### Pattern
**Two-Pointer: Synchronized Linear Scan**

#### How to Identify
* The inputs are **sorted**.
* You need to find common elements (Intersection).
* Frequency/Count of elements matters.
* Constraints require $O(n + m)$ time.

### Description
Since both arrays are sorted, we can use two pointers starting at index $0$. 
1. If $nums1[i] &lt; nums2[j]$, the value at $i$ is too small to be in the intersection; increment $i$.
2. If $nums1[i] &gt; nums2[j]$, the value at $j$ is too small; increment $j$.
3. If $nums1[i] == nums2[j]$, we found a common element. Add it to the result and increment **both** pointers.



### The Intuition
Imagine two people with sorted lists of ID numbers. Person A reads their first number; Person B reads theirs. If Person A's number is smaller, they move to their next number because Person B's list can't possibly contain that smaller number later on (since it's sorted). They only write a number down when they are both looking at the exact same value.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | $O(n + m)$      | $O(n + m)$      |
| Space Complexity | $O(\min(n, m))$ | $O(\min(n, m))$ |

*Note: The space complexity is $O(\min(n, m))$ for the output array, as the intersection cannot exceed the size of the smaller input.*

### Code

```java
class Solution {
    public int[] intersectionArray(int[] nums1, int[] nums2) {
        // Perimeter Defense
        if (nums1 == null || nums2 == null || nums1.length == 0 || nums2.length == 0) {
            return new int[0];
        }

        int n = nums1.length;
        int m = nums2.length;
        int i = 0, j = 0, k = 0;
        
        // Result size cannot exceed the smaller array
        int[] temp = new int[Math.min(n, m)];

        while (i &lt; n && j < m) {
            if (nums1[i] < nums2[j]) {
                i++;
            } else if (nums1[i] &gt; nums2[j]) {
                j++;
            } else {
                // Match found
                temp[k++] = nums1[i];
                i++;
                j++;
            }
        }

        // Trim the array to the actual number of matches found
        return Arrays.copyOf(temp, k);
    }
}
```

## Concepts to Think About

- The "Unsorted" Variation: If the arrays were NOT sorted, the best approach would be using a HashMap to store the frequency of elements in one array, then decrementing as you find matches in the second. How does the space complexity change then? (O(n) space for the map).
- Binary Search Optimization: If one array is much larger than the other (e.g., n=10 and m=1,000,000), it is actually faster to iterate through the small array and use Binary Search to find each element in the large array. The complexity becomes O(nlogm).
- Memory Constraints: What if nums2 is so large that it is stored on a disk and cannot fit in memory? (Hint: You can read nums2 in chunks, as the two-pointer approach only needs the "current" element).
- Intersection I vs II: This problem is "Intersection II" (allowing duplicates). "Intersection I" usually asks for unique elements only. How would you change the logic to only return unique values? (Hint: Add an additional check if (k == 0 || temp[k-1] != nums1[i])).
- Hardware/Parallelism: If you had multiple processors, could you split the sorted arrays into segments and find intersections in parallel? (Look up "Parallel Merge").
