---
tags:
  - cc
  - array
  - two-pointers
---

# Union of Two Sorted Arrays

## Question
Given two sorted arrays `nums1` and `nums2`, return an array containing the union of these two arrays. The result must be in ascending order and contain only distinct values.

## Solution

### Pattern
**Two-Pointer: Synchronized Linear Scan (Merge Technique)**

#### How to Identify
* Two or more **sorted** arrays/lists are provided.
* The task involves merging, finding the union, or finding the intersection.
* The output must maintain a specific order.

### Description
We use two pointers, $i$ and $j$, to traverse `nums1` and `nums2` respectively. At each step, we compare the elements at $i$ and $j$:
1. If $nums1[i] &lt; nums2[j]$, we consider $nums1[i]$.
2. If $nums1[i] &gt; nums2[j]$, we consider $nums2[j]$.
3. If $nums1[i] == nums2[j]$, we consider the value once and move **both** pointers.

Before adding an element to our result, we check if it is the first element ($k=0$) or if it is different from the last added element ($result[k-1]$) to maintain uniqueness.



### The Intuition
Imagine two lines of students, both sorted by height. You want to create a third line containing one representative for every unique height present in both lines. You look at the students at the front of both lines. You pick the shorter one and move them to the new line. If both students are the same height, you pick one and dismiss both from their original lines. If the next student you pick is the same height as the one you just added, you dismiss them to avoid duplicates.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | $\text{O}(n + m)$ | $\text{O}(n + m)$ |
| Space Complexity | $\text{O}(n + m)$ | $\text{O}(n + m)$ |

*Note: $n$ and $m$ are the lengths of the two input arrays. The space complexity is $\text{O}(n + m)$ for the output array.*

### Code

```java
class Solution {
    public int[] unionArray(int[] nums1, int[] nums2) {
        // Handle nulls
        if (nums1 == null) nums1 = new int[0];
        if (nums2 == null) nums2 = new int[0];

        int n = nums1.length, m = nums2.length;
        int[] result = new int[n + m];
        int i = 0, j = 0, k = 0;

        while (i < n || j < m) {
            int val;
            
            // Pick the smaller element or the remaining one
            if (i < n && (j == m || nums1[i] < nums2[j])) {
                val = nums1[i++];
            } else if (j < m && (i == n || nums2[j] < nums1[i])) {
                val = nums2[j++];
            } else {
                // Both are equal
                val = nums1[i];
                i++;
                j++;
            }

            // Add to result if unique
            if (k == 0 || val != result[k - 1]) {
                result[k++] = val;
            }
        }

        return Arrays.copyOf(result, k);
    }
}
```

## Concepts to Think About

- Intersection vs. Union: How would you modify this to find the Intersection (elements present in both)? (Hint: Only add to result when nums1[i] == nums2[j]).
- Unsorted Arrays: If the arrays were not sorted, would you sort them first (O(NlogN)) or use a HashSet (O(N) space)? In Google interviews, always discuss the space-time trade-off.
- Large vs. Small Arrays: If nums1 has 10 elements and nums2 has 1,000,000 elements, is a linear scan still the best? (Hint: You could perform a Binary Search for each element of the smaller array inside the larger one).
- Memory Constraints: If the result array is too large to fit in memory, how would you process this as a stream?
- Handling Duplicates within one array: Your current logic handles duplicates both between arrays and within a single array (e.g., nums1 = [1, 1, 2]). Why is checking result[k-1] better than checking nums1[i] == nums1[i-1]?