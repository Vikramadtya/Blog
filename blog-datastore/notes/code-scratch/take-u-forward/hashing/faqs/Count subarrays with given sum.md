---
tags:
  - arrays
  - hash-table
  - prefix-sum
---

# Subarray Sum Equals K

## Question

Given an array of integers `nums` and an integer $k$, return the total number of contiguous subarrays whose sum equals exactly to $k$.

## Solution

### Pattern

**Prefix Sum with Hash Map (Frequency Map)**
Maintain a running sum (prefix sum) as you iterate through the array. Use a Hash Map to store the frequencies of all prefix sums seen so far. At each step, check if $(current\_sum - k)$ exists in the map; if so, add its frequency to your total count.

### How to Identify

- The problem asks for **contiguous subarrays** (not subsequences).
- The problem is centered around a specific **target sum** ($k$).
- The array can contain **negative numbers or zeroes**, strictly disqualifying Sliding Window / Two Pointers because the running sum does not monotonically increase or decrease.
- It asks for the *count* of such subarrays, requiring frequency tracking.

### Description

Step-by-step explanation:

1. Create a `HashMap` to store `&lt;PrefixSum, Frequency&gt;`.
2. Seed the map with `(0, 1)`. This is a critical base case meaning "we have seen a prefix sum of 0 exactly once." It handles subarrays starting exactly from index 0 that sum to $k$.
3. Initialize `sum = 0` (running prefix sum) and `count = 0` (total valid subarrays found).
4. Iterate through the array. For each element `num`:
   - Add `num` to `sum`.
   - Calculate the required prefix: `required = sum - k`.
   - If `required` exists as a key in the map, it means there are one or more historical prefixes we can "chop off" to leave a remaining subarray sum of exactly $k$. Add the frequency of `required` to `count`.
   - Finally, insert or update the current `sum` into the map, incrementing its frequency by 1.
5. Return the total `count`.

### The Intuition

This relies on fundamental prefix sum algebra. 
Let $PrefixSum[i]$ be the sum of elements from index $0$ to $i$.
The sum of a subarray from index $i$ to $j$ is calculated as:
$$Sum(i, j) = PrefixSum[j] - PrefixSum[i - 1]$$

We want $Sum(i, j) = k$. Substituting this into our equation:
$$k = PrefixSum[j] - PrefixSum[i - 1]$$
Rearranging for the unknown past prefix:
$$PrefixSum[i - 1] = PrefixSum[j] - k$$

This means: as we stand at index $j$ (where our current sum is $PrefixSum[j]$), if we can look back and find *how many times* a sum of $(PrefixSum[j] - k)$ occurred in the past, that is exactly the number of valid subarrays ending at $j$.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^2)$       | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

Iterating through the array takes $O(N)$. On average, Hash Map lookups and insertions are $O(1)$, giving $O(N)$ time. In the absolute worst case (extreme hash collisions), map operations degrade to $O(N)$ per step, leading to $O(N^2)$ worst-case time complexity.

#### Space Complexity

In the worst case (where all running prefix sums are unique), the Hash Map will store $N$ distinct entries, yielding $O(N)$ auxiliary space.

### Code

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        if (nums == null || nums.length == 0) return 0;
        
        Map&lt;Integer, Integer&gt; prefixSumCount = new HashMap<>();
        prefixSumCount.put(0, 1); 

        int sum = 0, count = 0;
        
        for (int num : nums) {
            sum += num;
            count += prefixSumCount.getOrDefault(sum - k, 0);
            prefixSumCount.put(sum, prefixSumCount.getOrDefault(sum, 0) + 1);
        }

        return count;
    }
}
```

### Caveats

- **The Sliding Window Trap:** Do not attempt to use two pointers. If the array was `[1, -1, 1]` and $k = 1$, expanding the right pointer makes the sum `1`, then `0`, then `1`. Because the sum fluctuates up and down, a left pointer wouldn't know whether to shrink or stay, breaking the sliding window invariant.
- **Order of Operations:** You must check for `sum - k` *before* you add the current `sum` to the map. If $k = 0$, adding the current sum to the map first will falsely count the empty subarray (chopping off the current prefix from itself).

### Concepts to Think About

- **Frequency vs Earliest Index:** In "Largest Subarray with Sum 0", we store `&lt;Sum, EarliestIndex&gt;` because we want to maximize length. Here, we store `&lt;Sum, Frequency&gt;` because we want to count total occurrences.
- **Integer Overflow:** If the array is massive and elements are large, the running sum might overflow a 32-bit `int`. Using a `long` for the running sum is safer in production systems, though LeetCode constraints for this specific problem usually keep it within 32-bit limits.

### Logical Follow-up

Question: What if the problem guarantees that the array contains ONLY strictly positive integers?

Solution: You can abandon the Hash Map and use the **Sliding Window (Two Pointers)** approach. Use a `left` and `right` pointer. Expand `right` to increase the sum. If the sum exceeds $k$, shrink `left` until it is $\le k$. If it exactly equals $k$, increment the count. This operates in strictly $O(N)$ worst-case time and $O(1)$ space.

Question: How would you find the number of subarrays whose sum is *divisible* by $K$? (LeetCode 974)

Solution: Instead of storing prefix sums, you store the frequencies of the **prefix sum remainders** modulo $K$. If two prefix sums have the same remainder when divided by $K$, the subarray strictly between them must be perfectly divisible by $K$. (Note: you must adjust negative remainders in Java/C++ by doing `(sum % k + k) % k`). Time $O(N)$, Space $O(K)$.

Question: What if you need to find the number of submatrices (2D) that sum to $k$? (LeetCode 1074)

Solution: You can compress the 2D problem into a 1D problem. You iterate through all possible pairs of top and bottom rows (which takes $O(R^2)$). For a fixed top and bottom row, you collapse the columns into a 1D array by summing them vertically. Then, you run this exact $O(C)$ 1D Prefix Sum + Hash Map algorithm on that collapsed array. Total time: $O(R^2 \times C)$. Space: $O(C)$.