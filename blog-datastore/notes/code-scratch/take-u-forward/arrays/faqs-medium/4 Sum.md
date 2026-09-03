---
tags:
  - arrays
  - two-pointers
  - sorting
---

# 4Sum

## Question

Given an array `nums` of $n$ integers, return an array of all unique quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that the four indices are distinct and their corresponding values sum exactly to `target`.

## Solution

### Pattern

**Sort + Fix Two + Two Pointers (Generalized $k$-Sum)**
Sort the array. Use nested loops to mathematically fix the first two elements. Reduce the remaining unsorted portion to a standard "2Sum II" problem, solving it with opposing pointers (left and right).

### How to Identify

- The problem asks for exact combinations of a fixed size ($k=4$) that satisfy a sum constraint.
- The prompt strictly forbids **duplicate combinations**, strongly hinting at sorting.
- The need to return *values* rather than original indices allows you to sort the array without penalty.

### Description

Step-by-step explanation:

1. **Sort:** Sort the input array in ascending order. This enables both duplicate skipping and the two-pointer directional logic.
2. **Fix $i$ (Outer Loop):** Iterate $i$ from $0$ to $n-3$. 
   - Skip if `nums[i] == nums[i-1]` to prevent duplicate quadruplets.
   - *Prune:* If $nums[i] + \text{next 3 elements} > target$, break. The current and all future numbers are too large.
   - *Prune:* If $nums[i] + \text{last 3 elements} &lt; target$, continue. $nums[i]$ is too small to ever reach the target.
3. **Fix $j$ (Inner Loop):** Iterate $j$ from $i+1$ to $n-2$.
   - Skip if `nums[j] == nums[j-1]` (ensure $j &gt; i+1$).
   - Apply similar pruning logic tailored for $j$ and the remaining 2 elements.
4. **Two Pointers:** Set $left = j + 1$ and $right = n - 1$.
5. **Search:** While $left &lt; right$:
   - Calculate `sum = nums[i] + nums[j] + nums[left] + nums[right]`. **(Use `long` to prevent overflow!)**
   - If `sum == target`, record the quadruplet, move both pointers inward, and use `while` loops to skip any duplicate values for `left` and `right`.
   - If `sum &lt; target`, increment `left`.
   - If `sum &gt; target`, decrement `right`.

### The Intuition

This is the logical extension of the 3Sum problem. 
If 3Sum reduces a 3D problem into a 2D problem by fixing one variable, 4Sum reduces a 4D problem into a 2D problem by fixing *two* variables. 
By sorting the array, we create a landscape where we can methodically lock in the first two numbers ($A$ and $B$). Once locked, we only need to find two numbers ($C$ and $D$) that equal $(Target - A - B)$. Because the remaining array is sorted, we can elegantly find $C$ and $D$ using a sliding window of opposing pointers. The sorting also allows us to mathematically prove when to stop searching entirely (pruning).

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^3)$       | $O(N^3)$         |
| Space Complexity | $O(\log N)$    | $O(\log N)$      |

#### Time Complexity

Sorting takes $O(N \log N)$. Fixing $i$ takes $O(N)$. Fixing $j$ takes $O(N)$. The `while` loop processes the remaining elements in $O(N)$. The total time is $O(N \log N + N^3)$, which mathematically simplifies to $O(N^3)$.

#### Space Complexity

We do not allocate auxiliary data structures. However, sorting algorithms (like Java's Quicksort variant) require $O(\log N)$ to $O(N)$ recursive stack space depending on the array's initial state.

### Code

```java
class Solution {
    public List&lt;List<Integer&gt;&gt; fourSum(int[] nums, int target) {
        if (nums == null || nums.length &lt; 4) return new ArrayList&lt;&gt;();
        
        Arrays.sort(nums);
        List&lt;List<Integer&gt;&gt; res = new ArrayList<>();
        int n = nums.length;
        
        for (int i = 0; i &lt; n - 3; i++) {
            if (i &gt; 0 && nums[i] == nums[i - 1]) continue; // Deduplicate i
            
            // Mathematical Pruning
            if ((long) nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
            if ((long) nums[i] + nums[n - 1] + nums[n - 2] + nums[n - 3] &lt; target) continue;
            
            for (int j = i + 1; j &lt; n - 2; j++) {
                if (j &gt; i + 1 && nums[j] == nums[j - 1]) continue; // Deduplicate j
                
                // Mathematical Pruning
                if ((long) nums[i] + nums[j] + nums[j + 1] + nums[j + 2] &gt; target) break;
                if ((long) nums[i] + nums[j] + nums[n - 1] + nums[n - 2] < target) continue;
                
                int left = j + 1;
                int right = n - 1;
                
                while (left < right) {
                    long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];
                    
                    if (sum == target) {
                        res.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));
                        left++;
                        right--;
                        
                        while (left < right && nums[left] == nums[left - 1]) left++;
                        while (left < right && nums[right] == nums[right + 1]) right--;
                    } else if (sum < target) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }
        
        return res;
    }
}
```

## Caveats

- **Integer Overflow:** A massive trap in this problem. The sum of four 32-bit integers can easily exceed `Integer.MAX_VALUE`. You **must** cast the first element to `long` during the sum calculation to force Java to promote the entire addition to 64-bit space.
- **Hash Map Sub-optimality:** You can technically achieve average $O(N^2)$ time by calculating all pairs $A+B$ and storing them in a Hash Map, then doing a second pass to find pairs $C+D = Target - (A+B)$. However, deduplicating the results is a nightmare, requiring a `HashSet` of sorted strings or lists, which causes massive constant-factor overhead and $O(N^2)$ space complexity. For strict deduplication, Sort + Two Pointers is the enterprise standard.

## Concepts to Think About

- **Recursion for $k$-Sum:** This code structure scales to 5Sum, 6Sum, etc., but writing $k-2$ nested loops manually is bad engineering. For a generic $k$-Sum problem, you should write a recursive function that fixes one variable and calls $(k-1)$-Sum, bottoming out at the 2Sum Two-Pointer logic.
- **Pruning Power:** The early exit `if` statements might look like premature optimization, but on LeetCode's skewed test cases, they can reduce an $O(N^3)$ algorithm's real-world runtime from 20ms to 2ms.
- **Overflow:** Always use `long` when summing multiple integers in a target problem.
- **Generalization:** Could you write a generic kSum function that uses recursion to handle any k?
- **The Two-Pointer Direction:** Why does left++ increase the sum and right-- decrease it? (Only because the array is sorted).

## Logical Follow-up

**Question:** How would you solve 4Sum II (Given four integer arrays `nums1, nums2, nums3, nums4`, return the number of tuples `(i, j, k, l)` such that `nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0`)?

**Solution:** Because the elements come from four *separate* arrays, deduplication is based on indices, not values. We can group the arrays into two pairs. We compute all possible sums of `nums1[i] + nums2[j]` and store their frequencies in a Hash Map. Then, we compute all possible sums of `nums3[k] + nums4[l]`. For each sum, we check if its negation exists in the Hash Map and add the frequency to our total count. Time: $O(N^2)$, Space: $O(N^2)$.

**Question:** "How would you implement a general `kSum(int[] nums, int target, int k)` function?"

**Solution:** Use recursion.
1. **Base Case:** If $k = 2$, use the Two-Pointer approach ($O(n)$).
2. **Recursive Step:** Iterate from `start` to `end`. For each element, call `kSum` for the sub-problem: `kSum(nums, target - nums[i], k - 1)`.
3. Remember to skip duplicates at every level of the recursion.
4. 




