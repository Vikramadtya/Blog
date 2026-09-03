---
tags:
  - cc
  - searching
---

# Second Largest Element in an Array

## Question
Given an array of integers `nums`, return the value of the second-largest element in the array. If the second-largest element does not exist (e.g., all elements are the same or the array is too small), return $-1$.

## Solution

### Pattern
**Single Pass / Simultaneous Extremum Tracking**

#### How to Identify
* You need to find the "runner-up" value in a collection.
* The problem requires $O(n)$ time complexity (one scan).
* You must ignore duplicates of the largest element to find a distinct second-largest.

### Description
This algorithm maintains two variables, `largest` and `secondLargest`, initialized to the smallest possible integer value. As we iterate through the array, we compare each element to our current `largest`. If a new maximum is found, the previous `largest` is demoted to `secondLargest`. If the current element is not larger than `largest` but is larger than the current `secondLargest` (and not a duplicate of the `largest`), we update `secondLargest`.



### The Intuition
Think of a "King" and a "Prince." 

1. If a new person arrives who is taller than the King, the King is demoted to Prince, and the new person becomes the King.
2. If the new person is shorter than the King but taller than the current Prince, the new person becomes the Prince.
3. If the new person is exactly the same height as the King, we ignore them because we need a distinct second place.

### Complexity

| Label            | Worst           | Average         |
| :--------------- | :-------------- | :-------------- |
| Time Complexity  | $O(n)$          | $O(n)$          |
| Space Complexity | $O(1)$          | $O(1)$          |

### Code

```java
class Solution {
  public int secondLargestElement(int[] nums) {
    // Perimeter Defense: Array must have at least 2 elements
    if (nums == null || nums.length &lt; 2) return -1;

    int largestElement = Integer.MIN_VALUE;
    int secondLargestElement = Integer.MIN_VALUE;

    for (int i = 0; i &lt; nums.length; ++i) {
      if (nums[i] &gt; largestElement) {
        // Demote current largest to second largest
        secondLargestElement = largestElement;
        // Update new largest
        largestElement = nums[i];
      } else if (nums[i] != largestElement && nums[i] &gt; secondLargestElement) {
        // Update second largest only if it's distinct and greater
        secondLargestElement = nums[i];
      }
    }

    // Return -1 if no distinct second largest was found
    return secondLargestElement != Integer.MIN_VALUE ? secondLargestElement : -1;
  }
}
```

## Concepts to Think About

- Distinct vs. Non-Distinct: If the question asked for the second-largest element without needing it to be distinct (e.g., in [10, 10, 8], the second largest is 10), how would you remove the nums[i] != largestElement check?
- Initialization: Why is Integer.MIN_VALUE used? What happens if the array contains Integer.MIN_VALUE as a legitimate element? (Hint: In that case, you might need a boolean flag to track if secondLargest has actually been updated).
- The k-th Largest Generalization: If you were asked for the 3rd or 4th largest, would you keep adding variables (thirdLargest, fourthLargest)? At what point would it be better to use a Min-Priority Queue of size k?
  - Adding explicit variables (e.g., firstLargest, secondLargest, thirdLargest) is a viable approach only when $\(k\)$ is very small and fixed. However, the Min-Priority Queue of size $\(k\)$ is the superior, generalized approach. It is better to use it when $\(k > 3\)$ or when $\(k\)$ is not known until runtime. The min-heap technique ensures that the $\(k\)-th$ largest element is always at the root, maintaining a time complexity of $\(O(n \log k)\)$ 
- Sorting Approach: If you sorted the array first, the time complexity would be O(nlogn). Why is the single-pass O(n) approach significantly better for large-scale data streams?
- Quick Select: For a general k, Quick Select can find the k-th largest element in O(n) average time. How does Quick Select differ from the single-pass approach used here?
