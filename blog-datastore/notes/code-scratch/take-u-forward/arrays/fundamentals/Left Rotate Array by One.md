---
tags:
  - cc
  - arrays
  - traversal
---

# Left Rotate Array by One

## Question

Given an integer array $nums$, rotate the array to the left by exactly one position. For an array $[a_0, a_1, a_2, \dots, a_{n-1}]$, the result should be $[a_1, a_2, \dots, a_{n-1}, a_0]$.

## Solution

### Pattern

**Single-Pass Shifting (Save and Shift)**

The first element is preserved as it will be overwritten first. Every other element is shifted one index to the left in a single linear scan.

### How to Identify

- Requirement for a cyclic shift or rotation.
- Constraint of $O(1)$ auxiliary space.
- Problems involving moving a set of data by a fixed offset.

### Description

Step-by-step explanation:

- **Check Base Cases:** If the array is null or has fewer than two elements, no rotation is needed.
- **Preserve the Lead:** Store the first element (`nums[0]`) in a temporary variable. This is necessary because the second element will overwrite the first in the first iteration of the loop.
- **Linear Shift:** Iterate from index $i = 1$ to $n-1$. At each step, move the element at the current index to the position immediately to its left ($nums[i-1] = nums[i]$).
- **Wrap Around:** Once the loop completes, place the preserved first element into the last position of the array ($nums[n-1]$).

 to [2, 3, 4, 5, 1]]

### The Intuition

Think of this as **"The Musical Chairs"** of data. 
If everyone in a line of chairs needs to move one seat to the left, the person in the very first seat has nowhere to go. They must stand up first (the `temp` variable). Then, everyone else can move into the seat that just became empty. Finally, the person who stood up walks to the very end of the line and takes the now-empty last seat.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$ because we iterate through the array once to shift $n-1$ elements.

#### Space Complexity
$O(1)$ because we only use one additional memory location to store the first element, regardless of the size of the array.

### Code

```java
class Solution {
    /**
     * Performs an in-place left rotation of the array by one position.
     * * @param nums The input array to be modified.
     */
    public void rotateArrayByOne(int[] nums) {
        // Guard against null or arrays that don't need rotation
        if (nums == null || nums.length < 2) {
            return;
        }

        // 1. Store the first element (it will be overwritten first)
        int first = nums[0];

        // 2. Shift all elements from index 1 to the end one position left
        for (int i = 1; i < nums.length; i++) {
            nums[i - 1] = nums[i];
        }

        // 3. Place the original first element at the end
        nums[nums.length - 1] = first;
    }
}
```

## Caveats

- **Empty Arrays:** Passing an empty array must be handled to avoid `ArrayIndexOutOfBoundsException`.
- **Large Data:** While $O(n)$ is fast, if you were doing this millions of times on a massive array, you would treat the array as a **Circular Buffer** (using a `start` pointer) instead of physically moving memory.

## Concepts to Think About

- **Cyclic Properties:** Left rotation by 1 is the same as right rotation by $n-1$.
- **Buffer Management:** This shifting is a core component of `ArrayList.remove(0)` logic.
- **Memory Locality:** Linear shifts are very cache-friendly as they access memory sequentially.
- **In-place Operations:** This algorithm is highly space-efficient as it doesn't require a duplicate array.
- **Large k values**: If k is larger than the array length n, the effective rotation is actually k(modn). Why is this important for performance?
- **Data Structures**: If this were a Doubly Linked List instead of an array, could you perform a rotation in O(1) time? (Hint: Think about moving the head and tail pointers).

## Logical Follow-up

Question: How would you rotate the array by **$k$** positions?
Solution 1: **Brute Force:** Repeat the "rotate by one" logic $k$ times. Time: $O(n \cdot k)$, Space: $O(1)$.
Solution 2: **Reversal Algorithm:** 1. Reverse the first $k$ elements.
2. Reverse the remaining $n-k$ elements.
3. Reverse the whole array.
Time: $O(n)$, Space: $O(1)$. This is the most optimal interview answer.

Question: What is the **Juggling Algorithm**?
Solution: A more complex $O(n)$ time and $O(1)$ space rotation algorithm based on the Greatest Common Divisor (GCD) of $n$ and $k$. It moves elements in sets (cycles).