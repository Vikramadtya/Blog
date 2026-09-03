---
tags:
  - cc
  - binary-search
  - greedy
---

# Split Array - Largest Sum

## Question

Given an integer array $a$ of size $n$ and an integer $k$. We need to split the array into $k$ non-empty contiguous subarrays. The goal is to minimize the largest sum among these $k$ subarrays. 

Return the value $x$, where $x$ is the minimum possible "maximum subarray sum."

## Solution

### Pattern

**Binary Search on Answer Space**
When the problem asks to "Minimize the Maximum" or "Maximize the Minimum" of a value, and the possibility of achieving that value is monotonic (if $x$ works, $x+1$ also works), we binary search the answer directly.

### How to Identify

- **Optimization Goal:** Keywords like "minimized largest" or "maximized smallest."
- **Contiguous Constraints:** The splits must be in order (subarrays, not subsets).
- **Feasibility Check:** It is easy ($O(n)$) to check if a specific "max sum" can be achieved using $k$ or fewer splits.

### Description

Step-by-step explanation:

- **Define the Search Space:**
    - The minimum possible "largest sum" is the value of the largest element in the array ($low = \max(a)$).
    - The maximum possible "largest sum" is the sum of all elements ($high = \sum a$).
- **The Binary Search:**
    - Pick a middle value `mid` from the range $[low, high]$.
    - Treat `mid` as the maximum capacity allowed for any subarray.
- **Greedy Validation (The Predicate):**
    - Iterate through the array and accumulate a current sum.
    - If adding the next element exceeds `mid`, start a new subarray (increment `count`) and reset the current sum to that element.
- **Decision Choice:**
    - If the number of subarrays required is $\le k$, then `mid` is a potential answer. Try smaller values ($high = mid - 1$).
    - If we need more than $k$ subarrays, `mid` is too small. Try larger values ($low = mid + 1$).



### The Intuition

Imagine you have a series of boxes and you want to pack them into $k$ trucks. You want to make sure the heaviest truck is as light as possible. 
- If you set a weight limit too low, you will need more than $k$ trucks.
- If you set it very high, you only need 1 truck, but it will be very heavy. 
We use Binary Search to find the "sweet spot"—the lowest weight limit that still allows us to use exactly $k$ (or fewer) trucks.



### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n \cdot \log(\sum a - \max a))$ | $O(n \cdot \log(\sum a - \max a))$ |
| Space Complexity | $O(1)$          | $O(1)$           |

#### Time Complexity
The search space is the sum of the array. Binary search takes $\log(Sum)$ steps. In each step, we traverse the array once ($O(n)$). Total time: $O(n \cdot \log(Sum))$.

#### Space Complexity
Only a constant amount of extra space is used for pointers and sum variables. No recursion stack is involved.

### Code

```java
class Solution {
    public int largestSubarraySumMinimized(int[] a, int k) {
        // Range: [max element, total sum]
        long low = 0;
        long high = 0;
        for (int num : a) {
            low = Math.max(low, num);
            high += num;
        }

        long ans = high;
        while (low &lt;= high) {
            long mid = low + (high - low) / 2;
            
            if (getRequiredSubarrays(a, mid) &lt;= k) {
                ans = mid;
                high = mid - 1; // Try to minimize the maximum further
            } else {
                low = mid + 1; // Limit too small, need more capacity
            }
        }
        return (int) ans;
    }

    private int getRequiredSubarrays(int[] a, long limit) {
        int count = 1; // Start with the first subarray
        long currentSum = 0;

        for (int num : a) {
            if (currentSum + num &gt; limit) {
                // Cannot fit in current subarray, start a new one
                count++;
                currentSum = num;
            } else {
                currentSum += num;
            }
        }
        return count;
    }
}
```

## Caveats

- **Integer Overflow:** The sum of elements can easily exceed $2^{31}-1$. Always use `long` for `low`, `high`, and `mid`.
- **$k &gt; n$:** If $k$ is greater than the number of elements, it's impossible to split into $k$ non-empty subarrays. Your code should handle this (usually returns -1 or based on problem specs).
- **Non-positive values:** If the array has negative numbers, the greedy check fails because the sum is no longer monotonic.

## Concepts to Think About

- **Binary Search on Answer:** This is a meta-pattern. You aren't searching the input; you're searching the *solution space*.
- **Greedy + BS:** Notice how the problem combines two paradigms.
- **Related Problems:** - Capacity to Ship Packages Within D Days
    - Koko Eating Bananas
    - Book Allocation Problem
    - Painter's Partition Problem

## Logical Follow-up

Question: What if the order of elements can be changed? (Subsets instead of Subarrays)
Solution: The problem becomes NP-Hard (equivalent to the Bin Packing problem or Partition problem). You would need to use Backtracking or Dynamic Programming with Bitmasking, which only works for very small $n$ (usually $n &lt; 20$).

Question: How would you modify this to find the split points?
Solution: Once you find the optimal `mid`, run the `getRequiredSubarrays` logic one last time and record the indices where `currentSum + num &gt; limit` occurs.
