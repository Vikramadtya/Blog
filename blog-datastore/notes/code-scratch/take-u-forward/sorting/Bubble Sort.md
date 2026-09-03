---
tags: #cc #sorting
---

# Bubble Sort

## Question

Given an array of integers called `nums`, sort the array in non-decreasing order using the **Bubble Sort** algorithm and return the sorted array.

## Solution

### Pattern

Adjacent Comparison and Swapping

### How to Identify

- The problem explicitly asks for Bubble Sort.
- You need a **stable** sort (maintains the relative order of equal elements).
- You want an algorithm that can **exit early** if the array becomes sorted before all passes are complete.

### Description

Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements, and swapping them if they are in the wrong order. This process is repeated until no more swaps are needed. In each complete pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.

### The Intuition

Think of air bubbles rising in water. The larger, "heavier" numbers sink to the bottom (the end of the array) while the smaller numbers float to the top (the beginning). In every round of comparisons, the largest value currently in the unsorted portion is pushed all the way to the right.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | O(n^2)          | O(n^2)          |
| Space Complexity | O(1)            | O(1)            |

!!! note ""
    The Best Case Time Complexity is O(n) when the array is already sorted, thanks to the swap flag optimization.

### Code

```java
class Solution {
    public int[] bubbleSort(int[] nums) {
        // Perimeter Defense: Handle null or empty arrays
        if (nums == null || nums.length &lt;= 1) {
            return nums;
        }

        // Outer loop: limits the range of the unsorted portion
        for (int j = nums.length - 1; j &gt; 0; --j) {
            // Optimization: If no two elements were swapped in the inner loop,
            // then the array is already sorted.
            boolean swapped = false;

            for (int i = 0; i &lt; j; ++i) {
                // Compare adjacent elements
                if (nums[i] &gt; nums[i + 1]) {
                    swapped = true;
                    // Swap elements
                    int temp = nums[i + 1];
                    nums[i + 1] = nums[i];
                    nums[i] = temp;
                }
            }

            // Break early if the array is already sorted
            if (!swapped) break;
        }

        return nums;
    }
}
```

### Concepts to Think About

1. The "Turtle" Problem: In Bubble Sort, large elements at the beginning (rabbits) move to the end very quickly. However, small elements at the end (turtles) only move one spot per pass. How does this "turtle" behavior affect the performance on an array that is sorted except for one small number at the very end?
2. Stability: Bubble Sort is stable because it only swaps if nums[i] > nums[i+1]. If they are equal, it does nothing. How would changing the condition to nums[i] >= nums[i+1] destroy the stability of the algorithm?
3. Best Case: With the boolean swapped flag, Bubble Sort becomes O(n) for a sorted array. This makes it an effective "sorted-check" utility.