---
tags:
  - divide-and-conquer
  - sorting
  - merge-sort
  - arrays
---

# Count Inversions in an Array

## Question

Given an integer array `nums`, return the number of inversions in the array. Two elements `nums[i]` and `nums[j]` form an inversion if `nums[i] > nums[j]` and $i &lt; j$.

## Solution

### Pattern

**Divide and Conquer (Modified Merge Sort)**
As you perform a standard Merge Sort, count the number of times an element from the right subarray is placed into the sorted array before elements from the left subarray. 

### How to Identify

- The problem asks for pairs `(i, j)` that satisfy an inequality condition (e.g., `nums[i] &gt; nums[j]`, `nums[i] > 2 * nums[j]`).
- A brute-force approach requires a nested loop taking $O(N^2)$ time.
- The condition relies on relative ordering, suggesting that sorting the array might reveal information.

### Description

Step-by-step explanation:

1. **Divide:** Split the array into two halves until you reach subarrays of size 1. A subarray of size 1 has 0 inversions.
2. **Conquer:** Recursively count the inversions in the left half and the right half.
3. **Merge and Count (The core logic):** - Set pointer `i` at the start of the left sorted half, and `j` at the start of the right sorted half.
   - Compare `nums[i]` and `nums[j]`.
   - If `nums[i] &lt;= nums[j]`, there is no inversion. Place `nums[i]` into a temporary array and advance `i`.
   - If `nums[i] &gt; nums[j]`, we found an inversion! Because the left half is already sorted, if `nums[i]` is strictly greater than `nums[j]`, then *every* element after `i` in the left half is *also* greater than `nums[j]`. 
   - Therefore, instead of counting 1 inversion, we add `(mid - i + 1)` to our inversion count. Place `nums[j]` into the temporary array and advance `j`.
4. **Finalize:** Copy any remaining elements to the temporary array, then copy the temporary array back into the original array. Return the sum of left inversions, right inversions, and merge inversions.

### The Intuition

Think of two lines of students arranged by height (shortest to tallest). 
Line A (Left) and Line B (Right). Because Line A was originally standing in front of Line B, anyone in Line A *should* be shorter than anyone in Line B.
You are combining them into a single sorted line.
You look at the first student in Line A and the first student in Line B. 
If the student in Line B is actually *shorter* than the student in Line A, it means the Line B student is "out of order" relative to the Line A student. Furthermore, because Line A is already sorted, the Line B student is also out of order relative to *everyone standing behind* the first student in Line A. By taking the Line B student and putting them into the final sorted line, you resolve a whole block of "inversions" at once without having to count them individually.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log N)$  | $O(N \log N)$    |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

The array is divided in half $\log_2 N$ times. At each level of the recursion tree, merging the subarrays touches every element exactly once, taking $O(N)$ time. Thus, the total time is strictly $O(N \log N)$.

#### Space Complexity

We allocate a single auxiliary array of size $N$ to facilitate the merging process. The recursive call stack goes $\log N$ deep. Total space is $O(N) + O(\log N) = O(N)$.

### Code

```java
class Solution {
    public long numberOfInversions(int[] nums) {
        if (nums == null || nums.length &lt; 2) return 0;
        // Allocate temp array ONCE to avoid GC thrashing during recursion
        int[] temp = new int[nums.length];
        return mergeSortAndCount(nums, temp, 0, nums.length - 1);
    }

    private long mergeSortAndCount(int[] nums, int[] temp, int start, int end) {
        if (start &gt;= end) return 0;

        int mid = start + (end - start) / 2;

        long inversions = 0;
        inversions += mergeSortAndCount(nums, temp, start, mid);
        inversions += mergeSortAndCount(nums, temp, mid + 1, end);
        inversions += mergeAndCount(nums, temp, start, mid, end);
        
        return inversions;
    }

    private long mergeAndCount(int[] nums, int[] temp, int start, int mid, int end) {
        int i = start, j = mid + 1, t = start;
        long inversions = 0;

        while (i &lt;= mid && j &lt;= end) {
            if (nums[i] <= nums[j]) {
                temp[t++] = nums[i++];
            } else {
                // If nums[i] &gt; nums[j], all elements from i to mid are &gt; nums[j]
                inversions += (mid - i + 1);
                temp[t++] = nums[j++]; 
            }
        }

        while (i &lt;= mid) temp[t++] = nums[i++];
        while (j &lt;= end) temp[t++] = nums[j++];        

        for (i = start; i <= end; i++) nums[i] = temp[i];
        
        return inversions;
    }  
}
```

## Caveats

- **Integer Overflow:** The maximum number of inversions in a strictly descending array of size $N$ is $\frac{N(N-1)}{2}$. For $N = 10^5$, this is roughly $5 \times 10^9$, which exceeds the 32-bit `Integer.MAX_VALUE` ($2.14 \times 10^9$). The return type and internal counters **must** be `long`.
- **Pre-allocating Arrays:** Never use `new int[]` inside the recursive `merge` function. It works mathematically, but in an enterprise environment, dynamically allocating and destroying thousands of arrays during an $O(N \log N)$ operation causes catastrophic garbage collection pauses.
- **Stability:** The comparison `nums[i] <= nums[j]` is vital. Using `<` would incorrectly count identical elements as inversions.
- **Large Inputs:** Always use `long` for the count; `int` will overflow for $n &gt; 65,536$ in a worst-case scenario (descending order).
- **Data Modification:** This algorithm sorts the input array in-place. If the original order must be preserved, a copy must be made first.

## Concepts to Think About

- **Alternative (Fenwick Tree / BIT):** You can also solve this by iterating from right to left, querying a Binary Indexed Tree for "how many numbers smaller than `nums[i]` have I seen so far?", and then updating the tree. This is also $O(N \log N)$ but requires coordinate compression if the numbers are large or negative.
- **Stability:** Merge sort is a stable sort. The condition `nums[i] &lt;= nums[j]` ensures that equal elements maintain their relative order, which is why we don't count an inversion for equal elements.
- **Sorted List / AVL Trees:** Inserting into a balanced BST and counting elements to the right can also count inversions.
- **Relationship to Bubble Sort:** The inversion count is equal to the number of adjacent swaps Bubble Sort would perform.
- **Standardized Space:** Why is $O(n)$ space necessary for merging? (Hint: In-place merging exists but is $O(n^2)$ or extremely complex).

## Logical Follow-up

Question: What if the problem was "Reverse Pairs" (LeetCode 493), where an inversion is strictly defined as `nums[i] &gt; 2 * nums[j]` and $i &lt; j$?

Solution: We use the exact same Merge Sort structure. However, we can no longer merge and count in the same step. Why? Because the condition for merging (`nums[i] <= nums[j]`) is different from the condition for counting (`nums[i] &gt; 2 * nums[j]`). Before the standard merge step, we write a separate $O(N)$ `while` loop that iterates through the left array and finds how many elements in the right array satisfy the `&gt; 2 * nums[j]` condition. Then we merge normally. Overall time remains $O(N \log N)$.

Question: Can we solve this in $O(n \log n)$ time with $O(1)$ auxiliary space?

Solution: Only if we use an in-place merge sort (like the "Gap Method" or Block Merge Sort), which are significantly more complex and often have higher constant factors. In a standard interview, $O(n)$ is the expected space complexity.