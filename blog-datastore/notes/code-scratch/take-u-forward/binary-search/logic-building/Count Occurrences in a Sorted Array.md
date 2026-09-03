---
tags:
  - binary-search
  - arrays
---

# Count Occurrences in a Sorted Array

## Question

Given a sorted array of integers `nums` and an integer `target`, return the number of times `target` appears in the array. Ensure the algorithm runs in strictly $O(\log n)$ time.

## Solution

### Pattern

**Double Boundary Binary Search (Lower Bound + Upper Bound)**
Use two separate binary searches. The first finds the Lower Bound (index of the first element $\ge target$). The second finds the Upper Bound (index of the first element $> target$). The difference between these two indices is exactly the frequency of the target.

### How to Identify

- The array is explicitly stated to be sorted.
- The prompt asks for a "count", "frequency", or "number of occurrences".
- Time complexity is constrained to $O(\log N)$, strongly disqualifying a single binary search followed by an $O(N)$ linear scan left and right.

### Description

Step-by-step explanation:

1. **Guard Clause:** Handle empty or null arrays by returning `0`.
2. **First Search (Lower Bound):** - Search space is `[0, n)`.
   - Use the predicate `nums[mid] >= target`. 
   - The result (`lb`) is the index of the first occurrence of the target.
3. **Verification:** - Check if `lb == nums.length` (target is larger than all elements) OR `nums[lb] != target` (target doesn't exist). 
   - If either is true, the frequency is `0`. Return early to save computation.
4. **Second Search (Upper Bound):**
   - Search space is `[lb, n)`. (We start at `lb` because the upper bound must mathematically be $\ge$ the lower bound).
   - Use the predicate `nums[mid] > target`.
   - The result (`ub`) is the index of the first element *strictly greater* than the target.
5. **Calculate Frequency:** - Because of how 0-based array indexing works, the total number of elements in a contiguous block is exactly `UpperBoundIndex - LowerBoundIndex`. Return `ub - lb`.

### The Intuition

Imagine a sorted line of numbered tickets: `[2, 5, 5, 5, 5, 8]`. You want to count the `5`s.
Because they are sorted, all identical numbers are clumped together in a single contiguous block.
You don't need to count them one by one. You just need to know exactly where the block starts, and exactly where it ends.
If you know the `5`s start at index $1$ (Lower Bound), and the first number that is *not* a `5` occurs at index $5$ (Upper Bound: the `8`), you simply subtract the indices: $5 - 1 = 4$. There are exactly four `5`s.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We perform two independent binary searches. Each takes $O(\log N)$ time. Total time is $O(2 \log N)$, which simplifies to $O(\log N)$.

#### Space Complexity

We only use a few primitive integer pointers (`left`, `right`, `mid`, `lb`, `ub`). No auxiliary arrays or recursive stacks are used, yielding strictly $O(1)$ space.

### Code

```java
class Solution {
    public int countOccurrences(int[] nums, int target) {
        if (nums == null || nums.length == 0) return 0;
        
        // 1. Find the first occurrence (Lower Bound)
        int lb = binarySearch(nums, target, 0, nums.length, true);
        
        // 2. Safe verification: Ensure lb is within bounds AND matches the target
        if (lb == nums.length || nums[lb] != target) {
            return 0;
        }

        // 3. Find the first element strictly greater than target (Upper Bound)
        // Optimization: Start the search from 'lb'
        int ub = binarySearch(nums, target, lb, nums.length, false);

        // The number of occurrences is exactly the upper bound index minus the lower bound index
        return ub - lb;
    }

    private int binarySearch(int[] nums, int target, int left, int right, boolean isLowerBound) {
        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (isLowerBound ? nums[mid] &gt;= target : nums[mid] > target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

## Caveats

- **The Linear Scan Trap:** The most common mistake candidates make is writing one binary search to find a target, and then using a standard `while` loop to linearly scan left and right to count identical neighbors. If the array is `[5, 5, 5, 5, 5, 5]` and the target is `5`, the linear scan degenerates into $O(N)$ worst-case time. You *must* use two separate binary searches.
- **Out of Bounds Check:** If using the `[left, right)` template, `right` is initialized to `nums.length`. The lower bound can absolutely return `nums.length`. Accessing `nums[lb]` without checking `lb == nums.length` first is a guaranteed `IndexOutOfBoundsException` waiting to happen.

## Concepts to Think About

- **C++ STL Parity:** This exact logic is how C++ developers solve this problem using the Standard Template Library: `std::distance(std::lower_bound, std::upper_bound)`.
- **DRY Principle:** Combining the two binary searches into a single helper method via a `boolean` parameter is a strong signal of code maintainability and engineering maturity.

## Logical Follow-up

Question: If you were evaluating the frequency of thousands of different queries against the same array, how would you optimize?
Solution: If you are making thousands of queries against a static sorted array, $O(\log N)$ per query is fine. However, if the array is heavily populated with duplicates and relatively dense, you might pre-process the array into a Hash Map storing `&lt;Element, Frequency&gt;`. The pre-processing takes $O(N)$ time and $O(U)$ space (where $U$ is unique elements), but subsequent queries take $O(1)$ time. This is a classic Time-Space tradeoff suitable for system design discussions.