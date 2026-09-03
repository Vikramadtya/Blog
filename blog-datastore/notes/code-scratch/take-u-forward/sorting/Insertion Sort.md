---
tags: #cc #sorting
---

# Insertion Sort

## Question

Given an array of integers called `nums`, sort the array in non-decreasing order using the **Insertion Sort** algorithm and return the sorted array.

## Solution

### Pattern

Incremental Sorting (Sorted Left Partition)

### How to Identify

- The problem explicitly asks for Insertion Sort.
- The data is **nearly sorted** (Insertion sort is highly efficient, approaching O(n) in this case).
- The dataset is **small** (Insertion sort has very low overhead compared to Merge or Quick Sort).
- You need an **online** algorithm (one that can sort a list as it receives it).

### Description

Insertion Sort works by building a sorted section at the beginning of the array. It picks one element at a time from the unsorted portion and "inserts" it into its correct relative position within the sorted portion by shifting all larger elements one position to the right.

### The Intuition

Think of sorting a hand of playing cards. You start with one card (already "sorted"). You pick up the next card and slide it into the correct spot relative to the cards already in your hand. You repeat this until every card is in its place.



### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | O(n^2)          | O(n^2)          |
| Space Complexity | O(1)            | O(1)            |

!!! note ""
    The Best Case Time Complexity is O(n) when the array is already sorted, as no shifting occurs.*

### Code

```java
class Solution {
    public int[] insertionSort(int[] nums) {
        // Perimeter Defense: Handle null or single-element arrays
        if (nums == null || nums.length &lt;= 1) {
            return nums;
        }

        // Start from the second element (index 1) 
        // as the first element is already "sorted" by itself
        for (int i = 1; i < nums.length; ++i) {
            int curr = nums[i];
            int j = i - 1;

            // Look back through the sorted partition [0...i-1]
            // Shift elements that are larger than 'curr' to the right
            while (j &gt;= 0) {
                if (nums[j] <= curr) {
                    break; // Found the correct spot
                }
                
                nums[j + 1] = nums[j]; // Shift right
                j--;
            }

            // Insert 'curr' into its correct position
            nums[j + 1] = curr;
        }

        return nums;
    }
}
```

### Concepts to Think About

1. **Nearly Sorted Data**: Insertion Sort is the king of nearly sorted data. If only a few elements are out of place, it runs in nearly O(n) time. This is why it is used as a "cleanup" step in more complex algorithms like Timsort or Quick Sort.
2. **Online Sorting**: Insertion Sort is an online algorithm. This means it can sort a list as it receives it (one element at a time). Imagine a stream of data coming from a sensor—why is Insertion Sort better for this than Selection Sort?
3. **Shifting vs. Swapping**: Notice that Insertion Sort doesn't "swap" (which takes 3 assignment operations); it "shifts" (which takes 1). Over thousands of operations, why does shifting make Insertion Sort significantly faster in practice than Bubble Sort, even though they have the same O(n^2) complexity?