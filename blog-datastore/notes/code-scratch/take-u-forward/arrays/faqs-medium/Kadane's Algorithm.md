---
tags:
  - arrays
  - dynamic-programming
  - kadanes-algorithm
---

# Maximum Subarray

## Question

Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum, and return its sum.

## Solution

### Pattern

**Kadane's Algorithm (1D Dynamic Programming)**
At each index, determine the maximum subarray sum ending at that index by choosing to either append the current element to the previous subarray sum, or start a new subarray at the current element.

### How to Identify

- The problem asks for a maximum/minimum metric related to a **contiguous subarray**.
- The array contains a mix of positive and negative numbers.
- A brute force $O(N^2)$ solution is obvious, hinting at an $O(N)$ optimization.

### Description

Step-by-step explanation:

1. Initialize two trackers: `currSum` (the max subarray sum ending at the current index) and `maxSum` (the global max found so far). Set both to the first element in the array.
2. Iterate through the array starting from the second element (index 1).
3. At every element, make a decision: 
   - Is it better to add this element to the running `currSum`?
   - Or is the running `currSum` so negative that it's better to just start a completely new subarray with the current element?
4. This is captured by: `currSum = max(nums[i], currSum + nums[i])`.
5. Update `maxSum` if the newly calculated `currSum` is the highest we've seen so far.
6. Return `maxSum` after the loop finishes.

### The Intuition

Think of negative subarray sums as "debt."
If you are walking through an array accumulating a sum, positive numbers are income, and negative numbers are expenses. If your total running sum drops below zero, you are in debt. 
If you continue to the next element, carrying that debt will only drag down whatever number comes next. You are mathematically better off "declaring bankruptcy," dropping the previous sequence, and starting fresh from the current element—even if the current element is also negative (since a smaller debt is better than a larger debt).

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We traverse the array of size $N$ exactly once. Each step does a constant amount of work (basic arithmetic and comparisons). Thus, the time complexity is strictly $O(N)$.

#### Space Complexity

We only allocate two integer variables (`currSum` and `maxSum`). The space requirement does not scale with the input size $N$, yielding $O(1)$ auxiliary space.

### Code

```java
class Solution {
    public int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array must not be empty");
        }

        int currSum = nums[0];
        int maxSum = nums[0];

        // Start from index 1 since we initialized with index 0
        for (int i = 1; i < nums.length; i++) {
            // Core Kadane's logic: 
            // Is it better to extend the old subarray, or start a new one?
            currSum = Math.max(nums[i], currSum + nums[i]);
            
            // Keep track of the highest sum seen overall
            maxSum = Math.max(maxSum, currSum);
        }

        return maxSum;
    }
}
```

## Caveats

- **Returning Indices:** If the interviewer asks for the *start and end indices* of the maximum subarray, this pure variable implementation is not enough. You must add tracker variables (e.g., `tempStart`, `bestStart`, `bestEnd`) that update whenever a new subarray is started or a new `maxSum` is found.
- **Empty Arrays:** The algorithm mathematically requires at least one element to be well-defined. Always check bounds.

## Concepts to Think About

- **DP State Compression:** This is a classic example of space-optimized DP. The actual DP relation is $DP[i] = \max(nums[i], DP[i-1] + nums[i])$. Because we only ever need $DP[i-1]$ to compute $DP[i]$, we compress the $O(N)$ array into a single $O(1)$ variable (`currSum`).
- **All Negative Arrays:** Kadane's handles arrays of entirely negative numbers perfectly. It simply prevents accumulation, picking the "least negative" single element.
- **Divide and Conquer:** The problem can also be solved by dividing the array in half and finding the max in the left, max in the right, and max crossing the middle. While $O(N \log N)$ (or $O(N)$ with optimization), it is vital to know this approach as it forms the basis for Segment Trees.
- Return Indices: How would you modify this to return the start and end indices of the subarray? (Hint: Track tempStart whenever currSum resets).
- The All-Negative Case: Why does the order of maxSum update and currSum &lt; 0 check matter?
- 2D Extension: How would you find the maximum sum rectangle in a 2D matrix? (Hint: It involves running Kadane's on columns).

## Logical Follow-up

**Question:** What if the array is circular? (e.g., the end of the array connects to the beginning).

**Solution:** This is the **Maximum Circular Subarray** problem. The max subarray could either be a standard contiguous subarray (which we find with standard Kadane's) OR a subarray that wraps around the ends. A wrap-around max subarray is mathematically equivalent to the total sum of the array *minus* the minimum contiguous subarray. We run Kadane's twice: once for the max sum, once for the min sum. The result is $\max(\text{max\_sum}, \text{total\_sum} - \text{min\_sum})$. (Edge case: if all numbers are negative, just return the standard max_sum).

**Question:** What if we wanted to find the maximum *product* subarray instead of the sum?

**Solution:** This introduces a complication: multiplying two negative numbers yields a positive number. Therefore, a very small negative number (e.g., -100) could suddenly become the maximum if multiplied by another negative. To solve this, we must track *both* the running maximum product and the running minimum product at each step, swapping them if the current element is negative.


**Question:** "The current code only returns the sum. Can you modify it to return the actual subarray or at least the `[start, end]` indices of that subarray?"

**Solution:** You need three extra variables: `start`, `end`, and `tempStart`. 
1.  Initialize all to `0`. 
2.  Whenever you reset `currSum = 0`, set `tempStart = i + 1`. 
3.  Whenever you update `maxSum`, update `start = tempStart` and `end = i`.



