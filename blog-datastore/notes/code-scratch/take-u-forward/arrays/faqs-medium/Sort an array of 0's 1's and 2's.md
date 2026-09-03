---
tags:
  - arrays
  - two-pointers
  - sorting
---

# Sort Colors (Dutch National Flag)

## Question

Given an array $nums$ of size $n$ containing only integers 0, 1, and 2 (representing colors red, white, and blue), sort them in-place so that identical colors are adjacent and the overall order is 0, 1, 2. Do not use library sort functions.

## Solution

### Pattern

**Three Pointers (Dutch National Flag)**
Maintain three boundaries to segment the array into four regions: 0s, 1s, unknown, and 2s. Shrink the unknown region by evaluating and swapping elements into their correct segments in a single pass.

### How to Identify

- The array contains a very strictly limited set of distinct elements (e.g., 3 unique values).
- The problem demands an in-place sort ($O(1)$ space).
- The problem demands a strict linear ($O(N)$) time complexity.
- Often phrased as categorizing data into strict "low, mid, high" buckets.

### Description

We partition the array dynamically using three pointers: `low`, `mid`, and `high`.

1. Initialize `low = 0`, `mid = 0`, and `high = nums.length - 1`.
2. Iterate through the array using `mid` as the active explorer pointer while `mid &lt;= high`.
3. **If `nums[mid] == 0`**: We need this at the front. Swap it with `nums[low]`. Since both the new `low` and `mid` values are now correctly placed, increment both `low` and `mid`.
4. **If `nums[mid] == 2`**: We need this at the back. Swap it with `nums[high]`. Decrement `high`. *Crucially, do not increment `mid` yet*, because the element we just swapped from `high` into `mid` is un-evaluated and could be a 0, 1, or 2.
5. **If `nums[mid] == 1`**: It is already in the correct middle section. Just increment `mid`.
6. Once `mid &gt; high`, the unknown section is empty, and the array is fully sorted.

### The Intuition

Think of this as managing strict "territories" with an active "surveyor". 

- `[0 to low-1]` is strictly territory for 0s.
- `[low to mid-1]` is strictly territory for 1s.
- `[high+1 to n-1]` is strictly territory for 2s.
- `[mid to high]` is unexplored territory.

Our surveyor (`mid`) steps through the unexplored territory. When it finds a 0, it throws it over to the 0 territory (swaps with `low`). When it finds a 2, it throws it back to the 2 territory (swaps with `high`). When it finds a 1, it just walks past it, organically growing the 1 territory. 

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

$O(N)$. At each step of the loop, either `mid` increases or `high` decreases. This means the gap between `mid` and `high` shrinks by exactly 1 every time. The loop runs at most $N$ times.

#### Space Complexity

$O(1)$. We are only modifying the array in-place and utilizing three integer variables for our pointers.

### Code

```java
class Solution {
    public void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        
        while (mid &lt;= high) {
            if (nums[mid] == 0) {
                // Throw 0 to the front
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 2) {
                // Throw 2 to the back
                swap(nums, mid, high);
                high--;
                // Don't increment mid; the swapped value needs evaluation
            } else {
                // 1 is in the right place, move forward
                mid++;
            }
        }
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

## Caveats

- When `K Colors &gt; 3`: The Dutch National Flag algorithm scales poorly when the number of distinct elements (`K`) increases past `3` or `4`, as you'd need an increasing number of partition pointers and complex `if-else` logic.

- Cache Locality: Swapping elements from opposite ends of a massive array can cause cache misses. For extremely large arrays, a two-pass counting sort might benchmark faster strictly due to sequential memory access patterns, despite doing two passes.


## Concepts to Think About

- Loop Invariants: This problem is the canonical example of loop invariants. Before the loop, during the loop, and after the loop, the rules of the partition boundaries (`[0, low-1] == 0`, etc.) are never violated.
- Counting Sort Comparison: A two-pass approach counting frequencies of `0`,`1`,`2` and rewriting the array is extremely easy to write. DNF is preferred specifically because it saves `O(N)` memory writes (which are expensive hardware operations).
- Branch Prediction: The `if/else` logic can suffer from branch misprediction penalties if the array is heavily randomized.
- Sequence Points & Code Readability: Avoid embedding pre/post increments (`++i`) inside method calls (`swap(nums, ++i, j--)`). It reduces readability and increases the chance of off-by-one errors during refactoring.
- Stability: Is this algorithm stable? (Hint: No. Swapping mid and high can change the relative order of two 2s).
- Multi-Value Partitioning: How would you adapt this for 4 or 5 colors? (Hint: You'd need k−1 pointers, but the logic becomes increasingly complex).
- Quicksort Connection: This three-way partition is exactly what makes QuickSort efficient when there are many duplicate keys.


### Logical Follow-up

**Question:** How would you solve this if there were `K` different colors instead of `3`, and you still wanted to sort them optimally?

**Solution:** If `K` is reasonably small, we should pivot to a Counting Sort. We do one pass to populate an integer array `counts` of size `K` to store frequencies. We do a second pass to overwrite `nums` based on those frequencies. This is `O(N)` time and `O(K)` space. If we strictly needed `O(1)` space and `K` was large, we would have to fall back to a standard in-place sorting algorithm like Heapsort, yielding `O(NlogN)` time.


**Question:** "What if the array only contained **0s and 1s**? How would you simplify your current logic?"

**Solution:** This becomes a standard **Two-Pointer** partition (like the first step of QuickSort).

* You'd use a `left` and `right` pointer. 
* While `left < right`, if `nums[left] == 1` and `nums[right] == 0`, swap them.
* Increment `left` if it's 0, and decrement `right` if it's 1.

