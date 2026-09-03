---
tags:
  - cc
  - array
  - two-pointers
---

# Array Rotation (Left and Right)

## Question

Given an integer array $nums$ and a non-negative integer $k$, rotate the array:

1.  **To the Right:** $k$ elements from the back move to the front.
2.  **To the Left:** $k$ elements from the front move to the back.

The operation must be performed **in-place** with $O(1)$ extra space.

## Solution

### Pattern

**The Triple Reversal Algorithm**
A mathematical property where an array can be divided into two parts $A$ and $B$. By reversing $A$, then $B$, then the entire array $Reverse(A)Reverse(B)$, we achieve a cyclic shift.

### How to Identify

- Requirement for **in-place** modification of a sequence.
- Cyclic shifts or rotations where elements "wrap around."
- Constraints demanding $O(1)$ space and $O(n)$ time.

### Description

Step-by-step explanation:

- **Step 1: Normalize $k$.** Since rotating $n$ times is a null operation, set $k = k \pmod n$.
- **Step 2: Partition the Array.** - For **Right Rotation**: Divide at index $n - k$.
    - For **Left Rotation**: Divide at index $k$.
- **Step 3: Reverse the Parts.**
    - Reverse the first part.
    - Reverse the second part.
- **Step 4: Global Reverse.**
    - Reverse the entire array from index $0$ to $n - 1$.



### The Intuition

Think of the array as two separate blocks: $X$ and $Y$. 
If you want to move $X$ to the end (Left Rotation), the goal is to transform $[X, Y]$ into $[Y, X]$.
1.  Reverse $X \rightarrow [X^R, Y]$
2.  Reverse $Y \rightarrow [X^R, Y^R]$
3.  Reverse the whole thing $\rightarrow [(X^R, Y^R)^R] = [Y, X]$



### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$. Each element is swapped a maximum of two times across the three reversal steps ($2n$ operations), which simplifies to linear time.

#### Space Complexity
$O(1)$. Only a single temporary variable is used for swapping, regardless of input size.

### Code

```java
class Solution {
    /**
     * Rotates array to the right by k steps.
     * Logic: Reverse (0 to n-k-1), then (n-k to n-1), then (0 to n-1)
     */
    public void rotateRight(int[] nums, int k) {
        if (nums == null || nums.length < 2) return;
        int n = nums.length;
        k %= n;
        if (k == 0) return;

        reverse(nums, 0, n - k - 1);
        reverse(nums, n - k, n - 1);
        reverse(nums, 0, n - 1);
    }

    /**
     * Rotates array to the left by k steps.
     * Logic: Reverse (0 to k-1), then (k to n-1), then (0 to n-1)
     */
    public void rotateLeft(int[] nums, int k) {
        if (nums == null || nums.length < 2) return;
        int n = nums.length;
        k %= n;
        if (k == 0) return;

        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
        reverse(nums, 0, n - 1);
    }

    private void reverse(int[] nums, int start, int end) {
        while (start < end) {
            int temp = nums[start];
            nums[start] = nums[end];
            nums[end] = temp;
            start++;
            end--;
        }
    }
}
```

## Caveats

- **$k=0$ or $k=n$:** Always perform the modulus and check if $k$ is 0 to avoid unnecessary processing.
- **Empty Arrays:** Defensive coding for `null` or `length == 0` is essential for production-grade code.
- **Integer Overflow:** If $k$ is provided as a very large long, casting and modulus must be done carefully.

## Concepts to Think About

- **Cyclic Buffers:** In many real-world applications (like OS kernels), instead of shifting data, we move the "start" pointer in a virtual circular array.
- **Cache Locality:** The reversal algorithm is faster than the "Juggling" algorithm because it accesses memory in a linear, predictable sequence, which modern CPUs optimize via prefetching.
- **GCD Juggling:** Understanding how the Greatest Common Divisor determines the number of cycles in a permutation.
- **Left vs. Right Rotation:** To perform a Right Rotation by k, the logic is slightly different. You would reverse the last k elements, then the first n−k, then the whole. Can you see how the "split point" moves?
- **The Juggling Algorithm**: There is another O(1) space approach using the Greatest Common Divisor (GCD) of n and k. It moves elements in "cycles." While harder to code, it performs fewer total assignments than the Reversal method.
- **Block Swap Algorith**m: This is another O(n) time approach that is very efficient for large k. It works by swapping blocks of size k recursively.
- Why Modulo? If n=5 and k=7, rotating 7 times is the same as rotating 2 times (7(mod5)). Always include this to show you understand cyclic properties.

- 
## Logical Follow-up

Question: Can you solve this with $O(1)$ space **without** using the reversal trick?
Solution: Use the **Juggling Algorithm**. Calculate $g = GCD(n, k)$. There are $g$ cycles to process. For each cycle, move elements to their target positions $(i + k) \pmod n$ one by one.

Question: How would you rotate a **linked list** by $k$?
Solution: Find the $(n-k)^{th}$ node, make the list circular by connecting the tail to the head, set the new head to the $(n-k+1)^{th}$ node, and break the circular connection.