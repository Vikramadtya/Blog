---
tags: #cc #sorting
---

# Selection Sort

## Question

Given an integer array `nums`, sort the array in non-decreasing order using the **Selection Sort** algorithm and return the sorted array.

## Solution

### Pattern

Two-Pointer Partitioning (Unsorted vs. Sorted)

### How to Identify

- The problem explicitly mentions "Selection Sort."
- The constraints or requirements prioritize **minimizing the number of swaps** (Selection Sort performs a maximum of O(n) swaps).
- The task involves sorting an array in-place without the need for stability.

### Description

Selection Sort works by logically dividing the array into two parts: a **sorted partition** and an **unsorted partition**. In each iteration, the algorithm "selects" the largest (or smallest) element from the unsorted section and swaps it with the element at the boundary, effectively growing the sorted section by one.

### The Intuition

Imagine you are organizing a line of people by height. You scan the entire line to find the tallest person and move them to the very end. Then, you ignore that person and scan the remaining group to find the next tallest, moving them to the spot just before the last. You repeat this until everyone is in their correct place.

### Complexity

| Label            | Worst  | Average |
| :--------------- | :----- | :------ |
| Time Complexity  | O(n^2) | O(n^2)  |
| Space Complexity | O(1)   | O(1)    |

### Code

```java
class Solution {
    public int[] selectionSort(int[] nums) {
        // Perimeter Defense
        if (nums == null || nums.length &lt;= 1) {
            return nums;
        }

        // The outer loop defines the end boundary of the unsorted part
        // We move from the last index down to the first
        for (int i = nums.length - 1; i &gt; 0; --i) {
            int largestIndex = i;

            // Inner loop: Find the largest element in the range [0...i]
            for (int j = i - 1; j >= 0; --j) {
                if (nums[j] > nums[largestIndex]) {
                    largestIndex = j;
                }
            }

            // Swap the found maximum with the element at the boundary i
            // Optimization: Only swap if the largest is not already at index i
            if (largestIndex != i) {
                int temp = nums[i];
                nums[i] = nums[largestIndex];
                nums[largestIndex] = temp;
            }
        }

        return nums;
    }
}
```

### Concepts to Think About

1. Stability: Selection Sort is unstable. If you have two identical numbers, their relative order might change because of the long-distance swap. Can you trace an example (like [2, 2, 1]) to see why the first 2 ends up behind the second 2?
2. Write Efficiency: Selection Sort performs exactly O(n) swaps. This is the minimum possible number of swaps for any sorting algorithm. In what real-world scenario (perhaps involving physical hardware or flash memory) would you prefer an algorithm that minimizes "writing" even if it's slow at "reading"?
3. No Adaptability: Unlike Bubble or Insertion sort, Selection Sort has no "early exit." Even if the array is already 100% sorted, it will still perform every single comparison. Why is it mathematically impossible to add a "swapped" flag to Selection Sort?