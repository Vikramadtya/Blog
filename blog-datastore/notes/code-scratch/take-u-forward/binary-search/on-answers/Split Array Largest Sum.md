---
tags:
  - binary-search
  - greedy
  - arrays
---

# Split Array Largest Sum

## Question

Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty contiguous subarrays such that the largest sum of any subarray is minimized. Return this minimized largest sum.

## Solution

### Pattern

**Binary Search on Answer (Min-Max Pattern)**
We cannot easily compute the exact subarray splits. However, we know the answer lies in a specific numerical range. We can binary search this range. For each "guessed" max sum, we use a greedy algorithm to see if we can split the array into $\le k$ subarrays without any subarray exceeding our guess.

### How to Identify

- The problem asks to **minimize a maximum** or **maximize a minimum**.
- You are required to partition a sequence into contiguous segments (maintaining order).
- Validating a "guess" is significantly easier (linear time $O(N)$) than computing the exact configuration.

### Description

Step-by-step explanation:

1. **Establish Bounds:** - **Lower Bound (`left`):** The absolute smallest the "largest sum" could be is the maximum single element in `nums`. (e.g., If we split into $N$ subarrays, the largest sum is just the biggest number).
   - **Upper Bound (`right`):** The absolute largest the "largest sum" could be is the sum of all elements in `nums`. (e.g., If we split into $1$ subarray, the sum is everything).
2. **Binary Search:** Loop while `left &lt;= right`. Calculate the `mid` point. This `mid` is our "guessed" maximum allowed sum.
3. **Greedy Validation:** Pass `mid` to a helper function `canSplit(nums, k, mid)`.
   - Iterate through `nums`, keeping a running sum.
   - If adding the current number exceeds `mid`, we are forced to "cut" the array here and start a new subarray. Increment the subarray count.
   - If the total number of required subarrays exceeds `k`, the guess `mid` was **too small**. Return false.
   - Otherwise, return true.
4. **Adjust Bounds:**
   - If `canSplit` is true: `mid` is a valid answer, but we want the *minimized* answer. Throw away the right half: `right = mid - 1`.
   - If `canSplit` is false: `mid` is invalid (forces too many splits). Throw away the left half: `left = mid + 1`.
5. **Return:** The loop naturally breaks when `left` crosses `right`. At this exact moment, `left` points to the absolute lowest valid sum. Return `left`.

### The Intuition

Think of this like carrying boxes. You have $N$ boxes of different weights in a line, and you have $K$ trips to carry them all. You must carry contiguous blocks of boxes. You want to buy the smallest possible truck.
You don't know the exact truck size you need, but you know:
- The truck *must* be at least as big as the heaviest single box, otherwise you can't move it at all.
- You *never* need a truck bigger than the sum of all boxes combined.
You look at a catalog and pick a middle-sized truck. You simulate loading boxes in order. If the truck fills up, you send it away (1 trip). If you use more than $K$ trips, that truck is too small. You need a bigger one. If you use $\le K$ trips, the truck works! But you might be able to save money by buying a smaller one, so you test the next size down.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log S)$  | $O(N \log S)$    |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Let $S$ be the sum of all elements in `nums`. The size of our binary search space is exactly $S - \max(nums)$. We halve this search space logarithmically, resulting in $\approx \log(S)$ steps. At every step, we iterate through the array of size $N$ in the helper function. Total time is $O(N \log S)$.

#### Space Complexity

We only allocate a few primitive integer pointers (`left`, `right`, `mid`, `currentSum`, `count`). Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int splitArray(int[] nums, int k) {
        int left = 0, right = 0;
        
        // Define the minimum and maximum possible answers
        for (int n : nums) {
            left = Math.max(left, n);
            right += n;
        }

        // Binary search the answer space
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;

            if (canSplit(nums, k, mid)) {
                // Valid capacity, but try to find a smaller one
                right = mid - 1;
            } else {
                // Capacity too small, forces &gt; k splits
                left = mid + 1;
            }
        }

        // 'left' lands exactly on the minimum valid capacity
        return left;
    }

    private boolean canSplit(int[] nums, int k, int maxAllowedSum) {
        int currentSubarraySum = 0;
        int subarraysRequired = 1;

        for (int n : nums) {
            if (currentSubarraySum + n &gt; maxAllowedSum) {
                // The current subarray is full, start the next one
                subarraysRequired++;
                currentSubarraySum = n; 
            } else {
                currentSubarraySum += n;
            }
        }

        return subarraysRequired &lt;= k;
    }
}
```

## Caveats

- **Why `subarraysRequired <= k` works:** Even if we finish grouping and the required subarrays is strictly *less* than $k$, it is still a valid answer. Why? Because we can just arbitrarily split any of the existing subarrays further to reach exactly $k$ subarrays. Splitting an existing valid subarray will only *decrease* its sum, meaning the maximum sum constraint we tested for is never violated.
- **Dynamic Programming Pitfall:** This problem can be solved with DP: `dp[i][j]` = minimum largest sum for splitting `nums[0...i]` into `j` parts. However, the time complexity is $O(K \cdot N^2)$, which will trigger a Time Limit Exceeded (TLE) on large test cases. Always use Binary Search for Min-Max problems on contiguous arrays.

## Concepts to Think About

- **The Master Template:** This exact algorithm is a master template that solves an entire class of identical problems on LeetCode with almost zero modification. 
- **Monotonicity:** The core reason binary search works here is that the relationship is strictly monotonic. If a max sum $X$ is valid, any sum $&gt; X$ is also guaranteed to be valid. If $X$ is invalid, any sum $< X$ is also guaranteed to be invalid.

## Logical Follow-up

Question: Name three other problems that are mathematically identical to this one and can be solved using the exact same code structure.
Solution: 
1. **LeetCode 1011 (Capacity To Ship Packages Within D Days):** Replace "subarrays" with "days" and "max sum" with "ship capacity".
2. **LeetCode 875 (Koko Eating Bananas):** The search space is eating speed `[1, max(piles)]`, and the greedy check counts hours.
3. **LeetCode 410 (Split Array Largest Sum):** (This current problem). 
4. **LeetCode 1482 (Minimum Number of Days to Make m Bouquets):** Search space is the range of days, greedy check counts adjacent blooming flowers.
All follow the exact "Binary Search on Answer + Greedy Validation" template.