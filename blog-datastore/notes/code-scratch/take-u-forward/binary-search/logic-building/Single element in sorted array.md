---
tags:
  - binary-search
  - bit-manipulation
  - arrays
---

# Single Element in a Sorted Array

## Question

You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Return the single element. You must achieve $O(\log n)$ time and $O(1)$ space.

## Solution

### Pattern

**Binary Search on Index Parity**
Use binary search to find the point where the pattern of pairs breaks. Before the single element, identical pairs occupy `(even, odd)` indices. After the single element, the pattern shifts to `(odd, even)`.

### How to Identify

- The array is explicitly stated to be **sorted**.
- The problem demands $O(\log n)$ time complexity, instantly disqualifying the standard $O(N)$ XOR bit-manipulation approach for finding single elements.
- The array elements follow a strict mathematical pairing structure.

### Description

Step-by-step explanation (using the Even-Index Normalization method):

1. Initialize standard binary search pointers: `left = 0`, `right = nums.length - 1`.
2. Loop while `left < right`.
3. Calculate `mid = left + (right - left) / 2`.
4. **Normalize `mid`:** We want to guarantee we are always looking at the *start* of a potential pair. Since pairs normally start at even indices, if `mid` is odd, decrement it: `if (mid % 2 != 0) mid--;`.
5. Check if the pair is intact: `nums[mid] == nums[mid + 1]`.
   - **If TRUE:** The pairs are perfectly aligned up to this point `(even, odd)`. This means the sequence hasn't been disrupted yet. The single element *must* exist somewhere to the right. Shrink the window: `left = mid + 2`.
   - **If FALSE:** The pair is broken. This means the single element has already disrupted the sequence. The single element is either at `mid` itself, or it is somewhere to the left. Shrink the window: `right = mid`.
6. When the loop terminates, `left` equals `right`, pointing precisely at the single element. Return `nums[left]`.

### The Intuition

Imagine couples lined up in pairs, wearing shirts with numbers on them.
Normally, the couples stand in positions `(0, 1)`, `(2, 3)`, `(4, 5)`. 
Suddenly, a single person pushes into the line. 
Because someone inserted themselves, every couple standing *after* the single person gets pushed back by exactly one spot. Their positions shift to `(odd, even)`. 
By checking a couple in the middle of the line, you instantly know where the single person is. If the couple is standing in `(even, odd)` spots, everything is fine, and the single person must be further down the line. If the couple is messed up and standing in `(odd, even)` spots, the single person must have pushed in somewhere before them.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log N)$    | $O(\log N)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space is halved in every iteration of the `while` loop. For an array of size $N$, this takes at most $\log_2(N)$ iterations. 

#### Space Complexity

The algorithm uses only primitive pointers (`left`, `right`, `mid`), operating entirely in place. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int singleNonDuplicate(int[] nums) {
        if (nums == null || nums.length == 0) return -1;

        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            // Force 'mid' to always evaluate the start of a pair (even index)
            if (mid % 2 != 0) {
                mid--;
            }

            // Check if the pair starting at the even index is intact
            if (nums[mid] == nums[mid + 1]) {
                // Pattern unbroken, the single element is to the right
                left = mid + 2;
            } else {
                // Pattern broken, the single element is at mid or to the left
                right = mid;
            }
        }
        
        return nums[left];
    }
}
```

## Caveats

- **Bitwise Alternative:** You can entirely replace the `mid % 2` check and the `mid + 1` check with `if (nums[mid] == nums[mid ^ 1])`. The bitwise XOR operator `^ 1` magically pairs every even number with the next odd number, and every odd number with the preceding even number. This is highly compact but sometimes harder to explain in a whiteboard setting.
- **Out of Bounds Check:** By ensuring `mid` is always even, and because the array is always an odd length (e.g., $2N + 1$), `mid + 1` is mathematically guaranteed to never exceed `nums.length - 1`. You do not need to check `mid + 1 < nums.length` to prevent out-of-bounds exceptions.

## Concepts to Think About

- **Unsorted Arrays:** If the array was *not* sorted, binary search is impossible. You would fall back to the $O(N)$ Time, $O(1)$ Space Bitwise XOR approach (XORing all elements together cancels out pairs, leaving only the single element).
- **Parity Shifts:** Parity (odd/even) is a powerful invariant in computer science. Disruptions in parity almost always allow for $O(\log N)$ searching.
- The XOR Invariant: i ^ 1 is a powerful way to toggle between adjacent indices in pairs. It’s cleaner than manual parity checks.
- Search Space: Why does this only work if the total length is odd? (Because pairs + one element always equals an odd number).
- Parity Shift: Visualizing the array as a sequence of pairs (a,a),(b,b),(c),(d,d) makes the "break" point obvious.


## Logical Follow-up

**Question:** Suppose an array contains elements where every element appears exactly *three* times, except for one element which appears exactly once. The array is NOT sorted. How do you find the single element in $O(1)$ space? (LeetCode 137: Single Number II)

**Solution:** You cannot use binary search or simple XOR. Instead, you count the set bits for all numbers at each of the 32 bit positions. Because numbers appear three times, the sum of bits at any position $i$ must be a multiple of 3. If it is not a multiple of 3 (i.e., `sum % 3 != 0`), it means the single number has a 1-bit at position $i$. You reconstruct the single number bit-by-bit. Time: $O(32 \cdot N) = O(N)$. Space: $O(1)$.



**Question:** "What if the array is **not sorted**, but you still have pairs and one single element? Can you do it in $O(\log n)$"

**Solution:** **No.** If the array is not sorted, you lose the parity property. You would have to use a **Bitwise XOR** of all elements: $a \oplus a \oplus b \oplus b \oplus c = c$. This would take $O(n)$ time and $O(1)$ space.

**Question (The "Median of Two Sorted Arrays" Twist):**
"You are given two sorted arrays `nums1` and `nums2` of size $m$ and $n$ respectively. Find the **median** of the two sorted arrays. The overall run time complexity should be $O(\log(min(m, n)))$."

**Solution:**
This is the ultimate test of "Binary Search on Partitions."

1. **Goal:** We need to partition both arrays such that the left side has the same number of elements as the right side, and all elements on the left are $\le$ all elements on the right.
2. **Binary Search on Smallest Array:** We only binary search on the smaller array to find the partition point `i`. The partition point `j` for the second array is then calculated as `(m + n + 1) / 2 - i`.
3. **Check Boundaries:** \* Is $nums1[i-1] \le nums2[j]$?
   - Is $nums2[j-1] \le nums1[i]$?
4. **Edge Cases:** If the total length is odd, the median is `max(L1, L2)`. If even, it's `(max(L1, L2) + min(R1, R2)) / 2`.
