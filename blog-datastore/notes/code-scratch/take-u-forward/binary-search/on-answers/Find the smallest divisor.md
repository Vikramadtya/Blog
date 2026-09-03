---
tags:
  - cc
  - binary-search
  - answer-space
  - optimization
---

# Smallest Divisor Given a Threshold

## Question

Given an array of integers `nums` and an integer `limit`, find the smallest positive integer divisor such that the sum of the division results (rounded up) is $\le limit$.

## Solution

### Pattern

**Binary Search on Answer Space (Monotonic Decreasing Function)**

### How to Identify

1. The answer lies within a defined range $[1, \max(nums)]$.
2. There is a clear "Yes/No" threshold: if a divisor $d$ works, all divisors $> d$ will also work.
3. You are looking for the "lower bound" of the valid answers.

### Description

We binary search for the divisor. For each `mid`, we calculate the sum of $\lceil nums[i] / mid \rceil$.

- If $\text{sum} \le limit$: `mid` is a potential answer, but a smaller one might work. Move `right = mid - 1`.
- If $\text{sum} > limit$: `mid` is too small. Move `left = mid + 1`.

### The Intuition

Imagine a slider for the divisor. If you push the slider to the right (larger divisor), the total sum drops. You are trying to find the leftmost position on that slider where the sum is still "under the limit."

### Complexity

- **Time Complexity:** $O(n \cdot \log(\max(nums)))$, where $n$ is the number of elements in `nums`.
- **Space Complexity:** $O(1)$.

### Code (L5 Optimized)

```java
class Solution {
    public int smallestDivisor(int[] nums, int limit) {
        int left = 1;
        int right = 0;
        for (int num : nums) right = Math.max(right, num);

        int ans = right;

        while (left &lt;= right) {
            int mid = left + (right - left) / 2;

            if (check(nums, mid, limit)) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }

    private boolean check(int[] nums, int divisor, int limit) {
        long sum = 0; // Use long to prevent overflow during summation
        for (int num : nums) {
            // L5 Integer Ceiling Trick: (a + b - 1) / b
            sum += (num + divisor - 1) / divisor;
        }
        return sum &lt;= limit;
    }
}
```

## Concepts to Think About

- Integer Ceil Formula: Why does (a+b−1)/b work? It adds "just enough" to the numerator to push it to the next multiple of b unless a is already a multiple.
- Overflow Safety: Even if nums[i] and limit are int, the intermediate sum can exceed $2^31−1$. Always use long for accumulators in $O(n)$ check functions.
- Predicate Functions: Breaking the "check" logic into its own function makes your code cleaner and more testable—a key requirement for Google code reviews.

### Logical Follow-up

**Question:** "What if the problem was reversed? Find the **largest** divisor such that the sum is **greater than or equal** to the threshold?"

**Solution:** The logic remains almost identical, but you change the "Candidate Recording" condition. You would record the `ans` when `sum &gt;= limit` and move `left = mid + 1` to find a larger one. This is simply the "Upper Bound" version of the same pattern.

**Question (Split Array Largest Sum):**
"Given an array `nums` which consists of non-negative integers and an integer `m`, you can split the array into `m` non-empty contiguous subarrays. Write an algorithm to minimize the largest sum among these `m` subarrays."

**L5 Analysis & Solution:**
This is the most famous L5/L6 Google application of Binary Search on Answer Space.

1.  **Identify the Answer Space:** The smallest possible "largest sum" is $\max(nums)$ (if each element was its own subarray). The largest possible is $\sum nums$ (if there's only one subarray).
2.  **Monotonicity:** If we can split the array such that no subarray exceeds sum $S$, we can also do it for any sum $&gt; S$.
3.  **Check Function:** Iterate through the array and greedily add elements to a subarray until the current sum exceeds `mid`. Count how many subarrays are needed. If `count <= m`, the `mid` is a valid capacity.
4.  **Complexity:** $O(n \cdot \log(\sum nums))$.
