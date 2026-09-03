---
tags:
  - binary-search
  - arrays
---

# Lower Bound

## Question

Given a sorted array `nums` and an integer `x`, find the lower bound of `x`. The lower bound is the index of the first element in the array that is strictly greater than or equal to $x$ (`nums[i] >= x`). If no such element exists, return the size of the array.

## Solution

### Pattern

**Binary Search for Boundary (Predicate Search)**
Instead of stopping when `nums[mid] == x`, we evaluate a predicate: `nums[mid] >= x`. If true, we record `mid` as a potential answer and continue searching the left half to see if an *earlier* valid index exists. If false, we search the right half.

### How to Identify

- The array is sorted.
- The prompt asks for the "first", "last", "smallest index", or "largest index" satisfying a condition.
- You need to find where an element *should* be inserted to maintain sorted order.

### Description

Step-by-step explanation:

1. Initialize `left = 0` and `right = nums.length`. We initialize `right` to the length of the array (out of bounds) because if $x$ is larger than every element, the correct insertion point/lower bound is the very end of the array.
2. Loop while `left &lt; right`. We use `&lt;` instead of `<=` because our search space is defined as `[left, right)`.
3. Calculate `mid = left + (right - left) / 2` to prevent integer overflow.
4. Evaluate the condition: `nums[mid] &gt;= x`.
   - **If TRUE:** The element at `mid` is greater than or equal to $x$. This means `mid` *could* be the lower bound. But there might be valid elements to its left. Therefore, we shrink our window by setting `right = mid`. We do not do `mid - 1` because `mid` itself is still a candidate.
   - **If FALSE:** The element at `mid` is strictly less than $x$. It cannot possibly be the lower bound, nor can anything to its left. We definitively discard it by setting `left = mid + 1`.
5. When the loop terminates, `left` will equal `right`, pointing exactly to the first element $\ge x$, or `nums.length` if all elements were smaller. Return `left`.

### The Intuition

Think of binary search as a boundary-finding tool rather than a value-finding tool.
Imagine painting all elements in the array: 
Elements strictly less than $x$ are painted RED. 
Elements greater than or equal to $x$ are painted GREEN.
Because the array is sorted, the colors will look like this: `[RED, RED, RED, GREEN, GREEN]`.
The lower bound is simply asking: "Find the index of the very first GREEN element."
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

The algorithm uses only three integer variables (`left`, `right`, `mid`), operating entirely in place. Therefore, the auxiliary space is $O(1)$.

### Code

```java
class Solution {
    public int lowerBound(int[] nums, int x) {
        if (nums == null) return -1; // Standard safety guard
        
        // Define search space as [0, n).
        // right is n, because the answer could be n if x &gt; all elements.
        int left = 0;
        int right = nums.length; 

        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] &gt;= x) {
                // mid might be the answer, so we don't discard it.
                right = mid;
            } else {
                // mid is strictly less than x, so it cannot be the answer.
                left = mid + 1;
            }
        }

        // When left == right, we have isolated the lower bound index.
        return left;
    }
}
```

### Caveats

- **Loop Condition and Shrinking:** If you use `while (left &lt;= right)` and `right = mid - 1` (the standard exact-match binary search template), it requires a separately tracked `ans` variable to work correctly. Mixing the `[left, right)` boundaries (`while(left &lt; right)`) with `right = mid - 1` will result in skipping valid answers or infinite loops. You must memorize which template you are using and stick to its specific boundary rules.
- **`left = mid` Infinite Loop:** Notice we never write `left = mid`. In integer division, `mid` biases towards the left. If `left` and `right` are adjacent, `mid` will equal `left`. If the logic branches to `left = mid`, the state doesn't change, causing an infinite loop. The `[left, right)` template perfectly avoids this by only doing `right = mid` or `left = mid + 1`.

### Concepts to Think About

- **Upper Bound:** The Upper Bound is the index of the first element *strictly greater* than $x$ (`nums[i] &gt; x`). The logic is nearly identical, you just change the predicate to `if (nums[mid] &gt; x) { right = mid; } else { left = mid + 1; }`.
- **Counting Occurrences:** You can find the exact number of times a target $x$ appears in a sorted array by calculating `UpperBound(x) - LowerBound(x)`.
- **Binary Search on Answer:** This exact boundary-finding logic is used for advanced DP/Greedy problems where you aren't searching an array, but rather searching a range of possible answers (e.g., Koko Eating Bananas, Capacity to Ship Packages).

## Logical Follow-up

**Question:** How would you modify this to find the *Upper Bound* of $x$?

**Solution:** The Upper Bound is the first element strictly greater than $x$. We just change the conditional check. If `nums[mid] > x`, `mid` is a candidate, so we look left: `right = mid`. If `nums[mid] &lt;= x`, it cannot be the upper bound, so we discard it and look right: `left = mid + 1`.

**Question:** Suppose the array contains objects, and evaluating `nums[mid] &gt;= x` is a very expensive database call. How does this algorithm perform?

**Solution:** Binary search minimizes the maximum number of comparisons to $\log_2(N)$. If evaluations are expensive, Binary Search is the definitively optimal strategy to minimize those calls compared to a linear scan.

**Question:** "Given a sorted array that contains duplicates, find the **range** (start and end index) of a given target $x$. For example, if `nums = [5, 7, 7, 8, 8, 10]` and `x = 8`, return `[3, 4]`."

**Hint:** Use `lowerBound(x)` to find the start, and `lowerBound(x + 1) - 1` (or a dedicated `upperBound`) to find the end.


**Question (Capacity to Ship Packages):** "A conveyor belt has packages that must be shipped within $D$ days. The weights of the packages are given in an array `weights`. You must load the packages in the order given. Every day, we load as many packages as possible without exceeding the ship's weight capacity. Find the **minimum** weight capacity of the ship that will result in all packages being shipped within $D$ days."

**Analysis & Solution:**
This is a classic "Binary Search on Answers" problem.
1. **Search Space:** The minimum possible capacity is $\max(\text{weights})$ (to carry the heaviest package). The maximum possible capacity is $\sum \text{weights}$ (shipping all in 1 day).
2.  **Monotonicity:** If a capacity $C$ works, any capacity $> C$ also works. If it doesn't work, any capacity $< C$ won't work either. This is our "Sorted" property.
3.  **The Predicate:** Write a helper function `canShip(capacity, D)` that simulates the process.
4.  **Binary Search:** Apply your `lowerBound` logic on the range $[\max(\text{weights}), \sum \text{weights}]$ to find the smallest capacity that satisfies `canShip == true`.

