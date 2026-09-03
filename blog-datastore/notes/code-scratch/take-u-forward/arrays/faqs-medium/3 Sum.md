---
tags:
  - arrays
  - two-pointers
  - sorting
---

# 3Sum

## Question

Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` such that $i \neq j \neq k$, and $nums[i] + nums[j] + nums[k] == 0$. The solution set must not contain duplicate triplets.

## Solution

### Pattern

**Sort + Fix One + Two Pointers**
Sort the array first. Iterate through the array, fixing one number as the "target". Then, use a two-pointer approach (left and right) on the remaining subarray to find pairs that sum to the negated target. 

### How to Identify

- The problem asks for **triplets** (or combinations of a fixed size) that satisfy a sum constraint.
- The prompt explicitly forbids **duplicate triplets**, strongly hinting that sorting is required to group identical elements.
- The array is unsorted and returning *values* (not original indices) is required, giving you permission to destroy the original ordering by sorting it.

### Description

Step-by-step explanation:

1. **Sort:** Sort the input array in ascending order. This takes $O(N \log N)$ time but is essential for duplicate skipping and the two-pointer technique.
2. **Iterate (Fixing $i$):** Use a `for` loop to fix the first element `nums[i]`.
   - *Optimization:* If `nums[i] > 0`, break the loop. Since the array is sorted, all subsequent numbers are also positive, making it impossible to sum to 0.
   - *Deduplication:* If `i > 0` and `nums[i] == nums[i-1]`, `continue`. We have already calculated all triplets starting with this number.
3. **Two Pointers:** Set `j = i + 1` (left pointer) and `k = nums.length - 1` (right pointer).
4. **Search:** While `j &lt; k`:
   - Calculate `sum = nums[i] + nums[j] + nums[k]`.
   - If `sum == 0`, we found a valid triplet. Add it to the result list.
   - Advance both pointers (`j++`, `k--`). 
   - *Deduplication:* Use `while` loops to continue advancing `j` and decreasing `k` as long as they point to the exact same values they just processed.
   - If `sum &lt; 0`, the total is too small. Because the array is sorted, we must increase our sum by moving the left pointer right (`j++`).
   - If `sum &gt; 0`, the total is too large. We must decrease our sum by moving the right pointer left (`k--`).

### The Intuition

Think of this as reducing a complex 3D problem into a solvable 2D problem. 
Finding three numbers that sum to $0$ ($A + B + C = 0$) is mathematically identical to finding two numbers that sum to $-A$ ($B + C = -A$). 
By sorting the array and iterating through it one by one, we lock in $A$. Once $A$ is locked, the remaining unsorted portion of the array to its right is just a standard "2Sum II" problem (finding two numbers in a sorted array that equal a target), which is elegantly solved using opposing pointers shrinking a window.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^2)$       | $O(N^2)$         |
| Space Complexity | $O(\log N)$    | $O(\log N)$      |

#### Time Complexity

Sorting takes $O(N \log N)$. The outer loop runs $N$ times. Inside, the `while` loop processes the remaining elements in linear time $O(N)$. Thus, total time is $O(N \log N + N^2) = O(N^2)$.

#### Space Complexity

While we do not allocate significant auxiliary data structures (excluding the output list), sorting algorithms (like Java's Dual-Pivot Quicksort) require $O(\log N)$ recursive stack space. 

### Code

```java
class Solution {
    public List&lt;List<Integer&gt;&gt; threeSum(int[] nums) {
        if (nums == null || nums.length &lt; 3) return new ArrayList&lt;&gt;();

        Arrays.sort(nums);
        List&lt;List<Integer&gt;&gt; res = new ArrayList<>();

        for (int i = 0; i &lt; nums.length - 2; i++) {
            // Since array is sorted, if the smallest number is positive, sum cannot be 0
            if (nums[i] &gt; 0) break;
            
            // Skip duplicates for the first element
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            int j = i + 1;
            int k = nums.length - 1;

            while (j &lt; k) {
                int sum = nums[i] + nums[j] + nums[k];

                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[j], nums[k]));
                    j++;
                    k--;
                    
                    // Skip duplicates for the second element
                    while (j &lt; k && nums[j] == nums[j - 1]) j++;
                    // Skip duplicates for the third element
                    while (j < k && nums[k] == nums[k + 1]) k--;
                    
                } else if (sum &gt; 0) {
                    k--; 
                } else {
                    j++; 
                }
            }
        }
        return res;
    }
}
```

## Caveats

- **Hash Map vs Two Pointers:** You *could* solve 3Sum using a Hash Map (like 1D Two Sum) to achieve $O(N^2)$ time. However, Hash Maps do not naturally handle duplicate grouping. Ensuring unique triplets with a Hash Map requires placing results in a `HashSet&lt;List<Integer&gt;&gt;`, causing massive overhead and making the Space Complexity $O(N^2)$. Sorting + Two Pointers is strictly superior here.
- **Integer Overflow:** If the target isn't 0 and the array contains large numbers, `nums[i] + nums[j] + nums[k]` could overflow a 32-bit integer. Cast to `long` or subtract from the target instead.

## Concepts to Think About

- **Generalization (k-Sum):** This logic forms the basis of the generalized $k$-Sum algorithm. A 4Sum problem is just $O(N^3)$ where you run two outer loops to fix $A$ and $B$, and then run 2-pointer on $C$ and $D$. You recursively reduce $k$-Sum down to 2-Sum.
- **Deduplication Mechanics:** Note how duplicates are skipped *after* processing a valid pair, but skipped *before* processing the fixed `i`. This is crucial. If you skip `i` duplicates incorrectly, you might miss a valid `[0, 0, 0]` triplet.
- **Why Sort? :** Sorting allows us to use the Two-Pointer technique. Without sorting, we would need a HashSet and would struggle significantly with duplicate triplet detection.
- **The "Skip" Logic:** Why do we check `nums[i] == nums[i-1]` but `nums[j] == nums[j+1]`? (It depends on the direction of pointer movement to ensure we don't skip the first instance of a valid number).
- **3Sum Closest:** How would you modify this if you needed to find the triplet sum closest to a target? (Hint: Maintain a minDiff variable).
- **Memory Management:** In a very large array, `List&lt;List&lt;Integer&gt;&gt;` creates many small objects. If returning a 2D primitive array `int[][]` would be more memory-efficient.



## Logical Follow-up

Question: How would you solve 3Sum if the problem required you to return the original indices instead of the values?
Solution: You cannot sort the array directly because sorting destroys the original indices. You must create an array of objects or pairs (e.g., `int[][] pairs = new int[n][2]`, storing `[value, index]`), sort *that* array, and then apply the same two-pointer logic. Space complexity degrades to $O(N)$.

Question: What if the problem was "3Sum Smaller" (Find the number of triplets whose sum is strictly less than a target)?
Solution: We use the exact same Sort + Two Pointer approach. When `sum &lt; target`, we know that fixing `j` and pairing it with *any* element between `j` and `k` will also be `< target` (because the array is sorted). So we add `k - j` to our count, and increment `j`. If `sum &gt;= target`, we decrement `k`. Time: $O(N^2)$, Space $O(1)$.
