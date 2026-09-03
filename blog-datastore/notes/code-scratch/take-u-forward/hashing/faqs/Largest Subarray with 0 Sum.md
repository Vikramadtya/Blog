---
tags:
  - arrays
  - hash-table
  - prefix-sum
---

# Largest Subarray with 0 Sum

## Question

Given an integer array `nums` of size $n$ containing both positive and negative integers, find the length of the longest contiguous subarray with a sum equal to $0$. Return $0$ if no such subarray exists.

## Solution

### Pattern

**Prefix Sum with Hash Map**
Maintain a running sum as you iterate through the array. Store the first occurrence of each running sum and its index in a Hash Map. If a running sum is seen again, the elements between the old index and the current index must sum to zero.

### How to Identify

- The problem asks for a **contiguous subarray** (not subsequence).
- The problem involves a **sum constraint** (sum == 0, or sum == k).
- The array contains **negative numbers**, which strictly disqualifies the Two-Pointer / Sliding Window pattern (since the sum does not monotonically increase or decrease).

### Description

Step-by-step explanation:

1. Validate the input. If it's null or empty, return `0`.
2. Initialize a Hash Map to store `&lt;RunningSum, Index&gt;`. 
3. Seed the map with the base case: `(0, -1)`. This handles the scenario where a valid zero-sum subarray starts exactly at index 0.
4. Initialize a `sum` variable to 0 and a `maxLen` variable to 0.
5. Iterate through the array. For each element, add it to `sum`.
6. Check if `sum` already exists in the map as a key:
   - **If YES:** We have found a zero-sum subarray. The length is `current_index - map.get(sum)`. Update `maxLen` if this length is greater than the current `maxLen`. *(Crucially, do NOT update the index in the map, as we want the earliest occurrence to maximize the length).*
   - **If NO:** Put the `sum` and the `current_index` into the map.
7. Return `maxLen`.

### The Intuition

Think of the running sum as an altitude tracker while hiking. 
As you add positive numbers, you hike up the mountain. As you add negative numbers, you hike down into a valley. 
If you check your altimeter at 2:00 PM and you are at 500 feet of elevation, and you check it again at 4:00 PM and you are *still* at exactly 500 feet of elevation, what happened between 2:00 PM and 4:00 PM? Your net elevation change was exactly 0. 
The same logic applies to arrays: if the prefix sum at index `i` is $S$, and the prefix sum at index `j` is $S$, the sum of the elements strictly between `i` and `j` must be $0$.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^2)$       | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

We iterate through the array of size $N$ exactly once. On average, `HashMap` insertions and lookups are $O(1)$, resulting in $O(N)$ time. However, in the absolute worst-case scenario with severe hash collisions, lookups degrade, causing an $O(N^2)$ worst-case time complexity.

#### Space Complexity

In the worst case (e.g., all positive numbers), the running sum is always unique. We will store $N$ distinct key-value pairs in the Hash Map, requiring $O(N)$ auxiliary space.

### Code

```java
class Solution {
    public int maxLen(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        Map&lt;Integer, Integer&gt; prefixMap = new HashMap<>();
        prefixMap.put(0, -1); // Base case for subarray starting at index 0
        
        int sum = 0, maxLen = 0;

        for (int i = 0; i &lt; nums.length; i++) {
            sum += nums[i];
            
            if (prefixMap.containsKey(sum)) {
                // Same altitude reached; calculate horizontal distance
                maxLen = Math.max(maxLen, i - prefixMap.get(sum));
            } else {
                // Record the earliest index this altitude was reached
                prefixMap.put(sum, i);
            }
        }

        return maxLen;
    }
}
```

## Caveats

- **Sliding Window Trap:** Candidates often try to solve this using two pointers (a sliding window). This works **only** if the array contains strictly non-negative integers. With negative numbers, expanding the window doesn't guarantee the sum increases, and shrinking it doesn't guarantee the sum decreases, breaking the sliding window invariant.
- **Integer Overflow:** If the array contains very large values, the running sum might overflow a 32-bit integer. In production systems, you should use a `long` for the `sum` variable to prevent silent overflow bugs.

## Concepts to Think About

- **Generalization to Target $K$:** This logic seamlessly scales to finding a subarray that sums to *any* target $K$. You simply check if `prefixMap.containsKey(sum - K)`. 
- **Subarrays vs Subsequences:** Prefix sums only work for *contiguous* subarrays. If the problem asks for a *subsequence* (non-contiguous), this approach is useless, and you must look toward Backtracking or Dynamic Programming.
- **Zero-Sum Property:** Any array where the total sum is 0 is a zero-sum subarray of itself. The base case `(0, -1)` elegantly handles this mathematically: if the entire array from index 0 to $N-1$ sums to 0, the length is $(N-1) - (-1) = N$.

## Logical Follow-up

Question: How would you modify this to find the *number* of subarrays that sum to $K$, rather than the length of the longest one? (LeetCode 560: Subarray Sum Equals K)
Solution: Instead of storing `<Sum, First_Index&gt;`, you store `&lt;Sum, Frequency&gt;`. As you iterate, you calculate `sum - K`. If `sum - K` exists in the map, you add its *frequency* to your total count. Then, you increment the frequency of your current `sum` in the map. Time: $O(N)$, Space: $O(N)$.

Question: What if the problem asked for the longest subarray with an equal number of 0s and 1s? (LeetCode 525: Contiguous Array)
Solution: You can reduce this problem directly to the "Largest Subarray with 0 Sum" problem. Treat every `0` in the array as a `-1`. Now, a subarray with an equal number of `-1`s and `1`s will have a net sum of $0$. You apply the exact same Prefix Sum + HashMap logic.