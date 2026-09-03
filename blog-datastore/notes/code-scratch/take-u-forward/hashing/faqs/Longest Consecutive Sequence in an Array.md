---
tags:
  - arrays
  - hash-table
  - sequence
---

# Longest Consecutive Sequence

## Question

Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in strictly $O(n)$ time.

## Solution

### Pattern

**Intelligent Sequence Start (Hash Set)**
Load all elements into a Hash Set for $O(1)$ lookups. Iterate through the elements, but only initiate a sequence-building loop if the current element is the absolute starting point of a sequence (i.e., its predecessor does not exist).

### How to Identify

- The problem explicitly bans $O(n \log n)$ sorting.
- You need to find contiguous grouping or sequences within unsorted data.
- The phrase "consecutive elements" strongly hints at $x, x+1, x+2$ relationships which map perfectly to $O(1)$ Hash Set lookups.

### Description

Step-by-step explanation:

1. Insert every element of the array into a `HashSet`. This automatically handles duplicates and provides $O(1)$ lookups.
2. Iterate through the unique elements in the `HashSet`.
3. For every element `x`, check if `x - 1` exists in the set.
   - If `x - 1` **does** exist, it means `x` is just a middle element of some sequence. Skip it.
   - If `x - 1` **does not** exist, `x` is the guaranteed start of a sequence.
4. From this starting point `x`, use a `while` loop to check if `x + 1`, `x + 2`, etc., exist in the set, incrementing a streak counter as you go.
5. Update the global maximum streak length against your current streak.
6. Return the global maximum.

### The Intuition

Think of finding the longest chain of connected train cars scattered in a yard. 
If you walk up to a random train car, you could look in both directions to find the ends. This is tedious and requires marking cars as "visited" so you don't count them twice.
Instead, a smarter approach is to walk up to a car and ask: "Is there a car attached to the front of this one?" If the answer is yes, you immediately walk away. You *only* start walking down the length of the train if you are standing exactly at the engine (the very first car). By doing this, you only walk down each train exactly once, directly achieving $O(n)$ time without needing to mark or destroy cars.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n^2)$       | $O(n)$           |
| Space Complexity | $O(n)$         | $O(n)$           |

#### Time Complexity

Adding elements to the Hash Set takes $O(n)$. During the iteration, the `while` loop strictly runs only for elements that belong to a sequence, and it only moves forward. Consequently, the inner `while` loop will only execute a maximum of $n$ times globally across the entire run. This yields an average $O(n)$ time complexity. (Worst-case is $O(n^2)$ due to theoretical hash collisions).

#### Space Complexity

We allocate a Hash Set to store the numbers. In the worst case (all unique numbers), it stores $n$ integers, resulting in $O(n)$ auxiliary space.

### Code

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        if (nums == null || nums.length == 0) return 0;

        Set&lt;Integer&gt; set = new HashSet<>();
        for (int num : nums) {
            set.add(num);
        }

        int maxLength = 0;

        // Iterate over the set to avoid processing duplicate array elements
        for (int num : set) {
            // Check if it's the start of a sequence
            if (!set.contains(num - 1)) {
                int currentNum = num;
                int currentStreak = 1;

                // Expand the sequence
                while (set.contains(currentNum + 1)) {
                    currentNum++;
                    currentStreak++;
                }

                maxLength = Math.max(maxLength, currentStreak);
            }
        }

        return maxLength;
    }
}
```

## Caveats

- **Hash Collisions:** While rare, if a maliciously crafted input forces all elements to hash to the same bucket, the HashSet degrades to a linked list (or Tree in modern Java), degrading time complexity to $O(n^2)$ or $O(n \log n)$. 
- **Memory Overhead:** A `HashSet` of `Integer` objects in Java carries significant memory overhead (object headers, table pointers) compared to a primitive `int[]`. For massive datasets, this can cause out-of-memory errors where an in-place sort would survive.

## Concepts to Think About

- **Amortized Analysis:** The $O(n)$ time complexity comes from *amortized* analysis. Even though there is a nested `while` loop, we prove that the inner loop's condition is only met $n$ times *in total*, not $n$ times per outer loop iteration.
- **Destructive vs Non-Destructive Algorithms:** Modifying an input or auxiliary structure (like deleting set elements) can achieve performance targets but violates immutability principles in robust systems.
- **Union-Find:** This problem can also be solved using the Disjoint Set Union (DSU) pattern, mapping each number to a disjoint set and maintaining the sizes of the connected components.

## Logical Follow-up

Question: What if the problem strictly required $O(1)$ auxiliary space?
Solution: If $O(1)$ space is rigidly enforced, $O(n)$ time is impossible. We must fall back to sorting the array in-place using Heapsort ($O(n \log n)$ time). After sorting, we iterate once through the array, incrementing our streak if `nums[i] == nums[i-1] + 1`, resetting if they differ by $> 1$, and skipping if they are identical. 

Question: What if the numbers are streaming in dynamically, and you need to query the `longestConsecutive` length at any given time?
Solution: A simple HashSet approach fails because re-scanning takes $O(n)$. We must use a `HashMap&lt;Integer, Integer&gt;` to track the *boundary lengths* of sequences. When a new number `x` arrives, we check if `x-1` and `x+1` exist. If so, we calculate the new merged sequence length `L = leftLength + rightLength + 1`. We then update the boundaries `map.put(x - leftLength, L)` and `map.put(x + rightLength, L)`. This allows $O(1)$ insertion and $O(1)$ query time for the longest sequence.
