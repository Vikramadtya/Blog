---
tags:
  - binary-search
  - math
  - arrays
---

# Kth Missing Positive Number

## Question

Given an array `arr` of positive integers sorted in strictly increasing order, and an integer `k`, return the $k$-th positive integer that is missing from this array.

## Solution

### Pattern

**Binary Search on Mathematical Invariants**
Instead of searching for a value directly, we binary search for an index based on a mathematical formula. Because the array is strictly increasing, we can calculate exactly how many numbers are missing before any index $i$. If the count is $&lt; k$, we search right. If $\ge k$, we search left.

### How to Identify

- The array is explicitly stated to be **strictly increasing** (no duplicates).
- You are asked to find a "missing" number or sequence.
- The constraints allow $O(N)$ linear scans, but follow-ups will demand $O(\log N)$, pointing directly to Binary Search.

### Description

Step-by-step explanation:

1. **The Invariant:** In a perfect sequence with no missing numbers (1, 2, 3, 4...), the value at any 0-based index `i` is exactly `i + 1`. 
   If `arr[i]` is greater than `i + 1`, the difference `arr[i] - (i + 1)` tells us *exactly* how many numbers are missing before `arr[i]`.
2. **Binary Search Setup:** Initialize `left = 0` and `right = arr.length - 1`.
3. **Loop:** Iterate while `left <= right`.
4. **Calculate Mid and Missing Count:** `mid = left + (right - left) / 2`. The number of missing elements before `arr[mid]` is `missingCount = arr[mid] - (mid + 1)`.
5. **Decide:**
   - If `missingCount < k`: We haven't skipped enough numbers yet. The $k$-th missing number must be further to the right. Set `left = mid + 1`.
   - If `missingCount &gt;= k`: We have skipped enough (or too many) numbers. The $k$-th missing number must be to the left. Set `right = mid - 1`.
6. **Termination and Math:** When the loop terminates, `right` will point to the index just *before* the $k$-th missing number. 
   - The formula for the answer is: `arr[right] + remaining_missing_numbers`.
   - `remaining_missing_numbers` = $k - (\text{missing before } arr[right])$.
   - Substitute: $Ans = arr[right] + k - (arr[right] - (right + 1))$.
   - Simplify: $Ans = k + right + 1$.
   - Because the loop terminated with `left = right + 1`, we can simplify even further to $Ans = left + k$.
7. Return `left + k`.

### The Intuition

Think of counting on your fingers, but some fingers are taped down (the numbers present in the array). You want to point to the $k$-th untaped finger (missing number).
If you jump to the middle of your hand, you can look at the finger's label (e.g., "Label 8") and its position (e.g., "Position 5"). You immediately know $8 - 5 = 3$ numbers are missing before this point.
If you need the 5th missing number, you know you haven't gone far enough right. If you need the 2nd missing number, you've gone too far, so look left.
By halving the search space, you find exactly where the $k$-th missing number falls. The final algebraic simplification is just a beautiful bonus of zero-based indexing.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The array is halved in every step based on an $O(1)$ calculation. This takes strictly $\log_2(N)$ iterations.

#### Space Complexity

We only use primitive integer pointers. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int findKthPositive(int[] arr, int k) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            // Expected value without missing numbers is mid + 1.
            int missingCount = arr[mid] - (mid + 1);

            if (missingCount < k) {
                left = mid + 1; 
            } else {
                right = mid - 1;
            }
        }

        // Loop breaks when left = right + 1. 
        // Mathematical derivation: 
        // Ans = arr[right] + (k - missingBeforeRight)
        // Ans = arr[right] + k - (arr[right] - (right + 1))
        // Ans = k + right + 1
        // Ans = k + left
        return left + k; 
    }
}
```

## Caveats

- **$O(N)$ vs $O(\log N)$:** The naive approach is iterating `i` from 1 upwards, incrementing a missing counter whenever `i` is not in the array. This works, but it's $O(N)$. Interviewers will explicitly demand $O(\log N)$.
- **Zero-Based vs One-Based Math:** If the array was 1-indexed, the expected value would just be `mid`. Because it is 0-indexed, the expected value at index `0` is `1`, so the formula must be `(mid + 1)`.

## Concepts to Think About

- **Index as Data:** This is a recurring theme in advanced array problems. The index itself provides implicit information when compared against the value at that index (e.g., Finding duplicates in an array 1 to N, Missing Number, First Missing Positive).
- **Algebraic Optimization:** Sometimes the code you write to logically deduce a state can be simplified via basic algebra to avoid array boundary checks (`right` might be -1 if the missing number is before the array starts, which breaks `arr[right]`, but `left + k` works universally without bounds checking).

## Logical Follow-up

Question: What if the array was extremely large, but you were guaranteed there are only a few missing numbers, and you needed to execute this query thousands of times for different values of $k$?
Solution: If you are querying frequently, $O(\log N)$ is good, but you can optimize. You could pre-process the array to create a parallel array or a `TreeMap` recording the count of missing numbers at specific "jump" intervals or boundaries. Given that there are few missing numbers, the array is mostly contiguous blocks. You could compress the array into intervals `[start, end]`. Finding the $k$-th missing number would then just be a binary search over the much smaller compressed interval list, taking $O(\log(\text{Number of Missing Blocks}))$.