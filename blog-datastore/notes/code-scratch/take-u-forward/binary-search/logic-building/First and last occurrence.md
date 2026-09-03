---
tags:
  - binary-search
  - arrays
---

# Find First and Last Position of Element in Sorted Array

## Question

Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If the target is not found, return `[-1, -1]`. The algorithm must run in $O(\log n)$ time.

## Solution

### Pattern

**Double Boundary Binary Search (Lower Bound + Upper Bound)**
Execute two separate Binary Searches. The first finds the Lower Bound (the first element $\ge$ target). The second finds the Upper Bound (the first element $>$ target). Subtract $1$ from the Upper Bound to find the last occurrence of the target.

### How to Identify

- The array is sorted.
- The array explicitly contains **duplicates** (implied by asking for a range/starting and ending position).
- Time complexity is constrained to strictly $O(\log N)$, disqualifying a $O(\log N)$ search followed by an $O(N)$ linear scan to find the edges.

### Description

Step-by-step explanation:

1. **Guard Clause:** Handle empty arrays or mathematically impossible targets (target strictly smaller than `nums[0]` or larger than `nums[n-1]`).
2. **First Search (Lower Bound):** - Define search space `[0, n)`.
   - Use the predicate `nums[mid] >= target`. If true, `right = mid`. If false, `left = mid + 1`.
   - The result (`lb`) is the index of the first occurrence of the target.
3. **Verification:** Check if `lb == nums.length` (target is larger than all elements) OR `nums[lb] != target` (target doesn't exist). If either is true, return `[-1, -1]`. 
   - *Crucially, do this BEFORE the second search to save time.*
4. **Second Search (Upper Bound):**
   - Define search space `[lb, n)`. (Optimization: we don't need to search from 0, because the last occurrence must be at or after the first occurrence).
   - Use the predicate `nums[mid] > target`. If true, `right = mid`. If false, `left = mid + 1`.
   - The result is the index of the first element *strictly greater* than the target.
5. **Finalize:** The last occurrence of the target is mathematically guaranteed to be the element immediately preceding the upper bound. Return `[lb, upperBound - 1]`.

### The Intuition

Imagine you have a row of colored blocks: `[Red, Blue, Blue, Blue, Green]`. You want to find the start and end of the Blue blocks.
Because they are grouped together (sorted), you don't need to look at every block.
First, you ask: "Where is the boundary between Red and Blue?" (Lower Bound). Binary search finds it instantly.
Second, you ask: "Where is the boundary between Blue and Green?" (Upper Bound). Binary search finds it instantly.
The Blue section starts exactly at the Red/Blue boundary, and ends exactly one step *before* the Blue/Green boundary.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We perform two independent binary searches. Each takes $O(\log N)$ time. The total time is $O(2 \log N)$, which simplifies asymptotically to $O(\log N)$.

#### Space Complexity

We only use a few primitive integer pointers (`left`, `right`, `mid`, `lb`, `ub`). No auxiliary arrays or recursive stacks are used, yielding strictly $O(1)$ space.

### Code

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        if (nums == null || nums.length == 0 || target &lt; nums[0] || target &gt; nums[nums.length - 1]) {
            return new int[]{-1, -1};
        }

        // 1. Find the first occurrence (Lower Bound)
        int lb = binarySearch(nums, target, 0, nums.length, true);
        
        // 2. Safely check if the target actually exists
        if (lb == nums.length || nums[lb] != target) {
            return new int[]{-1, -1};
        }

        // 3. Find the first element strictly greater than target (Upper Bound).
        // Optimization: Start searching from 'lb' instead of 0.
        int ub = binarySearch(nums, target, lb, nums.length, false) - 1;

        return new int[]{lb, ub};
    }

    private int binarySearch(int[] nums, int target, int left, int right, boolean findFirst) {
        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (findFirst) {
                // Lower Bound logic: keep looking left if &gt;= target
                if (nums[mid] >= target) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            } else {
                // Upper Bound logic: keep looking left ONLY if > target
                if (nums[mid] > target) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
        }
        return left;
    }
}
```

## Caveats

- **The Linear Scan Trap:** The most common mistake candidates make is writing one binary search to find the target, and then using a standard `while` loop to linearly scan left and right to find the boundaries. If the array is `[5, 5, 5, 5, 5, 5]` and the target is `5`, the linear scan degenerates into $O(N)$ worst-case time, failing the interview requirement. You *must* use two separate binary searches.
- **Out of Bounds Check:** If using the `[left, right)` template, `right` is initialized to `nums.length`. The lower bound can absolutely return `nums.length`. Accessing `nums[lb]` without checking `lb == nums.length` first is a guaranteed `IndexOutOfBoundsException` waiting to happen.

## Concepts to Think About

- **Frequency Counting:** You can adapt this exact logic to count the frequency of an element in a sorted array in $O(\log N)$ time. `Frequency = UpperBound - LowerBound`.
- **DRY Principle:** Combining the two binary searches into a single helper method via a `boolean` parameter is a strong signal of code maintainability and engineering maturity.
- The lowerBound Relation: The first occurrence is exactly lowerBound(target). The last occurrence is upperBound(target) - 1. Why? (Hint: Upper bound is the first element strictly greater than the target).
- Search Space Optimization: If you find the first occurrence at index k, your second search space only needs to be [k, nums.length - 1].
- DRY Principle: In an L5 interview, modularizing code into findBound or binarySearch helpers is often more important than the algorithm itself.
- Empty/Single Element Arrays: How does the logic change if the array has only one element? (The loop runs once, left and right both point to index 0, and ans is correctly recorded).

## Logical Follow-up

**Question:** If you were evaluating the frequency of many different queries against the same array, how would you optimize?

**Solution:** If you are making thousands of queries against a static sorted array, $O(\log N)$ per query is fine. However, if the array is heavily populated with duplicates and relatively dense, you might pre-process the array into a Hash Map storing `&lt;Element, [StartIndex, EndIndex]&gt;`. The pre-processing takes $O(N)$ time and $O(U)$ space (where $U$ is unique elements), but subsequent queries take $O(1)$ time. This is a classic Time-Space tradeoff suitable for system design discussions.


**Question:** "What if the array is sorted but **circularly shifted** (e.g., `[4, 5, 5, 5, 6, 1, 2]`)? Can you still find the range of `5` in $O(\log n)$?"

**Solution:**

1. Use Binary Search to find the **Pivot** (the minimum element) in $O(\log n)$.
2. The pivot divides the array into two sorted halves.
3. Identify which half (or both) could contain the target.
4. Run your `searchRange` logic on that specific segment.


**Question (Search in a Sorted Array with Duplicates and "Gaps"):**
"Imagine a sorted array where some elements are replaced with empty strings (e.g., `["at", "", "", "", "ball", "", "", "car", "", "", "dad", "", ""]`). Find the index of a target string. If the target appears multiple times, return the first and last index."

**Solution:**

This is called **Sparse Binary Search**.

1. **The Challenge:** If `nums[mid]` is an empty string `""`, you don't know whether to move left or right.
2. **Solution:** When `nums[mid] == ""`, you must linearly move `mid` to the closest non-empty string (either left or right).
3. **Worst Case:** If the array is almost all empty strings, the complexity can degrade to $O(n)$.
4. **Range Search:** Once you've moved `mid` to a non-empty string, you proceed with the standard range-finding logic.