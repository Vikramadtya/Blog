---
tags:
  - binary-search
  - arrays
---

# Upper Bound

## Question

Given a sorted array `nums` and an integer `x`, find the upper bound of `x`. The upper bound is the index of the first element in the array that is strictly greater than $x$ (`nums[i] > x`). If no such element exists, return the size of the array.

## Solution

### Pattern

**Binary Search for Boundary (Predicate Search)**
Instead of stopping when `nums[mid] == x`, we evaluate a predicate: `nums[mid] > x`. If true, we record `mid` as a potential answer and continue searching the left half to see if an *earlier* valid index exists. If false, we discard the left half and search the right half.

### How to Identify

- The array is explicitly stated to be sorted.
- The prompt asks for the "first", "last", "smallest index", or "largest index" satisfying a condition.
- You need to find where an element *should* be inserted to maintain sorted order, specifically *after* all existing duplicates of that element.

### Description

Step-by-step explanation:

1. Initialize `left = 0` and `right = nums.length`. We initialize `right` to the length of the array (out of bounds) because if $x$ is greater than or equal to every element, the correct insertion point/upper bound is the very end of the array.
2. Loop while `left &lt; right`. We use `&lt;` instead of `<=` because our search space is defined as `[left, right)`.
3. Calculate `mid = left + (right - left) / 2` to prevent integer overflow.
4. Evaluate the condition: `nums[mid] &gt; x`.
   - **If TRUE:** The element at `mid` is strictly greater than $x$. This means `mid` *could* be the upper bound. But there might be valid elements to its left. Therefore, we shrink our window by setting `right = mid`. We do not do `mid - 1` because `mid` itself is still a valid candidate.
   - **If FALSE:** The element at `mid` is less than or equal to $x$. It cannot possibly be the upper bound, nor can anything to its left. We definitively discard it by setting `left = mid + 1`.
5. When the loop terminates, `left` will equal `right`, pointing exactly to the first element $&gt; x$, or `nums.length` if all elements were $\le x$. Return `left`.

### The Intuition

Think of binary search as a boundary-finding tool rather than a value-finding tool.
Imagine painting all elements in the array: 
Elements less than or equal to $x$ are painted RED. 
Elements strictly greater than $x$ are painted GREEN.
Because the array is sorted, the colors will look like this: `[RED, RED, RED, GREEN, GREEN]`.
The upper bound is simply asking: "Find the index of the very first GREEN element."
If `nums[mid]` is GREEN, the first GREEN element must be at `mid` or somewhere to its left.
If `nums[mid]` is RED, the first GREEN element must be strictly to its right.
By repeatedly halving the space, the `left` and `right` pointers eventually squeeze together onto the exact boundary where RED turns to GREEN.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved in every iteration of the `while` loop. For an array of size $N$, this takes at most $\log_2(N)$ iterations. 

#### Space Complexity

The algorithm uses only three integer variables (`left`, `right`, `mid`), operating entirely in place. Therefore, the auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int upperBound(int[] nums, int x) {
        if (nums == null) return 0;

        // Search space is [0, n). 
        // We initialize right to n because the answer could be n if x is >= all elements.
        int left = 0;
        int right = nums.length; 

        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] &gt; x) {
                // mid is strictly greater than x. It is a valid candidate for upper bound.
                // We keep it in the search space and look left for an earlier one.
                right = mid;
            } else {
                // mid is &lt;= x. It cannot be the upper bound. Discard it.
                left = mid + 1;
            }
        }

        return left;
    }
}
```

## Caveats

- **Lower Bound vs Upper Bound:** The *only* difference between Lower Bound and Upper Bound is the predicate. 
  - Lower Bound: `nums[mid] &gt;= x` (First element greater than OR equal to $x$)
  - Upper Bound: `nums[mid] > x` (First element strictly greater than $x$)
- **Loop Condition and Shrinking:** If you use `while (left <= right)` and `right = mid - 1` (the standard exact-match binary search template), it requires a separately tracked `ans` variable to work correctly. Mixing the `[left, right)` boundaries (`while(left < right)`) with `right = mid - 1` will result in skipping valid answers or infinite loops. You must memorize which template you are using and stick to its specific boundary rules.
- **`left = mid` Infinite Loop:** Notice we never write `left = mid`. In integer division, `mid` biases towards the left. If `left` and `right` are adjacent, `mid` will equal `left`. If the logic branches to `left = mid`, the state doesn't change, causing an infinite loop. The `[left, right)` template perfectly avoids this by only doing `right = mid` or `left = mid + 1`.

## Concepts to Think About

- **Counting Occurrences:** You can find the exact number of times a target $x$ appears in a sorted array by calculating `UpperBound(x) - LowerBound(x)`. This takes $O(\log N)$ time, which is much faster than finding one instance and linearly scanning left and right ($O(N)$ time).
- **Binary Search on Answer:** This exact boundary-finding logic is the core engine for advanced DP/Greedy problems where you aren't searching an array, but rather searching a mathematical range of possible answers (e.g., LeetCode 875: Koko Eating Bananas, LeetCode 1011: Capacity to Ship Packages).

## Logical Follow-up

**Question:** Given a sorted array with duplicates, how would you find the index of the *last* occurrence of $x$?

**Solution:** Find the Upper Bound of $x$, and then subtract 1. Because the Upper Bound is the *first* element strictly greater than $x$, the element immediately preceding it must be the last occurrence of $x$ (provided $x$ actually exists in the array, which you verify by checking `nums[upperBound - 1] == x`). This takes $O(\log N)$ time.


**Question:** "Given a sorted array `nums`, return the **count** of a specific number $x$. For example, if `nums = [1, 2, 2, 2, 3]` and $x = 2$, the output should be $3$."

**Solution:** The count of $x$ is simply $\text{upperBound}(x) - \text{lowerBound}(x)$.
1.  Run `lowerBound` to find the first index of $x$.
2.  Run `upperBound` to find the first index *after* the last $x$.
3.  The difference is the total frequency. This is $O(\log n)$.


**Question (Koko Eating Bananas):** "There are $n$ piles of bananas, where the $i^{th}$ pile has $piles[i]$ bananas. Guards will be gone for $H$ hours. Koko can decide her bananas-per-hour eating speed $k$. Each hour, she chooses a pile and eats $k$ bananas from it. If the pile has less than $k$, she eats them all and doesn't eat any more during that hour. Koko wants to finish all bananas within $H$ hours. Return the **minimum** integer $k$ such that she can eat all the bananas within $H$ hours."

**L5 Analysis & Solution:**
This is a "Binary Search on Answer" problem, where the search space is the **possible speed $k$**.

1. **Search Space:** The minimum speed is $1$ (she must eat something). The maximum speed is $\max(piles)$ (at this speed, she finishes any pile in 1 hour).
2.  **Monotonicity:** If Koko can finish at speed $k$, she can definitely finish at speed $k+1$. If she can't finish at speed $k$, she definitely can't finish at any speed slower than $k$. This is a sorted predicate `[false, false, true, true]`.
3.  **Predicate Function:** Write a `canFinish(speed, H)` helper:
    - Iterate through piles: `hoursUsed += Math.ceil(piles[i] / speed)`.
    - Return `hoursUsed <= H`.
4. **Binary Search:** Use your **Lower Bound** template on the range $[1, \max(piles)]$ to find the smallest speed that returns `true`.

