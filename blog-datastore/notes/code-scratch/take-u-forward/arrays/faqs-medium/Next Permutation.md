---
tags:
  - math
  - arrays
  - two-pointers
---

# Next Permutation

## Question

Given an array of integers `nums`, find its next lexicographically greater permutation in-place using $O(1)$ extra memory. If such an arrangement is impossible (i.e., the array is sorted in descending order), rearrange it into the lowest possible order (ascending).

## Solution

### Pattern

**Suffix Reversal (Narayana Pandita's Algorithm)**
Identify the longest non-increasing suffix. The element immediately preceding it is the "pivot". Swap the pivot with its next-largest successor in the suffix, then reverse the suffix to yield the smallest possible lexicographical jump.

### How to Identify

- The problem explicitly asks for a "next", "previous", or "k-th" permutation.
- The term "lexicographical order" is emphasized.
- Requirements force in-place modification without utilizing combinatorial generation algorithms.

### Description

Step-by-step explanation:

1. **Find the Pivot:** Traverse the array from right to left to find the first pair of adjacent elements where `nums[i] &lt; nums[i+1]`. The index `i` is our `pivot`. (Everything to the right of the pivot is strictly in descending/non-increasing order, meaning that suffix is at its maximum possible permutation).
2. **Handle Max Permutation:** If no such pivot exists (i.e., the pointer drops below 0), the entire array is in descending order. It is the absolute last permutation. We simply reverse the whole array to reset to the first permutation.
3. **Find the Successor:** If a pivot is found, we traverse from right to left again to find the first element `nums[j]` that is strictly greater than `nums[pivot]`. This is the smallest possible number we can swap the pivot with to increase the overall sequence.
4. **Swap:** Swap the elements at `pivot` and `successor`.
5. **Reverse Suffix:** Even after the swap, the suffix remains in descending order. To make the sequence as small as possible (the *immediate* next permutation), the suffix must be in ascending order. We achieve this efficiently by simply reversing the suffix from `pivot + 1` to the end.

### The Intuition

Think of permutation like an odometer or a dictionary. 
Consider the sequence `[1, 3, 5, 4, 2]`. 
If you want to find the very next word in a dictionary, you look at the suffix `[5, 4, 2]`. This suffix is already fully maximized (descending). You cannot rearrange `5, 4, 2` to make a larger number. 
Therefore, you must increment the number *just before* it, which is `3` (the pivot). 
What do you replace `3` with? You look in your suffix for the smallest number larger than `3`. That's `4`. 
Swap them: `[1, 4, 5, 3, 2]`. 
Now, your prefix `[1, 4]` is correct, but your suffix `[5, 3, 2]` is huge. To make the *smallest* possible word starting with `1, 4`, the remaining letters must be in alphabetical (ascending) order. Since `[5, 3, 2]` is currently strictly descending, reversing it makes it strictly ascending: `[2, 3, 5]`. 
Final result: `[1, 4, 2, 3, 5]`.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Finding the pivot takes $O(N)$. Finding the successor takes $O(N)$. Reversing the suffix takes $O(N)$. The sequential operations scale strictly linearly. Thus, worst-case time complexity is $O(N)$.

#### Space Complexity

The algorithm modifies the array strictly in-place, requiring only a few integer pointers (`pivot`, `successor`). Thus, auxiliary space is $O(1)$.

### Code

```java
class Solution {
    public void nextPermutation(int[] nums) {
        if (nums == null || nums.length &lt;= 1) return;
        
        int pivot = nums.length - 2;
        
        // 1. Find the first dip from the right
        while (pivot &gt;= 0 && nums[pivot] &gt;= nums[pivot + 1]) {
            pivot--;
        }
        
        // 2. If a dip exists, find the rightmost element greater than the dip
        if (pivot >= 0) {
            int successor = nums.length - 1;
            while (nums[successor] &lt;= nums[pivot]) {
                successor--;
            }
            swap(nums, pivot, successor);
        }
        
        // 3. Reverse the descending suffix to make it ascending
        reverse(nums, pivot + 1, nums.length - 1);
    }
    
    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
    
    private void reverse(int[] nums, int i, int j) {
        while (i &lt; j) {
            swap(nums, i++, j--);
        }
    }
}
```

### Caveats

- **Duplicate Elements:** The condition `nums[pivot] &gt;= nums[pivot + 1]` (note the `&gt;=`) is critical. If you use `>`, the algorithm fails on arrays with duplicates (e.g., `[1, 1, 5]`), either deadlocking or swapping incorrectly.
- **Sorting vs Reversing:** Never use `Arrays.sort()` on the suffix. It degrades the complexity to $O(N \log N)$. Mathematical proof guarantees the suffix is always descending, making a simple two-pointer reverse $O(N)$ mathematically sound and optimal.
- **Lexicographical Generation:** This algorithm is the basis for generating all permutations in order.
- **Dictionary Order:** The logic mimics how words are ordered in a dictionary (e.g., "ABZ" -> "AC B").
- **Partial Sorting:** Reversing a descending suffix is a shortcut for sorting it in ascending order.
- **Pivot Logic:** This "pivot and swap" pattern appears in other problems like "Previous Permutation with One Swap."


### Concepts to Think About

- **Previous Permutation:** The exact inverse of this algorithm yields the *previous* permutation. You look for the first *ascending* break from the right, swap it with the largest element smaller than it, and reverse the suffix.
- **Factorial Number System:** Permutations can be mapped 1-to-1 with integers using the Factorial Number System (Lehmer codes). This is how you calculate the exact rank/index of a permutation mathematically.
- **Graphing the Array:** If you plot the array values on a line graph, the algorithm essentially finds the highest peak from the right, and modifies the element immediately preceding that peak.

### Logical Follow-up

Question: How would you find the $k$-th permutation of the sequence `[1, 2, ..., n]` without generating all permutations in between? (LeetCode 60: Permutation Sequence)

Solution: You cannot use the "Next Permutation" algorithm $k$ times, as that would be $O(k \cdot n)$ which is too slow (since $k$ can be up to $n!$). Instead, we use math. We know there are $(n-1)!$ permutations that start with '1', $(n-1)!$ that start with '2', etc. By dividing $k$ by $(n-1)!$, we can mathematically determine the first digit in $O(1)$ time. We remove that digit from our available pool, update $k = k \pmod{(n-1)!}$, and repeat for the next digit. This determines the exact sequence in $O(n^2)$ time (due to array element removal) or $O(n \log n)$ using a specialized tree.

Question: What if the problem asked for the next *palindrome* instead of the next permutation?

Solution: The core philosophy is similar (mirroring/reversing halves). You mirror the left half of the string onto the right half. If the resulting string is greater than the original, you are done. If it is smaller or equal, you must increment the middle character(s) by 1 (handling carries if it's '9'), and then mirror the left half onto the right half again.

### Logical Follow-up

Question: How would you find the **Previous Permutation**?
Solution: Reverse the logic. Find the first increasing element from the right ($nums[i] > nums[i+1]$), find the largest element smaller than it in the suffix, swap, and then reverse the suffix (which will be in ascending order) to make it descending.

Question: How can you find the **k-th permutation** of $n$ numbers without generating all of them?
Solution: Use the **Factorial Number System**. Since there are $(n-1)!$ permutations starting with a specific digit, you can mathematically determine which digit belongs at each position by dividing $k$ by the current factorial.