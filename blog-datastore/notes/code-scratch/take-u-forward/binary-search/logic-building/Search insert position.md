---
tags:
  - binary-search
  - arrays
---

# Search Insert Position

## Question

Given a sorted array of distinct integers `nums` and a `target` value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. The algorithm must have $O(\log n)$ runtime complexity.

## Solution

### Pattern

**Binary Search for Boundary (Lower Bound)**
This problem is fundamentally asking for the **Lower Bound** of the target: the index of the first element that is greater than or equal to the target. We use a `[left, right)` binary search interval to zero in on this boundary.

### How to Identify

- The array is explicitly stated to be sorted.
- The required time complexity is strictly $O(\log n)$.
- You need to find an exact match OR the mathematical insertion point, which maps perfectly to the concept of a Lower Bound.

### Description

Step-by-step explanation:

1. Handle edge cases. If the array is null, return 0 as the insertion point.
2. Initialize `left = 0` and `right = nums.length`. We explicitly set `right` to the length of the array (which is an out-of-bounds index) because if the target is larger than every element in the array, it must be inserted at the very end.
3. Loop while `left &lt; right`. We use `&lt;` because our search space is defined as `[left, right)`.
4. Calculate `mid = left + (right - left) / 2` to prevent integer overflow.
5. Evaluate the predicate: `nums[mid] &gt;= target`.
   - **If TRUE:** The element at `mid` is greater than or equal to the target. This means `mid` is a valid insertion point. However, there might be earlier valid points. We shrink the window by setting `right = mid`. (We do not use `mid - 1` because `mid` itself is still a candidate).
   - **If FALSE:** The element at `mid` is strictly less than the target. The target absolutely cannot be inserted here or anywhere to its left. We definitively discard this half by setting `left = mid + 1`.
6. When the loop terminates, `left` will equal `right`, pointing exactly to the correct insertion index. Return `left`.

### The Intuition

Think of binary search as painting elements. 
Imagine we paint any element strictly less than the target RED.
We paint any element greater than or equal to the target GREEN.
Because the array is sorted, the colors will always form a pattern like `[RED, RED, RED, GREEN, GREEN]`.
The insertion position is simply the index of the very first GREEN element.
If `nums[mid]` is GREEN, the boundary is at `mid` or to its left.
If `nums[mid]` is RED, the boundary is strictly to its right.
By repeatedly halving the space, the `left` and `right` pointers eventually squeeze together onto the exact boundary where RED turns to GREEN. If everything is RED, the pointers squeeze together at the very end of the array, which is exactly where a new largest element belongs.

### Complexity

| Label            | Worst       | Average     |
| :--------------- | :---------- | :---------- |
| Time Complexity  | $O(\log N)$ | $O(\log N)$ |
| Space Complexity | $O(1)$      | $O(1)$      |

#### Time Complexity

The search space is halved in every iteration of the `while` loop. For an array of size $N$, this takes at most $\log_2(N)$ iterations. 

#### Space Complexity

The algorithm uses only three integer variables (`left`, `right`, `mid`), operating entirely in place. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        if (nums == null) return 0;

        int left = 0;
        int right = nums.length; // Can be inserted at the very end

        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] &gt;= target) {
                // The element at mid is &gt;= target. It could be the target itself,
                // or the first element strictly greater. Keep looking left to be sure.
                right = mid;
            } else {
                // The element is strictly less than target. The insert position MUST be to its right.
                left = mid + 1;
            }
        }

        // left == right, pointing to the exact insertion index
        return left;
    }
}
```

## Caveats

- **`left &lt;= right` Pitfall:** If you use the standard exact-match template `while (left &lt;= right)` with `right = mid - 1`, you will face edge cases when the target doesn't exist. You have to write messy post-processing logic to determine if you should return `left` or `right` after the loop breaks. The `[left, right)` template shown above gracefully handles all edge cases internally.
- **`left = mid` Infinite Loop:** Notice we never write `left = mid`. In integer division, `mid` biases towards the left. If `left` and `right` are adjacent, `mid` will equal `left`. If the logic branches to `left = mid`, the state doesn't change, causing an infinite loop. The `[left, right)` template perfectly avoids this by only doing `right = mid` or `left = mid + 1`.

## Concepts to Think About

- **Upper Bound:** If the array allowed duplicates, and the problem asked you to insert the element *after* all existing duplicates, you would switch the logic to find the Upper Bound (changing the condition to `nums[mid] &gt; target`).
- **Binary Search on Answer:** This boundary-finding logic is the exact engine used for advanced DP/Greedy problems where you search a mathematical range of possible answers rather than an array (e.g., Koko Eating Bananas).
- Redundancy vs. Performance: While an early return mid saves a few iterations, the standard lowerBound is often preferred for its mathematical robustness and ability to handle duplicates.
- The `right = nums.length` Choice: This is vital. If the target is larger than everything in the array, the loop must be able to return `nums.length`.
- Distinct vs. Duplicates: If the array had duplicates and the question asked for the last possible insertion point, how would the logic change? (Hint: Use upperBound logic).
- Library Equivalents: In Java, `Arrays.binarySearch` returns `-(insertion point) - 1` if the element isn't found.

## Logical Follow-up

**Question:** What if the array contains duplicates, and the problem asks you to find the starting and ending position of a given target value? (LeetCode 34: Find First and Last Position of Element in Sorted Array)

**Solution:** You run this exact boundary-finding binary search twice. 
First, you run the Lower Bound algorithm (`nums[mid] &gt;= target`) to find the first occurrence. Check if the element at that index actually equals the target; if not, it doesn't exist, return `[-1, -1]`. 
Second, you run the Upper Bound algorithm (`nums[mid] > target`) to find the first element strictly greater than the target. Subtract 1 from this result to get the last occurrence of the target. Time complexity remains $O(\log N)$.



**Question:** "Given a 2D matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row, return true if a `target` exists."

**Solution:** Treat the $M \times N$ matrix as a single $1 \text{D}$ array of length $M \times N$. 
* Binary search from `0` to `(M * N) - 1`. 
* Map the `mid` index back to 2D coordinates using `row = mid / N` and `col = mid % N`.

**Question (Search in a Bitonic Array):** "A Bitonic array is an array that is first strictly increasing and then strictly decreasing. Given a Bitonic array `nums` and a `target`, find the index of the `target` in $O(\log n)$ time."

**Solution:** You cannot use standard Binary Search because the array is not monotonic.
1. **Find the "Peak":** Use Binary Search to find the maximum element (the point where the trend flips). A point `i` is a peak if `nums[i] > nums[i-1]` and `nums[i] > nums[i+1]`.
2. **Split the Search:**
    * Binary search for the target in the increasing left half.
    * If not found, binary search for the target in the decreasing right half (remember to flip your `>` and `&lt;` logic for the decreasing part!).
3. **Why this is L5:** It requires composing multiple binary searches and identifying that "trend change" is just another predicate you can search for.


##### Key Differences for Binary Search

| Feature             | Bitonic Array                                                                               | Rotated Sorted Array                                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| **Trend**           | Increasing $\to$ Decreasing                                                                 | Sorted $\to$ Break $\to$ Sorted                                                                                      |
| **Crucial Point**   | **Peak:** The largest value.                                                                | **Pivot:** The point of discontinuity.                                                                               |
| **Monotonicity**    | Two monotonic halves (Inc / Dec).                                                           | Two monotonic halves (Part 1 / Part 2).                                                                              |
| **Search Strategy** | 1. Find Peak ($O(\log n)$) <br /&gt; 2. Binary search left half <br /> 3. Binary search right half | Check which half is sorted ($O(\log n)$) <br /> If `nums[L] &lt;= nums[mid]`, left is sorted. <br /&gt; Else, right is sorted. |
