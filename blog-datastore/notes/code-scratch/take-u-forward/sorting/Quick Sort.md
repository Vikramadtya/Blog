---
tags: #cc #sorting #divide_and_conquer
---

# Quick Sort

## Question

Given an array of integers `nums`, sort the array in non-decreasing order using the **Quick Sort** algorithm and return the sorted array.

## Solution

### Pattern

Divide and Conquer (Partitioning)

### How to Identify

- The problem specifically requests Quick Sort.
- You need an **in-place** sorting algorithm with excellent average-case performance.
- Cache efficiency is important (Quick Sort is generally faster than Merge Sort in practice due to better locality of reference).
- Stability is not required (Quick Sort is inherently **unstable**).

### Description

Quick Sort is a recursive algorithm that picks an element as a **pivot** and partitions the array around it. After partitioning, all elements smaller than the pivot are on its left, and all elements larger are on its right. The algorithm then recursively applies the same logic to the left and right subarrays.

### The Intuition

Imagine you are at a party and want to sort everyone by height. You pick one random person (the pivot). You tell everyone shorter than that person to move to the left side of the room and everyone taller to move to the right. Now, that person is standing in their exact correct spot. You then tell the two groups to repeat the process until everyone is sorted.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | O(n^2)          | O(n log n)      |
| Space Complexity | O(log n)        | O(log n)        |

!!! note ""
    While Quick Sort is "in-place" (no extra arrays), it requires O(log n) space on average for the recursive call stack. Random pivot selection prevents the O(n^2) worst-case on already sorted data.*

### Code

```java
import java.util.Random;

class Solution {
    private final Random rand = new Random();

    public int[] quickSort(int[] nums) {
        if (nums == null || nums.length &lt;= 1) return nums;
        sort(nums, 0, nums.length - 1);
        return nums;
    }

    private void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    private void sort(int[] arr, int start, int end) {
        // Base case: 0 or 1 element is already sorted
        if (start &gt;= end) return;

        // Optimization: Pick a random pivot to avoid O(n^2) on sorted/reversed data
        int randomIndex = start + rand.nextInt(end - start + 1);
        swap(arr, randomIndex, start);
        
        int pivot = arr[start];
        
        // Hoare Partition Scheme
        int i = start - 1;
        int j = end + 1;

        while (true) {
            // Find leftmost element >= pivot
            do {
                i++;
            } while (arr[i] &lt; pivot);

            // Find rightmost element &lt;= pivot
            do {
                j--;
            } while (arr[j] &gt; pivot);

            // If pointers cross, the partition is complete
            if (i &gt;= j) break;

            swap(arr, i, j);
        }

        // Recursively sort the two partitions
        sort(arr, start, j);
        sort(arr, j + 1, end);
    }
}
```

### Concepts to Think About

1.  **Pivot Selection Strategies:** Your solution uses a **Random Pivot**. Other methods include picking the **first element**, the **last element**, or the **Median-of-Three** (median of first, middle, and last). How does each choice affect the likelihood of hitting the O(n²) worst-case?
2.  **Lomuto vs. Hoare Partitioning:** You used **Hoare Partitioning**, which uses two pointers moving towards each other. **Lomuto Partitioning** uses one pointer to "scout" and another to "swap" smaller elements to the front. Hoare is generally more efficient because it performs fewer swaps on average.
3.  **Quick Select:** Quick Sort's partitioning logic can be used to find the **k-th smallest/largest element** in an array in **O(n) average time**. This is called **Quick Select**. Why don't we need to recurse into both halves for Quick Select?
4.  **Tail Recursion:** In your code, you make two recursive calls. If the array is very deep, this could cause a `StackOverflowError`. How could you modify the code to use **Tail Call Optimization** and only recurse into the smaller subarray to limit the stack depth to O(log n)?
5.  **Dual-Pivot Quick Sort:** Java's `Arrays.sort()` for primitives actually uses **Dual-Pivot Quick Sort** (specifically the Yaroslavskiy algorithm). It picks two pivots and divides the array into three parts. Why might three-way partitioning be faster than two-way partitioning?
6.  **Quick Sort vs Merge Sort:**
    * **Merge Sort** is Stable and guaranteed O(n log n), but uses O(n) space.
    * **Quick Sort** is Unstable and can hit O(n^2), but uses O(log n) space.
    * Why is Quick Sort often faster for **Arrays**, while Merge Sort is faster for **Linked Lists**? (Hint: Cache Locality and Random Access).
7. Since Quick Sort's performance is heavily dependent on the pivot, how would you handle an array that contains a high number of duplicate elements?
