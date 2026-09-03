---
tags:
  - binary-search
  - arrays
---

# Find out how many times the array is rotated

## Question

Given an array of integers `nums` of size $n$, sorted in ascending order with distinct values, which has been right-rotated between $0$ and $n-1$ times. Determine the exact number of rotations performed.

## Solution

### Pattern

**Binary Search for Minimum (Pivot Index)**
In a right-rotated sorted array, the number of rotations is mathematically identical to the **index of the minimum element**. Therefore, this problem is identical to "Find Minimum in Rotated Sorted Array". We use a `left &lt; right` binary search comparing `mid` to the `right` boundary.

### How to Identify

- The array is explicitly stated to be **sorted and rotated**.
- You need to find a single structural anomaly (the pivot/minimum).
- The required time complexity is $O(\log n)$.

### Description

Step-by-step explanation:

1. A fully sorted array `[1, 2, 3, 4, 5]` rotated 2 times becomes `[4, 5, 1, 2, 3]`. The minimum element `1` is at index 2. The number of rotations is 2. The problem reduces to: Find the index of the minimum element.
2. Initialize `left = 0` and `right = nums.size() - 1`.
3. Loop strictly while `left < right` to ensure the pointers converge on exactly one element.
4. Calculate `mid = left + (right - left) / 2`.
5. Evaluate `nums[mid] &gt; nums[right]`:
   - **If TRUE:** The sub-array from `mid` to `right` is unsorted. Because the original array was ascending, a larger number before a smaller number means the "wrap around" (the minimum) happened *after* `mid`. Discard the left half: `left = mid + 1`.
   - **If FALSE:** The sub-array from `mid` to `right` is perfectly sorted. Therefore, the minimum element in this entire section is `mid`. The absolute minimum of the array must be `mid` or somewhere to its left. Discard the right half: `right = mid`.
6. When the loop terminates, `left` will equal `right`, pointing exactly at the minimum element.
7. Return `left` (the index), which represents the number of rotations.

### The Intuition

Imagine an unrolled calendar for a week starting on Sunday: `[Sun, Mon, Tue, Wed, Thu, Fri, Sat]`.
If you rotate it right by 3 days, you get `[Thu, Fri, Sat, Sun, Mon, Tue, Wed]`.
If you want to know *how many days* it was rotated, you just need to find where "Sunday" (the original start/minimum) ended up. Sunday is at index 3. Therefore, it was rotated 3 times.
To find Sunday quickly without checking every day, look at a day in the middle (e.g., Saturday). Compare it to the end of the array (Wednesday). Because Saturday comes *after* Wednesday in the week, you know the week must have "restarted" (Sunday) somewhere to your right.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved in every iteration based on a single $O(1)$ comparison. For an array of size $N$, this requires at most $\log_2(N)$ steps.

#### Space Complexity

The algorithm uses only primitive pointers (`left`, `right`, `mid`), operating entirely in place. Auxiliary space is strictly $O(1)$.

### Code

```java
import java.util.List;

class Solution {
    public int findKRotation(List&lt;Integer&gt; nums) {
        if (nums == null || nums.isEmpty()) return 0;

        int left = 0;
        int right = nums.size() - 1;

        // Converge pointers to the minimum element
        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (nums.get(mid) &gt; nums.get(right)) {
                // The minimum must be strictly to the right
                left = mid + 1;
            } else {
                // The right side is sorted, minimum is mid or to the left
                right = mid;
            }
        }

        // The index of the minimum element is the rotation count
        return left;
    }
}
```

## Caveats

- **Redundant `left` comparisons:** Do not compare `nums[left]` to `nums[mid]`. It is a common mistake carried over from the "Search in Rotated Sorted Array" problem. Comparing `left` to `mid` fails to accurately determine the pivot when the array is fully sorted (0 rotations), because `nums[left] &lt;= nums[mid]` is true for both `[1, 2, 3, 4, 5]` and `[4, 5, 1, 2, 3]`. Comparing `mid` to `right` is universally foolproof.
- **Left vs Right Rotations:** The problem specifies *right* rotations. If the problem specified *left* rotations, rotating `[1, 2, 3, 4, 5]` left by 2 yields `[3, 4, 5, 1, 2]`. The minimum `1` is at index 3. To find the number of left rotations, the formula changes to `(n - min_index) % n`.

## Concepts to Think About

- **Graphing the Array:** Plotting the values of a rotated sorted array forms two distinct, parallel ascending lines. Finding the number of rotations is mathematically identical to finding the x-coordinate of the lowest point on the Y-axis.
- **Duplicates:** The assumption of "distinct values" is critical. If duplicates are allowed, $O(\log N)$ is impossible in the worst case (e.g., `[3, 3, 3, 1, 3]`), and the algorithm degrades to $O(N)$.
- The Index-Rotation Identity: Why does the index of the minimum element equal the number of rotations? Think about the "0 rotations" case (index 0) vs. "1 rotation" (index 1).
- The Right-Boundary Rule: Why is comparing to nums[right] safer than nums[left]? (Hint: In a non-rotated array, nums[left]<nums[mid] is true, but that doesn't tell you the pivot is on the right—there is no pivot!)
- Termination: Why does left &lt; right prevent an infinite loop when only two elements are left?


## Logical Follow-up

**Question:** How does the algorithm change if the array contains duplicate elements?

**Solution:** If there are duplicates, you can encounter a situation where `nums[mid] == nums[right]` (e.g., `[10, 1, 10, 10, 10]`). You can no longer guarantee which half contains the pivot. To handle this safely, you must add an `else if (nums[mid] == nums[right])` block where you simply decrement `right` by 1 (`right--`). This slowly shrinks the window to resolve the duplicate ambiguity. In the worst case (an array of identical elements), this degrades the time complexity from $O(\log N)$ to $O(N)$.



**Question:** "Now that you have the rotation count ($k$), how would you search for a specific `target` value in this same array in $O(\log n)$ time?"

**Solution:** You have two choices:

1. **The Two-Search Method:** Use $k$ to split the array into two sorted halves (`[0...k-1]` and `[k...n-1]`). Perform a standard binary search on the appropriate half.

2. **The "Virtual" Index Method:** Perform one binary search on the whole array, but map the `mid` index to the "real" sorted index using:  
   $$\text{realMid} = (\text{mid} + k) \pmod n$$

**Question (The Duplicate Trap):** "Suppose the array **contains duplicates** (e.g., `[2, 2, 2, 0, 2, 2, 2]`). Does your $O(\log n)$ solution still work? If not, what is the new worst-case time complexity, and how do you handle it in a production environment at Google?"

**Solution:**

1. **The Problem:** If `nums[mid] == nums[right]`, you cannot tell if the pivot is to the left or right. The binary search "breaks."
2. **The Fix:** When $nums[mid] == nums[right]$, you must simply shrink the search space linearly by setting `right = right - 1`.
3. **Complexity:** The worst-case time complexity becomes $O(n)$ (e.g., an array of all $1$s with one $0$ hidden somewhere).
4. **Production Context:** In an L5 role, you should mention that while the _average_ case is still fast, we must be aware of $O(n)$ "Degenerate Cases" for our Service Level Objectives (SLOs). We might even add telemetry to track how often our binary search "downgrades" to linear search.

**Revised Loop Segment:**

```java
if (nums[mid] &gt; nums[right]) {
    left = mid + 1;
} else if (nums[mid] < nums[right]) {
    right = mid;
} else {
    // Ambiguity! Shrink the boundary linearly.
    right--;
}
```
