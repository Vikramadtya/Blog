---
tags:
  - cc
  - array
  - traversal
---

# Check if Array is Sorted

## Question

Given an integer array $nums$ of size $n$, return `true` if the array is sorted in **non-decreasing** order. Otherwise, return `false`. An array is non-decreasing if for every index $i$ (where $1 \le i &lt; n$), the condition $nums[i-1] \le nums[i]$ holds true.

## Solution

### Pattern

**Linear Scan / Adjacent Comparison**

The property of a sorted array is local; if every adjacent pair satisfies the sorted condition, the entire array is globally sorted.

### How to Identify

- Checking for a property that must hold across the entire sequence.
- Problems involving "non-decreasing", "non-increasing", or "monotonic" behavior.
- Requirement for optimal $O(n)$ time.

### Description

Step-by-step explanation:

- **Empty/Single Element Case:** By definition, an array with 0 or 1 elements is already sorted.
- **Iteration:** Start a loop from the second element (index $1$) to the end of the array.
- **Violation Check:** At each step, compare the current element with the previous one ($nums[i]$ vs $nums[i-1]$).
- **Early Exit:** If we find any instance where $nums[i-1] &gt; nums[i]$, the non-decreasing property is violated. Return `false` immediately.
- **Completion:** If the loop finishes without returning `false`, every adjacent pair is valid. Return `true`.

### The Intuition

Think of this as a **"Chain of Trust."** 
To ensure the last person in a line is taller than or equal to the first, you only need to check if each person is taller than or equal to the person immediately in front of them. If even one person breaks this rule, the "sorted" chain is broken.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
We perform $n-1$ comparisons in the worst case (when the array is sorted). Each comparison is $O(1)$. Total time is $O(n)$.

#### Space Complexity
The algorithm uses a fixed amount of space for the loop index, regardless of array size.

### Code

```java
class Solution {
    /**
     * Checks if the array is sorted in non-decreasing order.
     * @param nums Primitive array for optimal performance
     * @return true if sorted, false otherwise
     */
    public boolean isSorted(int[] nums) {
        // Base case: null or empty/single element arrays are sorted
        if (nums == null || nums.length &lt;= 1) {
            return true;
        }

        // Single pass comparison
        for (int i = 1; i &lt; nums.length; i++) {
            // If the previous element is greater than the current, it's not sorted
            if (nums[i - 1] &gt; nums[i]) {
                return false;
            }
        }

        return true;
    }
}
```

## Caveats

- **Strictly Increasing vs Non-Decreasing:** Read the problem carefully. "Sorted" usually implies non-decreasing ($a \le b$), whereas "strictly increasing" implies $a &lt; b$.
- **Data Types:** If the array contains floating-point numbers, be careful with precision, though standard comparison operators usually suffice.
- **Iterator Performance:** If using Java `List`, avoid `list.get(i)` inside a loop unless you are certain the implementation is an `ArrayList`. Use an iterator for generic `List` types.

## Concepts to Think About

- **Monotonicity:** This is a check for a monotonic non-decreasing function.
- **Early Exit Strategy:** Always look for ways to return as soon as a condition is violated to optimize average-case time.
- **Unboxing Performance:** In languages like Java, primitive arrays are significantly faster and more cache-friendly than `List<Integer&gt;`.
- **Parallelization:** While $O(n)$ is fast, for massive arrays, this could be parallelized by checking segments and verifying the boundaries between them.

## Logical Follow-up

Question: How would you check if an array is **sorted and rotated**? (e.g., `[3, 4, 5, 1, 2]`)
Solution: Count the number of pairs $(nums[i-1] &gt; nums[i])$. In a sorted and rotated array, there can be at most **one** such violation (including the wrap-around pair between the last and first element). If the count is $\le 1$, return `true`.