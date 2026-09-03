---
tags:
  - arrays
  - boyer-moore
  - counting
---

# Majority Element

## Question

Given an array `nums` of size $n$, return the majority element. The majority element is the element that appears strictly more than $\lfloor n / 2 \rfloor$ times. You may assume that the majority element always exists in the array.

## Solution

### Pattern

**Boyer-Moore Majority Vote Algorithm**

Maintains a single candidate and a counter. It relies on the mathematical guarantee that if an element appears more than half the time, it will survive mutually assured destruction (1-to-1 cancellation) with all other elements.

### How to Identify

- Problem asks for an element appearing $> \lfloor n/2 \rfloor$ times.
- There is a strict requirement for $O(1)$ space (disqualifying HashMaps).
- The problem implies streaming data (processing elements one by one without looking back).

### Description

Step-by-step explanation:

1. Initialize two variables: `candidate` (to store the current suspected majority) and `count = 0` (to track its "strength").
2. Iterate through the array one element at a time.
3. At each step, check if `count == 0`. If it is, we have no active candidate, so assign the current element to `candidate`.
4. Next, check if the current element matches the `candidate`. 
   - If it matches, increment `count` by 1.
   - If it differs, decrement `count` by 1.
5. By the end of the array, the `candidate` variable will hold the majority element.
6. *(Optional but recommended for general cases)* Run a second pass to count the occurrences of `candidate` to ensure it actually exceeds $\lfloor n/2 \rfloor$ if a majority is not explicitly guaranteed.

### The Intuition

Think of the algorithm as a battlefield. 
Every element is a soldier, and their value represents their faction. 
When two soldiers from *different* factions meet, they fight and kill each other (cancellation, `count--`). When a soldier meets a member of their *own* faction, they group up (reinforcement, `count++`). 
Because the majority faction has strictly more soldiers than all other factions combined ($> n/2$), even if every single minority soldier perfectly coordinates to kill a majority soldier, the minority will run out of soldiers first. The last man standing *must* belong to the majority faction.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

We iterate through the array of size $N$ exactly once (or twice if verification is needed). All operations inside the loop are constant time $O(1)$. Thus, time complexity is strictly $O(N)$.

#### Space Complexity

We allocate exactly two integer variables (`candidate` and `count`) regardless of the size of the input array. No auxiliary data structures are used, yielding $O(1)$ space.

### Code

```java
class Solution {
    public int majorityElement(int[] nums) {
        int candidate = 0;
        int count = 0;
        
        for (int num : nums) {
            if (count == 0) {
                candidate = num;
            }
            
            // Adjust the weight/strength of the current candidate
            count += (num == candidate) ? 1 : -1;
        }
        
        return candidate;
    }
}
```

## Caveats

- **No Majority Exists:** If the array does not have a strict majority (e.g., `[1, 2, 3]`), the first pass will still output a candidate (in this case, `3`), which is a false positive. Always add a second verification pass if the constraints do not guarantee a majority.
- **Most Frequent $\neq$ Majority:** This algorithm only works for strict majorities ($> n/2$). If you need to find the most frequent element that appears, say, 40% of the time, Boyer-Moore will fail. You must use a HashMap.

## Concepts to Think About

- **Cache Locality:** Boyer-Moore is extraordinarily fast in practice compared to HashMaps, not just because of Big-O, but because traversing a contiguous array once is highly optimized by CPU cache prefetching.
- **Streaming Data:** This algorithm is heavily used in networking and stream processing because you don't need all data in memory at once; you just need to keep a running count of the current candidate.
- **Distributed Systems:** You can split the array into chunks, run BM on each chunk to get local candidates, and then merge the candidates to find the global majority, making it map-reduce friendly.
- **Verification Pass:** In real-world scenarios where a majority element isn't guaranteed, you must perform a second pass to count the occurrences of the candidate. If the count is ≤n/2, the candidate is "fake."
- **Generalization (Boyer-Moore for n/3):** If you need to find elements that appear more than n/3 times, you need two candidates and two counters. This is known as the Misra-Gries algorithm.
- **Sorting Trick:** If you sort the array, the majority element is always at index ⌊n/2⌋. Why? Because it spans more than half the array, it must cross the midpoint. This is O(nlogn) time but very simple to write.
- **Bit Manipulation:** You can determine each bit of the majority element by counting the frequency of 1s and 0s at each of the 32 bit positions. The majority bit at each position forms the majority element.
- **Randomization:** If you pick an element at random, there is a >50% chance it's the majority element. You can verify this in O(n). The expected number of attempts is constant, leading to an O(n) average-case algorithm.

## Logical Follow-up

**Question:** What if we need to find all elements that appear strictly more than $\lfloor n/3 \rfloor$ times? Can you still do this in $O(1)$ space?

**Solution:** Yes, using **Boyer-Moore Voting Algorithm II**. Since there can be at most *two* elements that appear more than $n/3$ times, we maintain *two* candidates and *two* counters. 

- If an element matches candidate A, increment count A. 
- If it matches B, increment count B. 
- If it matches neither, decrement BOTH counts. 
- If either count hits 0, replace that candidate.
Finally, run a second pass to verify both candidates, as the first pass may yield false positives. This remains $O(N)$ time and $O(1)$ space.
