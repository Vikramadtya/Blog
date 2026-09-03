---
tags:
  - binary-search
  - arrays
---

# Find Minimum in Rotated Sorted Array

## Question

Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Given this rotated array `nums` of **unique** elements, return the minimum element of this array. The algorithm must run in $O(\log n)$ time.

## Solution

### Pattern

**Binary Search (Pivot Identification via Right Boundary)**
In a rotated sorted array, the relationship between the `mid` element and the `right` element dictates exactly where the minimum lies. We use a `while (left &lt; right)` template to squeeze the boundaries until they converge on the minimum.

### How to Identify

- The array is explicitly stated to be **sorted and rotated**.
- The problem requires $O(\log N)$ time, demanding binary search.
- You are looking for the absolute minimum, which corresponds to the "pivot" point where the rotation wrapped the largest numbers to the left of the smallest numbers.

### Description

Step-by-step explanation:

1. Initialize `left = 0` and `right = nums.length - 1`.
2. Loop strictly while `left &lt; right`. We do not use `<=` because we want the pointers to converge exactly on the answer.
3. Calculate `mid = left + (right - left) / 2` to avoid integer overflow.
4. Compare `nums[mid]` against `nums[right]`. There are exactly two scenarios because all elements are unique:
   - **Scenario A (`nums[mid] &gt; nums[right]`):** The array from `mid` to `right` is "broken" or unsorted. Because the original array was ascending, a larger number appearing before a smaller number means the "wrap around" (the minimum) happened *after* `mid`. We discard the left half by setting `left = mid + 1`.
   - **Scenario B (`nums[mid] &lt; nums[right]`):** The array from `mid` to `right` is perfectly sorted. Because it is perfectly sorted, the minimum element in that specific range is `nums[mid]`. Therefore, the absolute minimum of the entire array must either be `mid` itself, or it is somewhere to the left of `mid`. We discard the right half by setting `right = mid`. (We do not do `mid - 1` because `mid` is still a valid candidate).
5. When the loop terminates, `left` will equal `right`, pointing precisely at the minimum element. Return `nums[left]`.

### The Intuition

Imagine a broken clock face unrolled into a line. You expect numbers to go $1, 2, 3 \dots 12$. Instead, because it's rotated, you see $9, 10, 11, 12, 1, 2, 3$. 
You pick a random spot in the middle, say $12$. You look at the very end of the line, which is $3$. 
Because $12 &gt; 3$, you know the sequence "broke" and restarted somewhere between you and the end. The restart point (the minimum, $1$) *must* be to your right. 
If instead you picked $2$, and you look at the end and see $3$. Because $2 &lt; 3$, that section is perfectly normal. The break (the minimum) must have happened somewhere to your left, or you might actually be standing on it right now.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved in every iteration of the `while` loop. For an array of size $N$, this takes at most $\log_2(N)$ iterations. 

#### Space Complexity

The algorithm operates entirely in place using only three integer variables (`left`, `right`, `mid`), requiring strictly $O(1)$ auxiliary space.

### Code

```java
class Solution {
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) return -1;

        int left = 0;
        int right = nums.length - 1;

        // Loop until left and right converge on the single minimum element
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] &gt; nums[right]) {
                // The right half is unsorted (it contains the pivot dip)
                // The minimum MUST be strictly to the right of mid
                left = mid + 1;
            } else {
                // The right half is perfectly sorted. 
                // The minimum could be mid itself, or somewhere to its left.
                right = mid;
            }
        }

        // When left == right, we have found the minimum
        return nums[left];
    }
}
```

## Caveats

- **Comparing to `left` instead of `right`:** A common mistake is trying to compare `nums[mid]` to `nums[left]`. This logic fails when the array is *not* rotated (e.g., `[1, 2, 3, 4]`). In this case, `nums[mid] &gt; nums[left]` is true, which usually indicates the left is sorted and you should look right, but looking right skips the minimum (`1`). Comparing `mid` to `right` safely handles both rotated and perfectly sorted arrays.
- **`while (left &lt;= right)` Trap:** If you use `<=` and `right = mid - 1`, the logic becomes incredibly convoluted because you might accidentally jump over the minimum element. The `[left, right]` convergence pattern (`left < right` with `right = mid`) is structurally superior for finding pivots.

## Concepts to Think About

- **Graphing the Array:** If you plot the values of a rotated sorted array on a graph, it forms two distinct, parallel increasing lines. The minimum is simply the lowest point on the Y-axis. The condition `nums[mid] &gt; nums[right]` mathematically confirms that `mid` is on the higher line, and the right bound is on the lower line.
- **System Design Parity:** This exact logic is useful for finding the newest/oldest entry in a circular buffer (ring buffer) where a head pointer has wrapped around.
- Why compare to right and not left? If you compare mid to left, the "fully sorted" case (0 rotations) becomes an edge case you have to handle separately. Comparing to right handles both rotated and non-rotated arrays with the same logic.
- The `right = mid` vs `left = mid + 1` logic: When `nums[mid]&lt;nums[right]`, `mid` could be the minimum itself, so we keep it. When `nums[mid]&gt;nums[right]`, `mid` is definitely part of the "high" side, so we discard it.
- Duplicates: If the array had duplicates, would this remain O(logn)? (No, we'd need to handle nums[mid]==nums[right] linearly).


## Logical Follow-up

**Question:** What if the array contains duplicate elements? (LeetCode 154: Find Minimum in Rotated Sorted Array II)

**Solution:** If duplicates exist, you can hit a scenario where `nums[mid] == nums[right]`. For example, `[3, 3, 1, 3]`. You cannot mathematically determine if the minimum is to the left or the right because the pivot could be trapped between identical values. In this case, you can only safely eliminate the `right`most element itself, because even if `right` was the minimum, `mid` shares the exact same value. You do `right--`. Because you shrink the window by 1, the worst-case time complexity degrades to $O(N)$ (e.g., an array of all identical elements).

**Question:** "What happens if the array is rotated $N$ times (making it effectively sorted)? Does your binary search logic still work, or does it return an incorrect index?"

**Answer:** It still works! If the array is sorted, $nums[mid]$ will always be less than $nums[right]$, causing the `right` pointer to move left until it reaches `0`. The loop will terminate at `left = 0`, which is the correct minimum.

**Question (Find the K-th Smallest Element):** "You've successfully found the minimum element in $O(\log n)$. Now, can you find the **k-th smallest element** in the same rotated sorted array (distinct values) in $O(1)$ *additional* time after finding the minimum?"

**Answer:**

1.  **Find the Pivot:** First, use the $O(\log n)$ algorithm above to find the index of the minimum element, let's call it `pivot`.
2.  **Virtual Index Mapping:** A rotated sorted array is just a regular sorted array that has been **offset**.
3.  **The Formula:** The $k$-th smallest element ($0$-indexed) in a sorted array is at index $k$. In a rotated array, that element is at:
    $$\text{TargetIndex} = (\text{pivot} + k) \pmod N$$.
4.  **Result:** You return `nums[TargetIndex]`.


