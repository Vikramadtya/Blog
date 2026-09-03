---
tags:
  - binary-search
  - greedy
  - sorting
---

# Aggressive Cows

## Question

Given an array `stalls` representing positions on a coordinate line and an integer `k` representing the number of aggressive cows. Assign stalls to the $k$ cows such that the minimum distance between any two cows is as large as possible (i.e., **maximize the minimum distance**). Return this maximum possible minimum distance.

## Solution

### Pattern

**Binary Search on Answer (Maximize the Minimum)**
Instead of calculating distances between combinations of stalls, we define a search space of all possible "minimum distances" (from 1 up to the total span of the stalls). We binary search this space. For a "guessed" minimum distance, we use a greedy algorithm to see if we can successfully place $k$ cows that far apart. If we can, we try a larger distance. If we can't, we try a smaller distance.

### How to Identify

- The problem asks to **"maximize a minimum"** or **"minimize a maximum"**.
- The search space is monotonic (if a distance $D$ is valid, any distance $&lt; D$ is definitely valid. If $D$ is invalid, any distance $&gt; D$ is definitely invalid).
- Simulating a configuration for a fixed value takes $O(N)$ greedy time.

### Description

Step-by-step explanation:

1. **Sort the Array:** The stalls must be sorted so we can greedily place cows from left to right.

2. **Establish Bounds:** - `left = 1`: The absolute smallest possible distance between two distinct integer stalls.
       - `right = stalls[n-1] - stalls[0]`: The absolute largest distance possible (placing only two cows at the extreme ends).

3. **Binary Search:** Loop while `left &lt;= right`. Calculate `mid` as the "guessed" minimum distance.

4. **Greedy Validation (`canPlaceCows`):**
      - Always place the first cow in the very first stall (`stalls[0]`). This is mathematically optimal to maximize remaining space.
      - Iterate through the remaining stalls. If the distance between the current stall and the `lastPlacedPosition` is $\ge mid$, place a cow here.
      - If we successfully place all $k$ cows, return `true`. If the loop finishes and we placed $< k$ cows, return `false`.

5. **Adjust Bounds:**
      - If `true`: The distance `mid` is possible. But we want to *maximize* it, so we throw away the lower half: `left = mid + 1`.
      - If `false`: The distance `mid` is too large; we couldn't fit the cows. Throw away the upper half: `right = mid - 1`.

6. **Return:** When the loop breaks, `right` will point to the largest valid distance.

### The Intuition

Think of this like setting a restraining order distance between $k$ people in a room with fixed chairs. 
You guess they need to sit 10 feet apart. You put the first person in the first chair. You walk down the row. The next chair is 3 feet away. Too close. The next is 8 feet. Too close. The next is 11 feet away. Perfect! You put the second person there. 
If you manage to seat everyone, a 10-foot restraining order works. But maybe you can push them 12 feet apart? You try a larger number. 
If you run out of chairs before seating everyone, 10 feet was too strict. You have to settle for 8 feet. You binary search this exact threshold.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log N + N \log M)$ | $O(N \log N + N \log M)$ |
| Space Complexity | $O(\log N)$    | $O(\log N)$      |

#### Time Complexity

Let $N$ be the number of stalls and $M$ be the distance between the first and last stall.
1. Sorting the stalls takes $O(N \log N)$ time.
2. The binary search takes $O(\log M)$ iterations.
3. Inside the binary search, the greedy check takes $O(N)$ time.
Total Time: $O(N \log N + N \log M)$.

#### Space Complexity

The algorithm uses $O(1)$ auxiliary variables. However, the in-place sorting algorithm (like Dual-Pivot Quicksort in Java) requires $O(\log N)$ space for the recursion stack.

### Code

```java
import java.util.Arrays;

class Solution {
    public int aggressiveCows(int[] stalls, int cows) {
        if (stalls == null || stalls.length < cows) return -1;
        
        // 1. Sort is mandatory for greedy placement
        Arrays.sort(stalls);
        
        // 2. Define search space
        int left = 1; 
        int right = stalls[stalls.length - 1] - stalls[0];
        
        // 3. Binary Search
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (canPlaceCows(stalls, cows, mid)) {
                // Valid, try to find a larger distance
                left = mid + 1;
            } else {
                // Invalid, distance too large
                right = mid - 1;
            }
        }
        
        return right;
    }
    
    private boolean canPlaceCows(int[] stalls, int totalCows, int minDistance) {
        int cowsPlaced = 1; // Always place first cow at index 0
        int lastPlacedPosition = stalls[0];
        
        for (int i = 1; i < stalls.length; i++) {
            if (stalls[i] - lastPlacedPosition &gt;= minDistance) {
                cowsPlaced++;
                lastPlacedPosition = stalls[i];
                
                // Fast-fail to save linear scan time
                if (cowsPlaced == totalCows) return true;
            }
        }
        
        return false;
    }
}
```

## Caveats

- **Forgetting to Sort:** The input array is often given unsorted in this problem. The greedy choice (placing the cow at the very next available stall $\ge D$) only works if you are scanning a sorted number line.
- **Returning `left` vs `right`:** Because the condition is `left &lt;= right`, when the loop terminates, `left` and `right` cross. `left` points to the first *invalid* distance, and `right` points to the last *valid* distance. Since we are maximizing the valid state, we return `right`.
- **Sorting Requirement:** Many candidates forget that the greedy placement only works if the stalls are sorted. Without sorting, the check becomes a variation of the NP-Hard Clique problem.
- **Search Space Range:** If coordinates are very large (e.g., $10^9$), the $\log D$ factor remains small ($\approx 30$), making this highly efficient.

## Concepts to Think About

- **The Master Template:** This problem is the inverse twin of LeetCode 410 (*Split Array Largest Sum* / *Painter's Partition* / *Book Allocation*). 

  - Those problems ask to **Minimize a Maximum** $\rightarrow$ Search for valid states, adjust `right = mid - 1`, return `left`.
  - Aggressive Cows asks to **Maximize a Minimum** $\rightarrow$ Search for valid states, adjust `left = mid + 1`, return `right`.

- **Maximize Minimum vs Minimize Maximum:** Both are solved via Binary Search on Answer Space. For "Minimize Maximum," the greedy check logic and bound updates are simply mirrored.
- **Floating Point:** If stall positions were doubles, the binary search would use a fixed number of iterations (e.g., 100) or a `while (right - left &gt; precision)`.
- **Integer Overflow:** `(right + left) / 2` can overflow if `right` and `left` are large; always use `left + (right - left) / 2`.

## Logical Follow-up

Question: Why is it always optimal to place the first cow in the very first stall (`stalls[0]`)?

Solution: Placing the first cow at `stalls[0]` maximizes the remaining distance available for all subsequent cows. If you were to place the first cow at `stalls[1]`, you are strictly reducing the remaining coordinate space on the right side without gaining any benefit on the left side (since no cow is placed before it). Therefore, a configuration starting at index 1 can never yield a larger minimum distance than one starting at index 0.

Question: What if the stalls are arranged in a **Circle**?

Solution: This is significantly harder. If circular, the distance between the last cow and the first cow also counts. You would need to run the greedy check fixing the first cow at different positions or use a "broken circle" approach where you duplicate the array and use a sliding window logic within the binary search check.

Question: What if each cow has a different "Aggression Level" (needs a different minimum distance from others)?

Solution: Binary search on answer space no longer works directly because there isn't a single "min distance" to optimize. This would likely require a Dynamic Programming approach or a more complex Greedy strategy if the aggression levels are sorted.
