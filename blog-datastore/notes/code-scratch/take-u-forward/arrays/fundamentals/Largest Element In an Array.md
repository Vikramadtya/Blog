---
tags:
  - cc
  - searching
---

# Largest Element in an Array

## Question

Given an array of integers `nums`, return the value of the largest element in the array.

## Solution

### Pattern

**Greedy Accumulation / Single Pass Scan**

### How to Identify

* You need to find a single extremum (maximum or minimum) in an unsorted collection.
* The problem requires looking at every element at least once.

### Description

The algorithm initializes a tracker variable with the first element of the array. It then iterates through the rest of the array, comparing each current element with the tracker. If the current element is larger, the tracker is updated. 

### The Intuition

Imagine you are watching a line of people walk through a door one by one. You want to remember the tallest person. You look at the first person and memorize their height. As each subsequent person walks through, you only update your memory if the new person is taller than the one you currently remember. By the time the last person passes, your memory holds the height of the tallest person in the entire group.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | $\text{O}(n)$   | $\text{O}(n)$   |
| Space Complexity | $\text{O}(1)$   | $\text{O}(1)$   |

### Code

```java
class Solution {
    public int largestElement(int[] nums) {
        // Guardrail: handle null or empty arrays
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array must not be empty");
        }

        // Initialize with the first element
        int maxSoFar = nums[0];

        // Start loop from the second element
        for (int i = 1; i &lt; nums.length; ++i) {
            // Update if a larger value is found
            if (nums[i] &gt; maxSoFar) {
                maxSoFar = nums[i];
            }
        }

        return maxSoFar;
    }
}
```

### Concepts to Think About

- **Initialization Risk:** You initialized `maxSoFar = nums[0]`. What happens if the array is empty? A more robust initialization for general cases (if you couldn't use `nums[0]`) might be `Integer.MIN_VALUE`. However, using `nums[0]` is often better because it ensures `maxSoFar` is actually a value from the set.
- **Finding the Index:** How would you modify this to return the **index** of the largest element instead of the value? (Hint: track `maxIndex` and compare `nums[i] > nums[maxIndex]`).
- **Library Functions:** In a production environment, you might use `Arrays.stream(nums).max().getAsInt()`. While more concise, why is the manual `for` loop generally faster in performance-critical Java code?
  - A manual (traditional) for loop is generally faster because it has minimal abstraction overhead and offers predictable execution for the Just-In-Time (JIT) compiler to optimize.
- **Tournament Method:** There is a "Divide and Conquer" approach to finding the max and min simultaneously using $(3n/2) - 2$ comparisons. When would that be more efficient than two separate passes?
  - The "Divide and Conquer" approach for finding the maximum and minimum simultaneously is more efficient than two separate passes when the cost of comparisons is high and the dataset $(\(n\))$ is relatively large, particularly because it reduces the worst-case number of comparisons to $\(\lceil \frac{3n}{2} \rceil - 2\)$, compared to the $\(2n - 2\)$ comparisons required by a naive two-pass approach
- **Data Types:** If the array contained `long` or `double`, would the logic change? What if the array was sorted? (If sorted, the max is simply `nums[nums.length - 1]`, reducing complexity to $\text{O}(1)$).
