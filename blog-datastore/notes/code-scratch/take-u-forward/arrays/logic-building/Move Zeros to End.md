---
tags:
  - cc
  - two-pointers
  - array-manipulation
---

# Move Zeros to End

## Question

Given an integer array $nums$, move all $0$'s to the end of the array while maintaining the **relative order** of the non-zero elements. This must be done **in-place** without creating a copy of the array.

## Solution

### Pattern

**Two-Pointer (Slow/Fast Pointer)**
A slow pointer tracks the position of the first available zero, while a fast pointer scans for the next non-zero element to move forward.

### How to Identify

- Requirement to modify an array **in-place**.
- Requirement to preserve the **relative order** of a subset of elements.
- Constraints involving segregating elements into two groups (e.g., zeros vs. non-zeros, evens vs. odds).

### Description

Step-by-step explanation:

- **Locate the Pivot:** Iterate through the array to find the first occurrence of $0$. Let this index be $j$. If no zero is found, the array is already sorted; return early.
- **Initialize Fast Pointer:** Start a second pointer $i = j + 1$.
- **The Scan:** Iterate through the remainder of the array.
- **The Swap:** Whenever `nums[i]` is not zero:
    - Swap `nums[i]` with `nums[j]`.
    - Increment $j$ to point to the next zero in the sequence.
- **Result:** Non-zero elements are "pushed" forward, effectively bubbling the zeros to the end in a single pass.



### The Intuition

Think of this as **"Snowballing."** As you move through the array, the zeros you encounter form a "snowball" that grows in size. Every time you find a non-zero element, you "throw" it over the snowball to the front. This moves the snowball one position to the right. By the time you reach the end, the entire snowball of zeros has been pushed to the tail. 



### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$. In the worst case, we traverse the array once to find the zero and once more to perform swaps. Total operations are proportional to $n$.

#### Space Complexity
$O(1)$. We only maintain two integer pointers regardless of the input size.

### Code

```java
class Solution {
    /**
     * Moves all zeros to the end in a single logical pass.
     * Uses two-pointer swap to maintain relative order.
     */
    public void moveZeroes(int[] nums) {
        if (nums == null || nums.length < 2) return;

        // 1. Find the first zero to avoid unnecessary work
        int j = -1;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0) {
                j = i;
                break;
            }
        }

        // 2. If no zeros exist, the array is already correct
        if (j == -1) return;

        // 3. i is the fast pointer, j is the slow pointer (first zero)
        for (int i = j + 1; i < nums.length; i++) {
            if (nums[i] != 0) {
                // Swap the non-zero element with the zero at j
                int temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
                
                // j now points to the next zero in the 'snowball'
                j++;
            }
        }
    }
}
```

## Caveats

- **Stability:** The two-pointer swap maintains stability (relative order). A simple "partition" (like Quicksort) would move zeros to the end but would likely scramble the order of the non-zeros.
- **Write Optimization:** If the number of zeros is very small, the two-pass "overwrite and pad" method (the candidate's original solution) might actually perform fewer total writes than the swap method. 

## Concepts to Think About

- **Loop Invariants:** At any point in the second loop, elements before $j$ are non-zero, and elements from $j$ to $i-1$ are zeros.
- **Two-Pointer Variations:** This is similar to the "Remove Duplicates" logic but involves swapping rather than just overwriting.
- **In-Place Constraints:** This problem is common in system-level programming where memory is a bottleneck.

## Logical Follow-up

Question: How would you minimize the number of writes if the array has very few zeros?
Solution: Use the two-pass approach (copy non-zeros to the front, then fill the tail). This ensures each non-zero element is written at most once.

Question: What if you had to move all zeros to the **beginning** of the array instead?
Solution: Iterate from **right to left**. Find the first zero from the end, and swap non-zeros found by a fast pointer moving towards the start.