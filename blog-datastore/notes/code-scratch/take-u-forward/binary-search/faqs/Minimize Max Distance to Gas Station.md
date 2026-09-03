---
tags:
  - binary-search
  - arrays
  - math
---

# Minimise Max Distance to Gas Stations

## Question

Given a sorted integer array `arr` representing positions of $N$ existing gas stations on the X-axis, and an integer $K$, place $K$ new gas stations anywhere on the X-axis. Find the minimum possible value of the maximum distance between adjacent gas stations after all $K$ new stations are added. Your answer must be within $10^{-6}$ of the true value.

## Solution

### Pattern

**Floating-Point Binary Search on Answer**
We cannot efficiently compute the exact optimal placements iteratively if $K$ is massive. However, we know the optimal maximum distance lies somewhere between $0.0$ and the maximum current gap. We binary search this continuous floating-point range. For a "guessed" maximum distance, we greedily calculate how many new stations are required to break up all existing gaps to be $\le$ our guess.

### How to Identify

- The problem asks to **minimize a maximum** (minimize the maximum gap).
- The solution requires high precision (e.g., $10^{-6}$), dictating a continuous floating-point search space rather than discrete integers.
- The constraint on $K$ can be extremely large, rendering $O(K \log N)$ Priority Queue (Max-Heap) approaches unviable.

### Description

Step-by-step explanation:

1. **Establish Bounds:** - **Lower Bound (`left`):** $0.0$. The distance can theoretically be infinitesimal.
   - **Upper Bound (`right`):** The maximum distance between any two adjacent stations in the given array.
2. **Floating-Point Loop:** Loop while the difference between `right` and `left` is strictly greater than the requested precision (`1e-6`).
3. **Calculate Midpoint:** `mid = left + (right - left) / 2.0`. This represents our guessed optimal maximum gap.
4. **Greedy Validation (`canPlaceStations`):**
   - Iterate through every adjacent pair of stations.
   - Calculate the distance between them: `dist = arr[i] - arr[i-1]`.
   - The number of *new* stations required to ensure no resulting segment is larger than `mid` is determined by: `(int)((dist - 1e-9) / mid)`. The `- 1e-9` is crucial for exact divisions (e.g., gap of 2 divided by max limit of 1 should require 1 internal station, not 2).
   - Sum these required stations across all gaps.
   - If total required stations $> K$, our guess `mid` was too strict. Return `false`.
5. **Adjust Bounds (CRITICAL):**
   - Because the search space is continuous, **do not** use `mid + 1` or `mid - epsilon`. 
   - If valid: `right = mid`.
   - If invalid: `left = mid`.
6. **Return:** When the gap closes to $&lt; 10^{-6}$, `right` holds the precise minimized maximum distance.

### The Intuition

Imagine you have a highway with several very long stretches without gas stations. You are given a budget of $K$ new stations to place. Your goal is to ensure drivers never drive more than $X$ miles between stations. 
You guess $X = 50.0$ miles. You inspect a 120-mile stretch. To break it into pieces of 50 or less, you must place 2 stations (creating 3 pieces of 40 miles). You repeat this math for every gap on the highway. 
If you used $10$ stations but your budget was only $5$, your guess of $50.0$ was too small. You need to allow a larger gap. If you only used $3$ stations, your guess worked! But maybe you can squeeze it even tighter, so you try $40.0$ miles. You halve the guess repeatedly until converging on the exact decimal value that perfectly utilizes your budget.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log \frac{M}{\epsilon})$ | $O(N \log \frac{M}{\epsilon})$ |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Let $M$ be the maximum initial distance between any two stations, and $\epsilon$ be the precision tolerance $10^{-6}$. The search space halves in a continuous domain. It takes exactly $\approx \log_2(\frac{M}{10^{-6}})$ steps to converge. Inside the loop, we execute a linear $O(N)$ scan. Total time is $O(N \log \frac{M}{\epsilon})$. Given constraints, this is roughly 50 iterations, making it highly efficient.

#### Space Complexity

We only allocate primitive variables (`left`, `right`, `mid`, `requiredStations`). Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public double minimiseMaxDistance(int[] arr, int k) {
        if (arr == null || arr.length &lt; 2) return 0.0;

        double left = 0;
        double right = 0;

        // Establish the upper bound (maximum initial gap)
        for (int i = 1; i < arr.length; i++) {
            right = Math.max(right, arr[i] - arr[i - 1]);
        }

        // Search space is continuous; define precision threshold (10^-6 precision)
        double diff = 1e-6;

        while (right - left &gt; diff) {
            double mid = left + (right - left) / 2.0;

            if (canPlaceStations(arr, k, mid)) {
                // mid is valid, attempt to find a smaller maximum distance
                right = mid;
            } else {
                // mid is too small, requires more stations than k
                left = mid;
            }
        }

        return right;
    }

    private boolean canPlaceStations(int[] arr, int targetStations, double maxDistance) {
        int requiredStations = 0;
        double epsilon = 1e-9;
        
        for (int i = 1; i &lt; arr.length; i++) {
            double gap = arr[i] - arr[i - 1];
            
            // The -epsilon handles perfectly divisible gaps.
            // E.g., gap 2.0 / maxDist 1.0 requires 1 station, not 2.
            // (2.0 - 1e-9) / 1.0 = 1.999999999 -&gt; truncates to 1.
            requiredStations += (int) ((gap - epsilon) / maxDistance);
            
            // Fast fail
            if (requiredStations &gt; targetStations) return false;
        }

        return true;
    }
}
```

## Caveats

- **Floating-Point Boundaries:** A fatal mistake in floating-point binary searches is treating them like integer array indices (e.g., `left = mid + 0.0001`). If the optimal answer is `3.141592` and `mid` is `3.1415`, adding `0.0001` forces `left` to `3.1416`, permanently skipping over the true answer. Always use strict `left = mid` and `right = mid`.
- **IEEE 754 Precision Errors:** Using `Math.ceil(dist / maxDist) - 1` seems mathematically perfect. However, due to binary representation artifacts, $2.0 / 1.0$ might evaluate to `2.0000000000000004`. `Math.ceil` bumps this to $3$, causing the required stations to overestimate and erroneously fail the validation. Using `(int)` truncation safely sidesteps this.
- **Modulo Operator:** Never use `%` on `double` values to check divisibility; it is unreliable.
- **Scale of K:** If $k$ is small, a Max-Heap approach $O(k \log N)$ is faster, but Binary Search is the general-purpose solution for large $k$
- **Exact Division Trap:** On paper, an exact integer division (e.g., Gap is 2.0, maxDistance is 1.0) mathematically returns 2. However, to break a gap of 2 into pieces of 1, you only need to place 1 internal station. Subtracting an infinitesimally small epsilon from the gap (`gap - 1e-9`) before integer truncation elegantly fixes this.

## Concepts to Think About

- **The Priority Queue (Max-Heap) Alternative:** You can solve this by pushing all initial gaps into a Max-Heap. You pop the largest gap, increment its internal station count, recalculate its new split gap size, and push it back, repeating $K$ times. While conceptually intuitive, the time complexity is $O(K \log N)$. If $K = 10^9$, this approach will Time Limit Exceed (TLE). Binary search is universally superior here because its runtime is decoupled from $K$'s magnitude.
- **Numerical Stability:** Dealing with floating-point underflow/overflow.
- **Fixed Iterations vs. Epsilon Loop:** Trade-offs in termination conditions.
- **Greedy vs. BS:** When to use a Priority Queue vs. Binary Search on Answer.
- **NP-Hardness:** How "contiguous" requirements (like in Book Allocation) simplify problems that would otherwise be NP-hard (like Partition).

## Logical Follow-up

Question: If we use `(int)(gap / maxDistance)`, won't it fail if the gap is exactly divisible? (e.g., Gap is 2, maxDistance is 1. `(int)(2/1) = 2`, but we only need 1 station!)
Solution: On paper, exact integer division fails this truncation check. However, because we are executing a continuous binary search with a tolerance of $10^{-6}$, the algorithm naturally tests values infinitesimally larger than the integer (e.g., `mid = 1.0000001`). When it evaluates `(int)(2.0 / 1.0000001)`, it safely truncates to `1`, which correctly satisfies the budget constraint. The continuous nature of the binary search automatically "saves" the division from its exact-integer flaw, rendering the algorithm perfectly accurate within the accepted tolerance.

Question: If you were given a very small $k$ (e.g., $k=10$) but $n=1,000,000$, would this approach still be the best?
Solution: No. In that case, an $O(k \log n)$ approach using a Max-Heap would be faster. You would store all current gaps in the heap and repeatedly split the largest one.

Question: Can we parallelize this?
Solution: Yes. The predicate function `getRequiredStations` is a simple summation over an array, which can be easily distributed across multiple cores or even using MapReduce for massive datasets.
