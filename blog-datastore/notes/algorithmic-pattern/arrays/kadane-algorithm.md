# Kadane’s Algorithm

An efficient technique used to find the **maximum sum of a contiguous subarray** within a given array of numbers. Its beauty lies in its simplicity and its ability to solve the maximum subarray sum problem in **linear time complexity** $$\text{O}(n)$$



## Algorithm

The algorithm works by maintaining two variables:

1. **max\_ending\_here**: the maximum sum contiguous subarray ending at the current position.
2. **max\_so\_far**: the maximum sum of contiguous subarray found so far.



&#x20;The key insight is that maximum subarray ending at each position is either:

* The current element itself, or
* The current element plus the maximum subarray ending at the previous position



### Steps

1. Initialize both `max_ending_here` and `max_so_far` with the first element of the array.
2. Iterate through the array starting from the second element:
3. For each element, update `max_ending_here`:
   * If adding the current element to `max_ending_here` results in a larger sum, keep the sum.
   * Otherwise, start a new subarray from the current element.
4. Update `max_so_far` if `max_ending_here` is greater.
5. After the iteration, `max_so_far` will contain the maximum subarray sum.



## Code&#x20;

### **Complexity**

**Time complexity:** O(n), we make only one iterations through the array.\
**Space complexity:** O(1), only two variables.

## **Practice Problems**

<table><thead><tr><th width="578">Name</th><th width="89">Level</th><th data-type="content-ref">Link</th></tr></thead><tbody><tr><td>Maximum Product Subarray</td><td></td><td></td></tr><tr><td>Maximum Sum Increasing Subsequence (MSIS)</td><td></td><td></td></tr><tr><td>Longest Continuous Increasing Subsequence (LCIS)</td><td></td><td></td></tr><tr><td>Max Consecutive ones.</td><td></td><td></td></tr><tr><td>Maximum Circular Subarray Sum</td><td></td><td></td></tr><tr><td>Maximum Sum Rectangle</td><td></td><td></td></tr><tr><td>Largest Sum Contiguous Subarray with at least K numbers</td><td></td><td></td></tr><tr><td>Flip Bits</td><td></td><td></td></tr></tbody></table>



## Reference&#x20;

* [Kadane’s Algorithm: Mastering the Maximum Subarray Problem](https://algocademy.com/blog/kadanes-algorithm-mastering-the-maximum-subarray-problem/)

\
\
