---
tags:
  - arrays
  - two-pointers
  - simulation
---

# Rearrange Array Elements by Sign

## Question

Given a 0-indexed integer array `nums` of even length with an equal number of positive and negative integers, rearrange the array such that:
1. Every consecutive pair of integers have opposite signs.
2. For all integers with the same sign, their relative order is preserved.
3. The rearranged array begins with a positive integer.

Return the modified array.

## Solution

### Pattern

**Two Pointers with Pre-allocated Array**
Allocate a result array and use two separate pointers (starting at index 0 and 1) to track the next insertion position for positive and negative streams, jumping by 2.

### How to Identify

- Problem involves interleaving or alternating elements based on a condition (sign, parity).
- There is a strict requirement to **preserve relative order** (stability).
- An $O(N)$ time constraint strongly hints that in-place swapping won't work, as in-place stable partitioning is highly complex and slower than $O(N)$.

### Description

Step-by-step explanation:

1. Create a new array `result` of the same length as the input array.
2. Initialize two pointers: `posIndex = 0` (even indices for positives) and `negIndex = 1` (odd indices for negatives).
3. Iterate through every element `num` in the original array `nums` sequentially (left to right).
4. If `num` is positive, place it at `result[posIndex]` and increment `posIndex` by 2 to point to the next available even index.
5. If `num` is negative, place it at `result[negIndex]` and increment `negIndex` by 2 to point to the next available odd index.
6. Because we read the original array left-to-right and place elements immediately, the relative order of both positive and negative elements is mathematically guaranteed to be preserved.

### The Intuition

Think of this as directing two streams of traffic (positive cars and negative cars) into a single parking lot with assigned spots. 
All even spots are reserved for positive cars, and all odd spots are reserved for negative cars. 
Because we process the incoming traffic sequentially, the first positive car gets the first positive spot, the second gets the second, etc. We never have to shift cars around once they are parked, ensuring perfect relative ordering in exactly one pass.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

We iterate through the array of size $N$ exactly once. Index lookups and assignments are $O(1)$. Therefore, the time complexity is strictly $O(N)$.

#### Space Complexity

We must allocate a new array of size $N$ to store the output. No additional auxiliary data structures (like queues or stacks) are needed, yielding $O(N)$ space.

### Code

```java
class Solution {
    public int[] rearrangeArray(int[] nums) {
        int[] result = new int[nums.length];
        
        // Positives go to even indices, negatives go to odd indices
        int posIndex = 0;
        int negIndex = 1;
        
        for (int num : nums) {
            if (num > 0) {
                result[posIndex] = num;
                posIndex += 2;
            } else {
                result[negIndex] = num;
                negIndex += 2;
            }
        }
        
        return result;
    }
}
```

## Caveats

- **Strict Memory Constraints:** If the environment has severe memory constraints (e.g., embedded systems) where $O(N)$ extra space is impossible, this approach fails. You must fallback to an in-place algorithm and sacrifice time complexity.
- **Unequal Counts:** This algorithm assumes the count of positive and negative numbers is perfectly balanced. If unequal, you will hit an `ArrayIndexOutOfBoundsException`.

## Concepts to Think About

- **Stable vs Unstable Partitioning:** If the problem *didn't* require preserving the relative order (stability), you could solve this in $O(N)$ time and $O(1)$ space using a variation of the Dutch National Flag algorithm (swapping elements in place). 
- **In-place Stable Partitioning limitation:** Achieving $O(1)$ space and preserving relative order in $O(N)$ time is a famous unsolved problem in computer science. Knowing this theoretical limit prevents you from wasting time trying to invent an impossible solution during an interview.
- **Data Locality:** Pre-allocating an array and writing to it sequentially is extremely cache-friendly, making this approach blazing fast at the CPU level despite the memory allocation overhead.

- **Stability:** This approach is "stable" because we process nums from left to right. Why is it impossible to do this in O(1) space and O(n) time while remaining stable? (Look up "Stable In-Place Partitioning").
- **Unequal Counts:** How would your logic change if the number of positive and negative integers were not equal? You would likely need to fill the remaining slots with whatever numbers are left over at the end of the array.
- **Follow-up - In-place (Unstable):** If the interviewer says "I don't care about the original order, just alternate the signs in O(1) space," how would you use a two-pointer approach to swap elements in-place?
- **Data Streams:** If nums was a stream of data (too large to fit in an array), could you still produce an alternating output? (Hint: You would need two Queues to buffer the "wrong-signed" numbers until their slot comes up).


## Logical Follow-up

Question: What if the array has an *unequal* number of positive and negative integers? The rules remain the same, but once you run out of pairs, simply append the remaining elements at the end, preserving their relative order.
Solution: We use two passes (or Fallback Lists). First, use two separate Lists (or dynamic arrays) to collect all positive and negative numbers separately. Then, iterate and overwrite the original array: as long as both lists have elements, interleave them. Once one list is exhausted, just sequentially write the remaining elements from the other list. This takes $O(N)$ time and $O(N)$ space.

Question: Can you solve the original problem in $O(1)$ space? (Follow-up often asked to test your understanding of algorithmic tradeoffs).
Solution: Yes, but we must sacrifice the $O(N)$ time complexity. We can use the **Array Rotation** technique. We iterate through the array to find the first out-of-place element (e.g., a negative number at an even index). Then we find the next positive number ahead of it. We right-rotate the subarray between these two indices to bring the positive number into the correct position while shifting the negative numbers down. Because array rotation takes $O(K)$ time (where $K$ is the distance shifted), the overall worst-case time complexity degrades to $O(N^2)$.

