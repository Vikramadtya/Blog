---
tags:
  - cc
  - two-pointers
  - in-place
---

# Remove Duplicates from Sorted Array

## Question

Given an array `nums` sorted in **non-decreasing order**, remove duplicates **in-place** such that each unique element appears only once. The relative order of elements should be kept. Return the number of unique elements $k$. The first $k$ elements of `nums` should hold the unique values.

## Solution

### Pattern

**Two-Pointer (Slow/Fast)**
One pointer tracks the "last unique" position, while the other "explores" the array for new values.

### How to Identify

- **Sorted Input:** Essential because duplicates are guaranteed to be adjacent.
- **In-place Constraint:** You cannot use a `HashSet` or an auxiliary array.
- **Ordered Result:** The unique values must maintain their original sequence.

### Description

Step-by-step explanation:

- **Initialization:** Start pointer $i = 0$. This represents the index of the first unique element.
- **Iteration:** Use a second pointer $j$ starting from $1$ to the end of the array.
- **Comparison:** Compare `nums[i]` (last unique) with `nums[j]` (current explorer).
- **Action:** If `nums[i] != nums[j]`, it means we found a new unique element. Increment $i$ and copy `nums[j]` to `nums[i]`.
- **Completion:** The total count of unique elements is $i + 1$.



### The Intuition

Think of this as **"The Filter and Compact"** method. 

Imagine you are a librarian organizing a shelf of books that are already sorted by title, but some are duplicates. You keep your left hand on the last "unique" book you want to keep. Your right hand scans to the right. Every time your right hand finds a book with a different title, you move your left hand one spot to the right and put that new book there. You don't care about the extra books left on the right side of the shelf.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$ where $n$ is the length of the array. Every element is visited exactly once by the fast pointer.

#### Space Complexity
$O(1)$ auxiliary space is used as the modification happens within the existing array memory.

### Code

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        // Base case: empty arrays have 0 unique elements
        if (nums == null || nums.length == 0) return 0;
        
        // i: The index where the last unique element was placed
        int i = 0;
        
        // j: The fast pointer searching for the next unique element
        for (int j = 1; j < nums.length; j++) {
            // If we find a new value that differs from the last unique one
            if (nums[j] != nums[i]) {
                // Increment our placement index
                i++;
                // Move the new unique value to the front
                nums[i] = nums[j];
            }
        }
        
        // Return count, which is index + 1
        return i + 1;
    }
}
```

## Caveats

- **Sorted Assumption:** If the input is not sorted, this $O(n)$ logic fails. You would need to sort first ($O(n \log n)$) or use $O(n)$ space with a `Set`.
- **Input Modification:** The original array is destroyed. If the original data is needed elsewhere, this "in-place" requirement must be re-evaluated.

## Concepts to Think About

- **Read vs Write:** In scenarios where writes are expensive (e.g., certain types of Flash memory), adding a check `if (i != j)` before the assignment `nums[i] = nums[j]` can reduce unnecessary writes.
- **In-place Algorithms:** Common in system-level programming where memory is a premium resource.
- **Monotonicity:** The fact that the array is sorted allows us to solve this in linear time without look-aheads.

## Logical Follow-up

Question: What if you are allowed to keep at most **two** occurrences of each element?
Solution: Change the comparison to `nums[j] != nums[i-1]`. This allows the first and second occurrence to be kept but skips the third.

Question: What if the array is **not** sorted?
Solution: You cannot achieve $O(1)$ space and $O(n)$ time. You either sort first ($O(n \log n)$ time, $O(1)$ space) or use a `HashSet` ($O(n)$ time, $O(n)$ space).