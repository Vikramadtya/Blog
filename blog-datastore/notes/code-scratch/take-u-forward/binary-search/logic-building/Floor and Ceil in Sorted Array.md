---
tags:
  - binary-search
  - arrays
---

# Floor and Ceil in Sorted Array

## Question

Given a sorted array `nums` and an integer `x`, find the floor and ceiling of `x`.
- **Floor:** The largest element in the array $\le x$.
- **Ceiling:** The smallest element in the array $\ge x$.
If no floor or ceiling exists, return `-1` for that respective value.

## Solution

### Pattern

**Single-Pass Boundary Search**
Modify a standard Binary Search to search for the first element strictly greater than $x$. Because the array is sorted, this target index naturally gives us the Ceiling, and the index immediately preceding it naturally gives us the Floor.

### How to Identify

- The array is sorted.
- You need to find the closest values to a target, bounding it from above and below.
- Searching for two related boundaries simultaneously often implies they can be found using the exact same binary search state.

### Description

Step-by-step explanation:

1. Handle edge cases. If the array is empty, return `[-1, -1]`.
2. Initialize `left = 0` and `right = nums.length`. We set `right` out of bounds to handle the case where $x$ is larger than all elements in the array.
3. Loop while `left &lt; right`.
4. Calculate `mid = left + (right - left) / 2`.
5. **Optimization:** If `nums[mid] == x`, then $x$ exists in the array. By definition, the largest element $\le x$ is $x$, and the smallest element $\ge x$ is $x$. Return `[x, x]` immediately.
6. **Predicate Evaluation:** - If `nums[mid] &gt; x`: The element is strictly greater. It is a candidate for the ceiling. Keep it in the search space and look left: `right = mid`.
   - If `nums[mid] &lt; x`: The element is strictly less. It cannot be the ceiling. Discard it and look right: `left = mid + 1`.
7. Once the loop ends, `left` (and `right`) will point to the index of the first element strictly greater than $x$.
8. **Map to Results:**
   - The Ceiling is at index `right`. (Ensure `right &lt; nums.length` to avoid out-of-bounds, returning `-1` if it is).
   - The Floor is at index `right - 1`. (Ensure `right - 1 &gt;= 0` to avoid out-of-bounds, returning `-1` if it is).

### The Intuition

Imagine finding your assigned seat in a sorted theater row. Your ticket says seat 25, but the seats jump from 20 to 30. 
If you walk down the row, the moment you pass a seat numbered *greater* than 25 (seat 30), you stop. 
The seat you are currently looking at (30) is your Ceiling. 
The seat you just walked past (20) is your Floor.
You don't need to walk down the row twice to find both numbers; finding the exact gap between them reveals both boundaries simultaneously. Binary search just helps you find that gap in $O(\log N)$ time instead of walking linearly.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved exactly once per loop iteration. The maximum number of iterations is $\log_2(N)$.

#### Space Complexity

We use a few primitive pointers and allocate a size-2 array to return the answer. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int[] getFloorAndCeil(int[] nums, int x) {
        if (nums == null || nums.length == 0) return new int[]{-1, -1};

        int left = 0, right = nums.length;

        while (left &lt; right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == x) return new int[]{x, x};

            if (nums[mid] &gt; x)  {
                right = mid;
            } else {
                left = mid + 1;
            }
        }

        int floor = (right - 1 &gt;= 0) ? nums[right - 1] : -1;
        int ceil = (right &lt; nums.length) ? nums[right] : -1;

        return new int[]{floor, ceil}; 
    }
}
```

## Caveats

- **Two Separate Searches vs One:** A naive (but correct) candidate might write two entirely separate binary search functions: one for `getFloor` and one for `getCeil`. While asymptotically equivalent $O(2 \log N) \rightarrow O(\log N)$, writing it in a single pass demonstrates superior mastery of binary search state invariants.
- **`left &lt;= right` Pitfall:** If you use the `left <= right` template with `right = mid - 1`, the final states of `left` and `right` cross each other, making boundary extraction slightly more confusing (`left` becomes ceil, `right` becomes floor). The `[left, right)` template is much cleaner for bounding problems.

## Concepts to Think About

- **Lower/Upper Bound C++ Equivalents:** In C++, `std::lower_bound` returns an iterator to the first element $\ge x$ (Ceiling). `std::upper_bound` returns an iterator to the first element $&gt; x$. 
- **Database Indexing:** This exact algorithm is how B-Tree database indexes rapidly locate ranges for `BETWEEN` SQL queries. It finds the floor of the lower bound and the ceiling of the upper bound to fetch the block.
- The Neighborhood Rule: In sorted arrays, the elements satisfying `nums[i]&lt;x` and `nums[i]≥x` are always adjacent. Finding one usually gives you the other for free.
- Lower Bound as Ceil: Why is lowerBound the same as Ceil? Because both look for the first element that hasn't "failed" the ≥x condition.
- Edge Cases: What happens when x is smaller than nums[0]? (Ceil is nums[0], Floor is -1). What if x is larger than nums[n-1]? (Ceil is -1, Floor is nums[n-1]).

## Logical Follow-up

**Question:** What if the array is an infinite data stream (you don't know the length), and you need the floor/ceil of $x$?

**Solution:** You cannot use `nums.length` to initialize `right`. You must first find the search bounds. Initialize `left = 0`, `right = 1`. While `nums[right] < x`, expand the window exponentially: `left = right` and `right = right * 2`. Once `nums[right] &gt;= x`, you have established a finite window `[left, right]`. You then run the exact same binary search within that window. Total time remains $O(\log k)$ where $k$ is the index of the ceiling.


**Question:** "Given a sorted array, find the **Closest Element** to a target $x$. If two numbers are equally close, return the smaller one."

**Solution:** 

1. Use the **Lower Bound** logic to find the ceiling. 
2. Compare the absolute difference between $x$ and the Ceiling (`nums[idx]`) and $x$ and the Floor (`nums[idx-1]`). 
3. Return the one with the smaller difference.

**Question (Find K Closest Elements):** "Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array. The result should also be sorted. If there is a tie, the smaller strategy is preferred."

**Solution:**
A naive L4 solution would be to find the closest element and then expand outwards using two pointers for $O(\log n + k)$. However, an **L5 candidate** might suggest a more elegant **Binary Search on the Window**.

1. **Intuition:** We are looking for the **starting index** `left` of a window of size `k`. 
2. **Search Space:** The possible starting index `left` ranges from `0` to `n - k`.
3. **Binary Search Criteria:** We compare the distance of the elements at the edges of the window. For a `mid` index:
   * Is $x$ closer to `nums[mid]` or `nums[mid + k]`?
   * If `x - nums[mid] &gt; nums[mid + k] - x`, then `mid` is too far to the left, so `left = mid + 1`.
   * Else, `right = mid`.
4. **Result:** After $O(\log(n-k))$ time, we have the start of the perfect window.