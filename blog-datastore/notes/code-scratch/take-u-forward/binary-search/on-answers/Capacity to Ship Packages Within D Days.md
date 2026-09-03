---
tags:
  - binary-search
  - greedy
  - arrays
---

# Capacity To Ship Packages Within D Days

## Question

Given an array `weights` where `weights[i]` represents the weight of the $i$-th package, and an integer `days`, return the minimum ship weight capacity needed to ship all packages within `days` days. Packages must be shipped in the exact order given.

## Solution

### Pattern

**Binary Search on Answer (with Greedy Validation)**
We cannot easily calculate the exact capacity mathematically. Instead, we define the search space of all possible capacities (from the largest single package to the sum of all packages) and perform a binary search. For each guessed capacity, we use a greedy algorithm to simulate the shipping process and count how many days it takes.

### How to Identify

- The problem asks for the **minimum** capacity/size/time to achieve a goal, or the **maximum** minimum.
- You are required to maintain the **contiguous order** of an array (packages must be shipped in order).
- Simulating the process for a fixed answer takes $O(N)$ time.

### Description

Step-by-step explanation:

1. **Establish Bounds:** The ship must be able to carry at least the heaviest single package (otherwise, that package can never be shipped). This is our `left` bound. The absolute maximum capacity needed is the sum of all packages (shipping everything in 1 day). This is our `right` bound.
2. **Binary Search:** Loop while `left &lt; right`. Calculate the `mid` capacity.
3. **Greedy Simulation:** Pass the `mid` capacity into a helper function. Iterate through the packages in order. Add packages to the ship for the current day until adding the next package would exceed `mid`. When it exceeds, increment the day counter and start a new ship load.
4. **Evaluate and Halve:** - If the total simulated days $\le$ target `days`, this capacity is valid. We record it and try to find a *smaller* valid capacity by setting `right = mid`.
   - If the total simulated days $&gt;$ target `days`, this capacity is too small. We must increase it by setting `left = mid + 1`.
5. **Return:** When the loop terminates (`left == right`), we have converged on the minimum valid capacity.

### The Intuition

Think of this like guessing a number between 1 and 100, but applied to physical limits. 
If you know the absolute smallest ship you could buy holds the heaviest single item, and the absolute largest holds everything at once, the perfect ship size is somewhere in between.
You buy the middle-sized ship and test it. You load packages onto it until it's full, send it off, and repeat. If it takes you 6 days to ship everything but your boss gave you 5 days, the ship is too small. You throw away the lower half of your catalog and look at bigger ships. If it only takes 3 days, you spent too much money on a big ship; you throw away the upper half of the catalog and look at smaller ships.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log(\Sigma W))$ | $O(N \log(\Sigma W))$ |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The size of the search space is $\Sigma W - \max(W)$. We halve this space at each step, resulting in $\log(\Sigma W)$ binary search iterations. During each iteration, we perform a linear $O(N)$ scan to simulate the days. Total time is $O(N \log(\Sigma W))$.

#### Space Complexity

We only allocate a few integer pointers (`left`, `right`, `mid`, `currentLoad`, `days`). Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int left = 0; 
        int right = 0; 

        // left = max single weight (minimum possible capacity)
        // right = sum of all weights (maximum possible capacity)
        for (int w : weights) {
            left = Math.max(left, w);
            right += w;
        }

        while (left &lt; right) {
            int mid = left + (right - left) / 2;

            if (daysRequired(weights, mid) <= days) {
                // Capacity works, but try to find a tighter (smaller) capacity
                right = mid;
            } else {
                // Capacity is too small, we took too many days
                left = mid + 1;
            }
        }

        return left;
    }

    private int daysRequired(int[] weights, int capacity) {
        int days = 1;
        int currentLoad = 0;

        for (int w : weights) {
            if (currentLoad + w &gt; capacity) {
                days++; // Ship departed, start a new day
                currentLoad = 0;
            }
            currentLoad += w; // Load package onto the new day
        }

        return days;
    }
}
```

## Caveats

- **Lower Bound Trap:** A common mistake is initializing `left = 0` or `left = 1`. If `weights = [10]` and `capacity = 5`, the helper function will incorrectly loop or return inaccurate days because the single package can never fit. The lower bound *must* be the maximum element in the array.
- **Array Order:** You cannot sort the array. The problem explicitly states packages are loaded in the order given. Sorting the array destroys the problem constraints.

## Concepts to Think About

- **Binary Search on Answer:** This is a flagship problem for this pattern. Once you master it, you can instantly solve LeetCode 875 (Koko Eating Bananas), LeetCode 410 (Split Array Largest Sum), and LeetCode 1482 (Minimum Number of Days to Make m Bouquets). They are identical algorithms wrapped in different story descriptions.
- **Monotonicity:** Binary search only works because the relationship is monotonically decreasing: as capacity *increases*, the days required *decreases*.

## Logical Follow-up

Question: How would the algorithm change if the order of packages did NOT matter, and you could pick any package to load onto the ship to optimize daily capacity?
Solution: If order doesn't matter, this becomes the classic "Bin Packing Problem," which is NP-Hard. You cannot use a simple greedy $O(N)$ scan anymore. You would have to sort the array descending and use Backtracking/DFS to try different combinations to minimize the number of bins (days). For an exact optimal answer, the time complexity would skyrocket to exponential bounds $O(2^N)$ or require advanced DP with bitmasking if $N$ is small enough.