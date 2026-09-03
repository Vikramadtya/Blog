---
tags:
  - binary-search
  - arrays
  - divide-and-conquer
---

# Binary Search

## Question

Given an array of integers `nums` sorted in ascending order, and an integer `target`, return the index of `target` if it exists. Otherwise, return `-1`. The algorithm must run in $O(\log n)$ time.

## Solution

### Pattern

**Iterative Binary Search**
Maintain a search window defined by `left` and `right` pointers. Calculate the middle index, compare it to the target, and discard half of the search space at every step until the target is found or the window collapses.

### How to Identify

- The input is explicitly stated to be **sorted** (arrays, matrices).
- The required time complexity is strictly $O(\log n)$.
- You are searching for a specific value, a boundary, or a minimum/maximum satisfying a condition.

### Description

Step-by-step explanation:

1. Handle edge cases. If the array is empty or the target is strictly outside the bounds of the lowest and highest elements, return `-1` immediately.
2. Initialize `left` to the 0th index and `right` to the last index (`n - 1`).
3. Loop as long as `left` is less than or equal to `right`. (The `&lt;=` is critical to evaluate a search space of exactly 1 element).
4. Calculate `mid = left + (right - left) / 2`.
5. Check if the element at `mid` is the target. If yes, return `mid`.
6. If the target is strictly greater than the element at `mid`, the target *must* be in the right half. Shrink the window by moving `left = mid + 1`.
7. If the target is strictly less than the element at `mid`, the target *must* be in the left half. Shrink the window by moving `right = mid - 1`.
8. If the loop terminates without returning, the target does not exist. Return `-1`.

### The Intuition

Think of finding a word in a physical dictionary. You don't read page 1, then page 2, then page 3 (Linear Search). 
Instead, you open the book exactly to the middle. If the word you are looking for comes alphabetically *after* the words on the current page, you know with 100% certainty that the word is in the right half of the book. You completely ignore the left half. You then open the right half to *its* middle, and repeat the process. 
Because you are throwing away exactly half of the remaining possibilities at every single step, you narrow down the answer exponentially fast.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log n)$    | $O(\log n)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

In the worst case, the search space is divided by 2 repeatedly until only 1 element remains. The maximum number of divisions is $\log_2(N)$. Therefore, time complexity is $O(\log n)$.

#### Space Complexity

The iterative approach only requires three scalar integer pointers (`left`, `right`, `mid`). It modifies no arrays and uses no auxiliary data structures. Auxiliary space is strictly $O(1)$. (Note: A recursive implementation would use $O(\log n)$ space on the call stack).

### Code

```java
class Solution {
    public int search(int[] nums, int target) {
        if (nums == null || nums.length == 0 || target &lt; nums[0] || target &gt; nums[nums.length - 1]) {
            return -1;
        }

        int left = 0;
        int right = nums.length - 1;

        // `&lt;=` is necessary to check the final element when left == right
        while (left <= right) {
            // Avoids integer overflow which occurs with (left + right) / 2
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return -1;
    }
}
```

## Caveats

- **Integer Overflow Bug:** Using `mid = (left + right) / 2` will crash in production systems if `left + right` exceeds `2,147,483,647` (the max 32-bit integer). It wraps around to a negative number, causing an `ArrayIndexOutOfBoundsException`. Always use `left + (right - left) / 2` or the bitwise unsigned right shift `(left + right) &gt;&gt;> 1`.
- **Infinite Loops:** If you forget to add/subtract 1 when updating pointers (e.g., writing `left = mid` instead of `left = mid + 1`), the window will never collapse when `left` and `right` are adjacent, resulting in an infinite loop (Time Limit Exceeded).

## Concepts to Think About

- **Lower Bound (First Occurrence):** If the array has duplicates and you need the *first* occurrence of the target, you do not return when `nums[mid] == target`. Instead, you record `ans = mid` and force the search to continue leftward by setting `right = mid - 1`.
- **Upper Bound (Last Occurrence):** Conversely, to find the last occurrence, record `ans = mid` and force the search rightward by setting `left = mid + 1`.
- **Search Space on Answers:** Binary Search isn't just for arrays. You can binary search an abstract mathematical range (like searching for the square root of $X$ by binary searching between $0$ and $X$).

## Logical Follow-up

Question: How would you search for a target in a sorted array that has been rotated an unknown number of times? (LeetCode 33: Search in Rotated Sorted Array)

Solution: You can still achieve $O(\log n)$ time. In any rotated sorted array, if you pick a `mid` point, at least *one* half of the array (either `left` to `mid`, or `mid` to `right`) is guaranteed to be perfectly sorted. You determine which half is sorted by comparing `nums[left]` to `nums[mid]`. Once you know which half is sorted, you check if the `target` falls within the bounds of that sorted half. If it does, you binary search that half. If it doesn't, the target must be in the *other*, unsorted half.

Question: What if the array has an unknown, infinite length (e.g., a data stream), and you cannot use `nums.length`?

Solution: You must first find bounds. Set `left = 0` and `right = 1`. Check if `target > nums[right]`. If it is, exponentially expand your bounds: `left = right` and `right = right * 2`. Repeat this expansion until `nums[right] >= target`. Now you have a defined finite window `[left, right]` where standard Binary Search can be safely executed. Time complexity remains $O(\log n)$ where $n$ is the index of the target.
