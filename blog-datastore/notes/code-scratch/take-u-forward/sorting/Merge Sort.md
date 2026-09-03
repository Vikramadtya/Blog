---
tags: #cc #sorting #divide_and_conquer
---

# Merge Sort

## Question

Given an array of integers `nums`, sort the array in non-decreasing order using the **Merge Sort** algorithm and return the sorted array.

## Solution

### Pattern

Divide and Conquer

### How to Identify

- The problem specifically requests Merge Sort.
- You need a **stable** sort (it preserves the relative order of equal elements).
- You need a **guaranteed** Time Complexity of O(n log n) even in the worst case.
- The data is too large to fit in memory (External Sorting).

### Description

Merge Sort is a recursive algorithm that continuously splits the array into two halves until each subarray contains only one element (which is inherently sorted). Then, it merges those sorted subarrays back together in a way that keeps the combined result sorted.

### The Intuition

Think of a large group of people who need to be sorted by height. Instead of trying to sort everyone at once, you split the group into two smaller groups. You keep splitting them until you have individuals. Then, you take two individuals, compare them, and form a sorted pair. You then take two sorted pairs and "zip" them together into a sorted group of four. You repeat this zipping process until the whole group is back together and sorted.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | O(n log n)      | O(n log n)      |
| Space Complexity | O(n)            | O(n)            |

!!! Note ""
    The O(n) space complexity comes from the temporary array used during the merging process.*

### Code

```java
class Solution {
    public int[] mergeSort(int[] nums) {
        // Perimeter Defense
        if (nums == null || nums.length <= 1) return nums;
        
        sort(nums, 0, nums.length);
        return nums;
    }

    private void sort(int[] arr, int start, int end) {
        // Base case: a range of 1 element is already sorted
        if ((end - start) <= 1) return;

        int mid = start + (end - start) / 2;

        // Recursively split the array
        sort(arr, start, mid);
        sort(arr, mid, end);
        
        // Merge the two sorted halves
        merge(arr, start, mid, end);
    }

    private void merge(int[] arr, int start, int mid, int end) {
        int[] temp = new int[end - start];
        int i = start;    // Pointer for left half
        int j = mid;      // Pointer for right half
        int k = 0;        // Pointer for temp array

        // Compare and pick the smaller element
        while (i < mid && j < end) {
            // Use <= instead of < to maintain Stability
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        // Clean up remaining elements in left half
        while (i < mid) {
            temp[k++] = arr[i++];
        }

        // Clean up remaining elements in right half
        while (j < end) {
            temp[k++] = arr[j++];
        }

        // Copy the sorted temp array back into the original array
        for (k = 0; k < temp.length; k++) {
            arr[start + k] = temp[k];
        }
    }
}
```

---

### Concepts to Think About

1.  **Stability:** Merge Sort is inherently **stable**. In the `merge` step, if you find two equal elements, you should always pick the one from the "left" subarray first (`arr[i] <= arr[j]`). Why is stability important in real-world applications (like sorting a list of transactions by date, then by amount)?
2.  **Linked Lists:** Merge Sort is the **preferred sorting algorithm for Linked Lists**. Unlike arrays, linked lists don't have random access, but they make merging very efficient because you only need to change pointers. Can you think of how the space complexity might change to O(log n) when sorting a linked list?
3.  **Space Trade-off:** While Merge Sort has a better Worst-Case time complexity than Quick Sort O(n Log(n)) vs O(n^2), it requires O(n) extra space. In embedded systems with very low memory, would you still choose Merge Sort?
4.  **Inversion Count:** There is a famous problem called "Count Inversions" (finding how many pairs in an array are out of order). This problem is solved by slightly modifying the `merge` step of Merge Sort. How could the merge step tell you how many elements were "jumped over"?
5.  **Hybrid Approaches (Timsort):** Real-world libraries (like `Arrays.sort()` in Java for objects) actually use **Timsort**, which is a hybrid of Merge Sort and Insertion Sort. Why would combining these two be faster than using just Merge Sort?