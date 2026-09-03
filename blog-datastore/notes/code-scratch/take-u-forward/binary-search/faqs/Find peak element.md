---
tags:
  - binary-search
  - arrays
---

# Find Peak Element

## Question

A peak element is an element strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element and return its index. You may imagine that $nums[-1] = nums[n] = -\infty$. 
You must write an algorithm that runs in $O(\log n)$ time.

## Solution

### Pattern

**Binary Search on Gradient (Slope)**
Even though the array is unsorted, we can use Binary Search by evaluating the local derivative (slope) at any point. Because the array is bounded by $-\infty$ on both sides, any rising slope guarantees a peak to the right, and any falling slope guarantees a peak to the left.

### How to Identify

- The required time complexity is $O(\log N)$, but the array is explicitly **not sorted**.
- You are looking for a local maximum/minimum (Peak/Valley).
- The array has virtual $\pm \infty$ boundaries.

### Description

Step-by-step explanation:

1. Initialize `left = 0` and `right = nums.length - 1`.
2. Loop while `left &lt; right`. Using strictly `<` is critical. It guarantees that the search window has at least 2 elements, meaning `mid` will never equal the last index, ensuring `mid + 1` is always perfectly safe to access without `IndexOutOfBounds` exceptions.
3. Calculate `mid = left + (right - left) / 2`.
4. Compare `nums[mid]` with `nums[mid + 1]` to determine the local slope.
   - **If `nums[mid] < nums[mid + 1]`:** The slope is rising. Because the array eventually drops to $-\infty$ at the far right edge, a rising slope means a peak *must* mathematically exist somewhere to the right. We discard the left half: `left = mid + 1`.
   - **If `nums[mid] &gt; nums[mid + 1]`:** The slope is falling. Because the array dropped from $-\infty$ on the far left edge, a falling slope right now means we just passed a peak. The peak *must* mathematically exist somewhere to the left, or `mid` itself is the peak. We discard the right half: `right = mid`. (Do not use `mid - 1`, as `mid` is still a candidate).
5. When the loop terminates, `left` and `right` will converge exactly on a peak index. Return `left`.

### The Intuition

Imagine you are blindfolded and dropped onto a mountain range. You take one step to your right.
- If your foot steps *UP*, you know that if you keep walking right, you will eventually hit a peak (because the world ends in a bottomless cliff $-\infty$).
- If your foot steps *DOWN*, you know you are walking away from a peak. The peak must be behind you (to your left), or you were just standing exactly on it.
Because you only need to find *any* peak, you just follow the upward slope. By repeatedly dropping yourself in the middle of the remaining mountain range and checking the slope, you cut the search space in half every time.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved in every iteration of the `while` loop based on a constant-time comparison. For an array of size $N$, this takes at most $\log_2(N)$ iterations. 

#### Space Complexity

The algorithm uses only primitive pointers (`left`, `right`, `mid`), operating entirely in place. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int findPeakElement(int[] nums) {
        if (nums == null || nums.length == 0) return -1;
        
        int left = 0;
        int right = nums.length - 1;

        // left &lt; right ensures we always have at least 2 elements in the window.
        // Therefore, mid + 1 will never go out of bounds.
        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < nums[mid + 1]) {
                // We are on an upward slope. A peak must be to the right.
                left = mid + 1;
            } else {
                // We are on a downward slope. A peak must be at mid or to the left.
                right = mid;
            }
        }

        return left;
    }
}
```

## Caveats

- **`left <= right` Template Trap:** If you try to use `while (left <= right)` and `right = mid - 1`, you will be forced to check `mid - 1` and `mid + 1` simultaneously to identify the exact peak inside the loop. This requires extremely messy boundary padding (like checking for index 0, index $N-1$, or using `Long.MIN_VALUE`). The `left < right` convergence template completely bypasses this headache.
- **Multiple Peaks:** The algorithm is greedy. It just follows the first upward slope it finds. If there are multiple peaks (e.g., `[1, 5, 2, 7, 3]`), it will zero in on one of them deterministically based on how the array halves, ignoring the others. This satisfies the problem constraints.
- **Adjacent Duplicates:** This specific $O(\log n)$ logic assumes $arr[i] \neq arr[i+1]$. If duplicates are allowed and a peak is defined as $arr[i-1] \le arr[i] \ge arr[i+1]$, the problem may require $O(n)$ in the worst case.
- **Strict Peak:** The definition $arr[i-1] < arr[i] &gt; arr[i+1]$ means a plateau (e.g., `[1, 2, 2, 2, 1]`) technically has no peak under strict rules.


## Concepts to Think About

- **Unsorted Binary Search:** This problem is the canonical proof that Binary Search does **not** require a sorted array. It only requires a property that allows you to definitively discard half the search space.
- **Gradient Descent:** This logic is the 1-dimensional discrete equivalent of Gradient Ascent/Descent, a foundational algorithm in Machine Learning for finding local minima/maxima in error functions.
- **Why it works on unsorted data:** We don't need the whole array to be sorted; we only need a "gradient" to guide the binary search.
- **Binary Search on Answer:** This is a subset of a broader pattern where we search for a value/index that satisfies a specific condition in a search space.
- **Local vs. Global Optima:** This algorithm finds a local maximum, not necessarily the global maximum.

## Logical Follow-up

Question: What if the array is a 2D matrix (a grid of mountains), and a peak is strictly greater than its top, bottom, left, and right neighbors? Find any peak in $O(M \log N)$ time. (LeetCode 1901: Find a Peak Element II)
Solution: You binary search on the *columns* (or rows). Pick the middle column `mid`. Linearly scan this single column to find its maximum element. Let's say the max is at `(row, mid)`. Now, compare `matrix[row][mid]` to its left and right neighbors `matrix[row][mid-1]` and `matrix[row][mid+1]`. 
If the right neighbor is larger, a 2D peak *must* exist in the right half of the matrix. If the left is larger, it must be in the left half. Discard the other half of the columns. Because we do an $O(M)$ scan at each of the $\log N$ binary search steps, the total time is $O(M \log N)$.

Question: What if there are **multiple peaks** and you need to find the **highest** one?

Solution: Binary Search will no longer work. You must perform a linear scan $O(n)$ because a local peak found by binary search could be much lower than the global maximum.
