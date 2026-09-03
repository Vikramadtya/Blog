---
tags:
  - arrays
  - greedy
  - right-to-left
---

# Leaders in an Array

## Question

Given an integer array `nums`, return a list of all leaders. An element is a leader if it is **strictly greater** than all elements to its right. The rightmost element is always a leader. The result must maintain the original relative order of the elements.

## Solution

### Pattern

**Reverse Traversal (Right-to-Left)**
When an element's valid state depends on an aggregate metric (like a maximum) of all elements to its "future" (right side), iterate backward. Carry the state backward to compute answers in $O(1)$ time per element.

### How to Identify

- The problem definition explicitly references comparing an element to "all elements to its right".
- A brute force solution requires a nested loop (yielding $O(N^2)$).
- The metric being checked is aggregatable (e.g., tracking a maximum, minimum, or sum).

### Description

Step-by-step explanation:

1. Validate the input (handle null or empty arrays).
2. Instantiate an empty list to store the results.
3. Define the base case: The rightmost element is always a leader. Add `nums[length - 1]` to the list and set `maxRight` to this value.
4. Iterate backward through the array, starting from the second-to-last element (`length - 2`) down to `0`.
5. At each step, compare `nums[i]` to `maxRight`. 
6. If `nums[i]` is *strictly greater* than `maxRight`, it is a new leader. Add it to the list and update `maxRight = nums[i]`.
7. Because we processed the array backward, our list of leaders is currently in reverse chronological order.
8. Call a standard library reverse function (like `Collections.reverse()`) on the list to restore left-to-right order.
9. Return the list.

### The Intuition

Think of a group of people of varying heights standing in a line, facing to the right. A person is a "leader" if they can see over the heads of everyone in front of them (to their right). 
If you walk from left to right, you don't know if a person is a leader until you check every single person in front of them. 
But if you start at the very front of the line (the rightmost person) and walk backward, you simply need to remember the height of the tallest person you've seen so far. If the next person you step back to is taller than your recorded "tallest person", they are a leader, and they become the new tallest person.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

We traverse the array of size $N$ exactly once. The loop performs constant time $O(1)$ operations. The list reversal at the end takes $O(K)$ time, where $K$ is the number of leaders ($K \le N$). Total time complexity is strictly $O(N)$.

#### Space Complexity

The returned list must store the leaders. In the worst case (an array strictly sorted in descending order, e.g., `[5, 4, 3, 2, 1]`), every element is a leader, requiring $O(N)$ space. Auxiliary space (excluding the output) is $O(1)$.

### Code

```java
class Solution {
    public List&lt;Integer&gt; leaders(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new ArrayList<>();
        }

        List&lt;Integer&gt; leaders = new ArrayList<>();
        
        // Seed the maximum with the rightmost element to avoid Integer.MIN_VALUE bugs
        int maxRight = nums[nums.length - 1];
        leaders.add(maxRight);
        
        for (int i = nums.length - 2; i >= 0; i--) {
            // A leader must be strictly greater
            if (nums[i] > maxRight) {
                leaders.add(nums[i]);
                maxRight = nums[i];
            }
        }

        // Restore original array order
        Collections.reverse(leaders);

        return leaders;
    }
}
```

## Caveats

- **Prepending vs. Reversing:** Never use `leaders.add(0, nums[i])` inside the loop to maintain order. Inserting at the 0th index of an `ArrayList` forces all existing elements to shift, degrading the time complexity to $O(N^2)$. Appending to the end and reversing once at the end is mathematically superior ($O(N)$).
- **Streaming Constraints:** If the elements arrive as an infinite forward-only stream, reverse traversal is physically impossible. You must use a Monotonic Stack instead.

## Concepts to Think About

- **Integer Boundaries:** Initializing a maximum tracker to `Integer.MIN_VALUE` is a common reflex, but it introduces edge-case bugs if the array elements can actually equal `Integer.MIN_VALUE`. Initializing state trackers using the first valid element of the data structure is always safer.
- **Monotonic Arrays:** If the input array is sorted in ascending order, only the last element is a leader. If sorted in descending order, all elements are leaders.
- **Strictly Greater vs Greater-Than-Or-Equal:** The prompt dictates "strictly greater". If the array is `[2, 2, 2]`, only the final `2` is a leader. Ensure the inequality check is `>` and not `>=`. If the problem allowed equal values, how would the > sign change? Would the rightmost still be a leader?
- **Monotonic Stack**: This problem is a precursor to the "Next Greater Element" problem. Could you solve this using a Stack? (Hint: A monotonic decreasing stack can keep track of leaders).
- **Stream Processing**: If you were receiving these numbers one by one from a live stream, could you still identify leaders in O(1) auxiliary space? (Hint: No, because you wouldn't know what's coming to the right yet).
- **Suffix Max Array**: You could pre-calculate a suffixMax array where suffixMax[i] stores the maximum value from i to n-1. How does this change the space complexity?
- **Space Trade-offs**: If the interviewer forbids `Collections.reverse()`, how could you use a Deque or an array with two pointers to build the result in the correct order from the start?


## Logical Follow-up

Question: What if the array is continuously streaming left-to-right, and you must maintain the current list of leaders at any given time?
Solution: Reverse traversal is impossible here. We must use a **Monotonic Decreasing Stack**. As each new element arrives, we pop all elements from the top of the stack that are less than or equal to the new element (because the new element just "overtook" them, stripping them of their leader status). Then, we push the new element. At any point, the stack contains the current valid leaders from left to right. This maintains $O(N)$ time complexity and $O(N)$ space.

Question: Replace every element in an array with the greatest element strictly to its right (and `-1` for the last element).
Solution: This uses the exact same reverse-traversal pattern, but modifies the array in-place. We keep a `maxRight` variable (initialized to `-1`). During the backward loop, we cache the current element in a temporary variable, overwrite the current element with `maxRight`, and then update `maxRight` against the temporary variable. This takes $O(N)$ time and $O(1)$ auxiliary space.


