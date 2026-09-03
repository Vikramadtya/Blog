---
tags:
  - binary-search
  - arrays
---

# Search in Rotated Sorted Array

## Question

Given an integer array `nums` sorted in ascending order (with distinct values) that has been rotated at an unknown pivot index, and a `target` integer, return the index of `target` if it exists, or `-1` if it does not. The algorithm must run in $O(\log n)$ time.

## Solution

### Pattern

**Modified Binary Search (Sorted Half Identification)**
In any rotated sorted array, if you pick a middle index, at least one half of the array (either `left` to `mid`, or `mid` to `right`) is guaranteed to be perfectly sorted. Identify the sorted half, check if the target lies within its bounds, and discard half the search space accordingly.

### How to Identify

- The problem specifies a sorted array that has been **rotated** or shifted.
- The required time complexity is $O(\log n)$.
- You are searching for a specific target value.

### Description

Step-by-step explanation:

1. Initialize standard binary search pointers: `left = 0`, `right = nums.length - 1`.
2. Loop while `left &lt;= right`. Calculate `mid` safely.
3. If `nums[mid] == target`, return `mid`.
4. **Identify the Sorted Half:** Compare `nums[left]` and `nums[mid]`.
   - **If `nums[left] &lt;= nums[mid]`:** The left half `[left, mid]` is perfectly sorted without any pivot break.
     - Now, check if the target is within this sorted range: `nums[left] <= target < nums[mid]`.
     - If it is, the target *must* be in this left half. Shrink the window: `right = mid - 1`.
     - If it isn't, the target *must* be in the right half. Shrink the window: `left = mid + 1`.
   - **Else (`nums[left] &gt; nums[mid]`):** The left half contains the pivot. Therefore, the right half `[mid, right]` *must* be perfectly sorted.
     - Check if the target is within this sorted range: `nums[mid] &lt; target <= nums[right]`.
     - If it is, the target *must* be in this right half. Shrink the window: `left = mid + 1`.
     - If it isn't, the target *must* be in the left half. Shrink the window: `right = mid - 1`.
5. If the loop breaks, the target was not found. Return `-1`.

### The Intuition

If you cut a deck of sorted cards exactly once (a rotation) and then split that deck roughly in half, one of those two halves will *always* be a perfectly continuous, sorted sequence. The pivot (the "break" in the sorting) will be trapped in the other half.
Because it's very easy to check if a number belongs inside a perfectly sorted sequence (you just check if it's $\ge$ the start and $\le$ the end), we always evaluate the perfectly sorted half first. If the target fits nicely in the sorted half, we search there. If it doesn't fit, by process of elimination, it must be hiding in the messy, unsorted half. 

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

At each step, we identify which half the target belongs in and completely discard the other half. The search space is halved every iteration, taking at most $\log_2(N)$ iterations.

#### Space Complexity

We only allocate three scalar pointers (`left`, `right`, `mid`), meaning the algorithm operates strictly in-place. Auxiliary space is $O(1)$.

### Code

```java
class Solution {
    public int search(int[] nums, int target) {
        if (nums == null || nums.length == 0) return -1;

        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Determine if the LEFT half is sorted
            if (nums[left] <= nums[mid]) {
                // Does target fall strictly within the sorted left bounds?
                if (target &gt;= nums[left] && target &lt; nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } 
            // Otherwise, the RIGHT half must be sorted
            else {
                // Does target fall strictly within the sorted right bounds?
                if (target &gt; nums[mid] && target &lt;= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }

        return -1;
    }
}
```

## Caveats

- **The `<=` Operator Trap:** In the condition `if (nums[left] <= nums[mid])`, the equals sign is mandatory. If the search window shrinks to size 2 (e.g., `left = 0, right = 1`), `mid` evaluates to `0`. So `nums[left]` and `nums[mid]` point to the *exact same element*. If you only use `<`, the logic will falsely assume the left half is unsorted and jump to the `else` block, causing failures on small arrays or near the end of searches.
- **Two-Pass Alternative:** You can also solve this by doing a binary search to find the index of the minimum element (the pivot), and then doing a second, normal binary search on the appropriate half of the array. This is also $O(\log N)$, but writing two separate binary search functions is longer and more prone to typos in an interview setting.

## Concepts to Think About

- **Finding the Minimum:** You can use a similar logic just to find the smallest element (the pivot) in a rotated array (LeetCode 153). You compare `nums[mid]` with `nums[right]`. If `nums[mid] &gt; nums[right]`, the minimum is in the right half. Otherwise, it's in the left half (including mid).
- **Duplicate Elements:** If the array contains duplicates, this $O(\log N)$ algorithm breaks. 
- **Strict Monotonicity:** This logic relies on the values being distinct. If duplicates are introduced, the condition nums[left] == nums[mid] == nums[right] makes it impossible to know which side is sorted without a linear shrink (O(n)).
- **Pivot vs. Target:** Finding the smallest element (the pivot) is a different problem. There, the predicate is nums[mid] &gt; nums[right].
- **The "One-Pass" Advantage:** While you could find the pivot first and then do a normal binary search, the one-pass approach is cleaner and more highly regarded in Google interviews.

## Logical Follow-up

**Question:** What if the array contains duplicate elements? (LeetCode 81: Search in Rotated Sorted Array II)

**Solution:** If there are duplicates, you might encounter a situation where `nums[left] == nums[mid] == nums[right]` (e.g., `[3, 1, 2, 3, 3, 3, 3]`). In this scenario, you cannot mathematically determine which half is perfectly sorted and which half contains the pivot. You must shrink the search space manually from both sides by doing `left++` and `right--` until the duplicates are resolved. Because you shrink by 1 step at a time in this worst-case scenario, the time complexity degrades to $O(N)$.

**Question:** "What if the array is rotated but looks exactly like the original sorted array (rotated by $n$ or $0$ positions)? Does your logic change?"

**Solution:** No. The `nums[left] <= nums[mid]` condition will simply be true for every iteration, and the algorithm will behave like a standard binary search. This proves the **robustness** of the approach—it handles the "zero-rotation" case without needing a special `if` statement.


