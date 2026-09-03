---
tags:
  - cc
  - arrays
  - sliding-window
---

# Max Consecutive Ones

## Question

Given a binary array $nums$, find and return the maximum number of consecutive $1$s present in the array.

$$nums = [1, 1, 0, 1, 1, 1] \rightarrow \text{Output: } 3$$

## Solution

### Pattern

**Running Stream Window Accumulator**

A single-pointer iteration technique that captures local contiguous properties by accumulating state until a delimiter/reset condition is encountered.

### How to Identify

- The target objective requires finding a continuous/contiguous sequence matching a strict criterion.
- The input stream is parsed unidirectionally without needing look-ahead descriptors.
- Global maxima must be extracted from independent local subsets.

### Description

Step-by-step explanation:

- **Step 1: Trackers.** Establish two integer allocation metrics: `currentStreak` (running local accumulator initialized to 0) and `maxStreak` (the global ceiling record initialized to 0).
- **Step 2: Scan.** Loop linearly across the sequence from index $0$ to $n-1$.
- **Step 3: Branch Logic.** - If the item is $1$, increment `currentStreak` by $1$ and immediately evaluate if it surpasses the global `maxStreak`.
    - If the item is $0$, the continuous sequence is broken. Reset `currentStreak` back to $0$.
- **Step 4: Return.** Output `maxStreak` after the collection loop scope terminates.

### The Intuition

Think of this algorithm as an **Odometer Trip Meter**. 



Imagine driving along a road looking for the longest continuous stretch of green landscape. Every mile marker that shows green landscape causes you to click up your local trip meter by one unit. The exact moment you hit a patch of desert (a $0$), you look at your trip meter, note it down if it's the highest number you've ever seen, and smash the trip meter reset button back to zero. You do not carry the previous score over into the next green stretch.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$. The sequence is evaluated via a single pass. Inside the loop, only constant-time $O(1)$ primitive tracking operations take place.

#### Space Complexity
$O(1)$. Auxiliary memory allocation is decoupled from the length of the input data structure.

### Code

```java
class Solution {
    /**
     * Identifies the maximum sequence of consecutive ones.
     * Enforces readability and structural type-safety.
     */
    public int findMaxConsecutiveOnes(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int maxStreak = 0;
        int currentStreak = 0;

        for (int num : nums) {
            if (num == 1) {
                currentStreak++;
                // Update global maximum inline with local expansion
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                // Delimiter found: Collapse local window tracking state
                currentStreak = 0;
            }
        }

        return maxStreak;
    }
}
```

## Caveats

- **Redundant Global Updates:** Placing the global maximum check outside the conditional branch structure forces the CPU to evaluate comparisons even when the local streak gets wiped out to zero.
- **Strict Data Assumptions:** Relying on algebraic mathematical equations like `count * num + num` assumes the dataset cannot be poisoned by non-binary integers.

## Concepts to Think About

- **Branchless Programming:** Using equations instead of `if-else` jumps avoids branch mispredictions but trades off performance if complex instructions (multiplication) are injected.
- **Loop Unrolling:** For performance-critical arrays, parsing items in chunks of 4 or 8 elements can drastically lower iteration cycle requirements.
- **Cache Prefetch Efficiency:** Sequential access arrays minimize cache misses due to spatial locality principles.
- **Sliding Window**: This problem is a very basic version of the Sliding Window pattern. How would the logic change if you were allowed to flip one 0 into a 1 to get a longer sequence?
- **Early Exit**: Is there any scenario where you could stop the loop early? (e.g., if maxCount is already greater than half the array length and the remaining elements aren't enough to beat it).
- **Stream Processing**: If this data was coming from a live network stream and you couldn't store the whole array, would this algorithm still work? (Yes, because it only needs the current element and two variables).
- **Bit Manipulation**: Could you solve this by converting the array to a string or a large integer and using bitwise shifts? (Usually not efficient for arrays, but an interesting thought experiment for bitmasks).


## Logical Follow-up

Question: What if you could flip at most **one** $0$ to a $1$? Find the maximum consecutive $1$s.
Solution: Track the window using two pointers (`left` and `right`). Keep an internal count of zeros within the window bounds. If the number of zeros exceeds 1, advance `left` until the zero-count drops back to 1. Track the maximum width ($right - left + 1$).

Question: What if you can flip at most **$k$** zeros? (Max Consecutive Ones III)
Solution: Generalize the sliding window. Maintain a dynamic window boundary $[left, right]$. Expand `right` and track the zero count. If `zeroCount > k`, shrink the window by moving `left` forward until the internal state balance invariant is re-established.

