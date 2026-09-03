---
tags:
  - cc
  - searching
---

# Max Consecutive Ones

## Question
Given a binary array `nums`, return the maximum number of consecutive $1$s in the array. A binary array contains only $0$s and $1$s.

## Solution

### Pattern
**Linear Scan / Running Counter**

#### How to Identify
* The problem asks for the "longest" or "maximum" sequence of a specific value.
* The data is processed in a single direction without needing to look back multiple times.
* No sorting is required.

### Description
We traverse the array once. We maintain a `currentCount` that increments whenever we encounter a $1$. If we encounter a $0$, we compare the `currentCount` with our `maxCount` to store the highest value found so far, then reset `currentCount` to $0$.



### The Intuition
Imagine you are counting how many days in a row it has rained. Every rainy day ($1$), you add one to your streak. If you see a sunny day ($0$), your streak is broken. You write down your longest streak on a piece of paper, reset your daily count to zero, and wait for the next rainy day.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | $O(n)$          | $O(n)$          |
| Space Complexity | $O(1)$          | $O(1)$          |

### Code

```java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        // Perimeter Defense
        if (nums == null || nums.length == 0) return 0;

        int maxCount = 0;
        int currentCount = 0;

        for (int num : nums) {
            if (num == 1) {
                currentCount++;
                // Update max immediately to handle arrays ending in 1
                if (currentCount > maxCount) {
                    maxCount = currentCount;
                }
            } else {
                // Streak broken by a 0
                currentCount = 0;
            }
        }

        return maxCount;
    }
}
```



## Concepts to Think About

- Sliding Window: This problem is a very basic version of the Sliding Window pattern. How would the logic change if you were allowed to flip one 0 into a 1 to get a longer sequence?
- Early Exit: Is there any scenario where you could stop the loop early? (e.g., if maxCount is already greater than half the array length and the remaining elements aren't enough to beat it).
- Stream Processing: If this data was coming from a live network stream and you couldn't store the whole array, would this algorithm still work? (Yes, because it only needs the current element and two variables).
- Bit Manipulation: Could you solve this by converting the array to a string or a large integer and using bitwise shifts? (Usually not efficient for arrays, but an interesting thought experiment for bitmasks).
