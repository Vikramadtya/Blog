---
tags:
  - cc
  - prefix-sum
  - hashing
  - sliding-window
---

# Longest Subarray with Sum K

## Question

Given an integer array $nums$ of size $n$ and an integer $k$, find the length of the longest subarray whose elements sum up to exactly $k$. If no such subarray exists, return $0$.

## Solution

### Pattern

**Prefix Sum Difference Mapping**
The sum of a subarray spanning from index $j+1$ to $i$ can be calculated using the difference of their prefix sums: $\text{PrefixSum}[i] - \text{PrefixSum}[j]$. If this difference equals $k$, then the target subarray has been found.

### How to Identify

- The problem involves finding a contiguous block (subarray) that satisfies a target sum.
- The input array can contain **negative numbers or zeros**, making a basic sliding window expansion/contraction unreliable.
- The requirement focuses on maximizing or minimizing subarray lengths based on value thresholds.

### Description

Step-by-step explanation:

- **Step 1: Map Initialization.** Create a hash map to store mapping pairs of `(PrefixSum, EarliestIndex)`. Pre-populate this map with `(0, -1)` to seamlessly handle cases where a valid subarray begins at index $0$.
- **Step 2: Linear Accumulation.** Maintain a running variable `currentSum` initialized to $0$. Iterate through the array using index pointer $i$.
- **Step 3: Target Evaluation.** At each element, add $nums[i]$ to `currentSum`. Check if the map contains the value $\text{currentSum} - k$.
    - If it exists, compute the potential length as $i - \text{map.get}(\text{currentSum} - k)$ and update your maximum length record.
- **Step 4: Retain Earliest State.** Insert the pair `(currentSum, i)` into the map **only if** `currentSum` is not already present. This preserves the earliest index, maximizing the value of $i - j$ in future lookups.



### The Intuition

Think of this approach as tracking your coordinates along a **one-way trail**. 



You want to find the longest segment of the trail that matches an exact distance of $k$ miles. At every marker $i$, you note your total distance from the start (`currentSum`). If you are currently at mile $15$ and looking for a segment of exactly $k = 10$ miles, you check your logbook to see the **very first time** you were at mile $5$ ($15 - 10$). The distance between that historic point and your current position is a valid segment. To make the segment as long as possible, you always keep the oldest timestamp for mile $5$ in your book.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n^2)$       | $O(n)$           |
| Space Complexity | $O(n)$         | $O(n)$           |

#### Time Complexity
Average time is $O(n)$ because `HashMap` lookups operate in $O(1)$ average time. The absolute worst-case time is $O(n^2)$ if severe internal hash collisions degrade map lookups to linear scans.

#### Space Complexity
$O(n)$ auxiliary space is required to store the distinct prefix sums within the tracking map container.

### Code

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Finds the maximum length of a subarray summing to k.
     * Works for positive, negative, and zero values.
     */
    public int longestSubarray(int[] nums, int k) {
        int currentSum = 0;
        int maxLen = 0;
        
        // Map to store (PrefixSum -> First Occurred Index)
        Map&lt;Integer, Integer&gt; prefixMap = new HashMap<>();
        
        // Base case: If currentSum exactly equals k, index - (-1) becomes length i + 1
        prefixMap.put(0, -1);
        
        for (int i = 0; i &lt; nums.length; i++) {
            currentSum += nums[i];
            
            // Check if a complement prefix sum exists
            if (prefixMap.containsKey(currentSum - k)) {
                maxLen = Math.max(maxLen, i - prefixMap.get(currentSum - k));
            }
            
            // Retain the earliest index for the current prefix sum to maximize length
            prefixMap.putIfAbsent(currentSum, i);
        }
        
        return maxLen;
    }
}
```

## Caveats

- **The Overwrite Trap:**  
  Never use an unconditional `map.put(currentSum, i)`. If you overwrite an existing prefix sum, you bring the recorded index closer to `i`, which shrinks the potential length of your target subarray.

- **Zero Values:**  
  If the array contains many zeros, the prefix sum will remain unchanged across those positions. `putIfAbsent` ensures the index points to the start of the zero-sequence, maximizing your result length.

---

## Concepts to Think About

- **Sliding Window Alternative:**  
  If all numbers are guaranteed to be non-negative, drop the map entirely. Use a Two-Pointer sliding window to shrink space to `O(1)` while keeping time at `O(n)`.

- **Hash Map Collisions:**  
  Be prepared to explain how Java's `HashMap` handles collisions using balanced trees (turning `O(n)` chains into `O(log n)` paths).

- **Prefix Space Overhead:**  
  If memory efficiency is a high priority, consider whether sorting or approximation handles the application boundary constraints better.

---

## Logical Follow-up

Question: What if the array contains only positive integers? Optimize the space complexity to `O(1)`.

Solution: Use a Sliding Window. Expand the right pointer to add elements to a running sum. If the sum exceeds `k`, increment the left pointer to shrink the window until the sum is less than or equal to `k`. Track the maximum window size (`O(n)`) whenever the sum matches `k`.

```java
public int longestSubarrayPositives(int[] nums, int k) {
    int left = 0, right = 0, sum = 0, maxLen = 0;

    while (right < nums.length) {
        sum += nums[right];

        while (sum &gt; k && left <= right) {
            sum -= nums[left++];
        }

        if (sum == k) {
            maxLen = Math.max(maxLen, right - left + 1);
        }

        right++;
    }

    return maxLen;
}
```

Question: How do you modify this approach to find the total count of subarrays that sum to `k` instead of the maximum length?

Solution: Instead of storing the earliest index of a prefix sum, map each `PrefixSum` to its frequency count. Every time `currentSum - k` matches an entry in your map, add that entry's frequency count directly to your total counter variable.