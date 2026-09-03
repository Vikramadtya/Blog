---
tags:
  - cc
  - dynamic-programming
  - subset-sum
  - optimization
---

# Subsequence Sum Existence

## Question

Given an array $nums$ of $n$ integers and a target $k$, return `true` if there exists a subsequence such that the sum of its elements equals $k$. Otherwise, return `false`.

## Solution 1: Top-Down (The Decision Tree)

**Pattern:** Backtracking with Memoization.

- **Intuition:** We simulate every possible subsequence. If we hit the same `(index, k)` twice, we return the cached result.
- **Code Logic:** `solve(idx + 1, k) || solve(idx + 1, k - nums[idx])`

## Solution 2: Bottom-Up (The Building Blocks)

**Pattern:** Tabulation.

- **Intuition:** We fill a 2D grid. Each cell represents a "State" of reachability.
- **Decision:** `dp[i][j] = dp[i-1][j] || dp[i-1][j - nums[i-1]]`.

## Solution 3: Space Optimized (The Collapsed Row)

**Pattern:** 1D DP Array.

- **Intuition:** Since we only ever look at the "previous" row, we use one array and update it in place.
- **The Catch:** You **must** iterate backwards through the sums to prevent a single number from being "re-used" to reach a larger sum in the same iteration.

### Pattern

**Dynamic Programming (0/1 Knapsack Variation)**
This problem is a classic "Subset Sum" problem where each element can either be **included** or **excluded** to reach a target value.

### How to Identify

- **Subsequence/Subset requirement:** Looking for a combination of elements.
- **Fixed Target:** The goal is a specific sum $k$.
- **Binary Choice:** At each element, the only decision is: "Do I pick this or not?"

### Description

Step-by-step explanation:

1.  **State Definition:** We use a boolean array `dp` of size $k+1$, where `dp[i]` is `true` if a sum $i$ can be formed using a subset of elements seen so far.
2.  **Base Case:** `dp[0] = true` because a sum of 0 is always possible using an empty subsequence.
3.  **Iterative Processing:** For each number `num` in `nums`:
    - We iterate backwards through the `dp` array from $k$ down to `num`.
    - **Backwards Loop:** This is critical. By going from $k \to num$, we ensure that each element is only used **once**. If we went forward, we would effectively solve the "Unbounded" version (reusing elements).
4.  **Update Rule:** `dp[i] = dp[i] || dp[i - num]`. If the sum `i - num` was possible, then adding the current `num` makes sum `i` possible.
5.  **Early Exit:** If `dp[k]` becomes `true` at any point, we return immediately.

##### The Core DP Transition: dp[i] = dp[i - num]

###### The Logical Meaning

This line represents the **State Transition Equation**. It connects a problem you've already solved to a slightly larger problem you're trying to solve now.

###### The Components

1. **`i`**: The target sum we are currently considering.
2. **`num`**: The current element from the array we are "trying out."
3. **`i - num`**: The "remainder." The sum we would need to have _already_ formed to make `i` possible.
4. **`dp[i - num]`**: A boolean check. "Is the remainder actually possible?"

###### Why No "Else"?

You'll notice there is no `else { dp[i] = false; }`.
This is because if `dp[i]` was already **True** (found by a different combination of numbers earlier), we don't want to overwrite it with **False**. Once a sum is reachable, it stays reachable.

###### Concepts to Think About

- **Space Optimization:** We only look at `i - num`, which is always a smaller index than `i`. This is why we can get away with a 1D array.
- **The "Take" Decision:** This `if` statement represents the "Take" branch of your recursion. The "Don't Take" branch is handled automatically because if we don't enter the `if`, `dp[i]` simply keeps its previous value.

### The Intuition

Think of the `dp` array as a **reachability map**. Initially, only position 0 is reachable. When you encounter a number (e.g., 5), you look at all currently reachable spots and "jump" 5 units forward from them to mark new reachable spots. Repeating this for all numbers eventually tells you if position $k$ is reachable.

### Complexity

| Label            | Worst          | Average        |
| :--------------- | :------------- | :------------- |
| Time Complexity  | $O(N \cdot K)$ | $O(N \cdot K)$ |
| Space Complexity | $O(K)$         | $O(K)$         |

#### Time Complexity

We iterate through $N$ elements, and for each, we scan up to $K$ values in the `dp` array. Total operations $\approx N \times K$.

#### Space Complexity

We only maintain a single 1D array of size $K+1$. No recursion stack is used.

### Code

```java
class Solution {
    public boolean checkSubsequenceSum(int[] nums, int k) {
        // dp[i] represents if sum 'i' is achievable
        boolean[] dp = new boolean[k + 1];

        // Base case: sum 0 is always possible
        dp[0] = true;

        for (int num : nums) {
            // Optimization: if num > k, it cannot contribute to sum k (assuming positive nums)
            if (num > k) continue;

            // Update dp table backwards to prevent using same element multiple times
            for (int i = k; i >= num; i--) {
                if (dp[i - num]) {
                    dp[i] = true;
                }
            }

            // Early exit
            if (dp[k]) return true;
        }

        return dp[k];
    }
}
```

## Caveats

- **Negative Values:** If the array contains negative numbers, the target $k$ is no longer a strict upper bound for the DP array. You would need to shift the range or use a `HashSet` to store possible sums.
- **Large $K$:** If $K$ is very large (e.g., $10^9$), but $N$ is small ($\le 40$), DP will fail due to memory. Use **Meet-in-the-middle** instead.

## Concepts to Think About

- **0/1 Knapsack:** This is exactly the same logic as the knapsack problem, where "weight" and "value" are the same.
- **Bit Manipulation (Ultimate Optimization):** In Java, you can use `java.util.BitSet`. The update becomes `bitset.or(bitset.shiftLeft(num))`. This uses bitwise parallelism to speed up the $O(K)$ loop by a factor of 64.
- **Reconstructing the Solution:** To find _which_ numbers form the sum, you would need the $O(N \cdot K)$ 2D matrix to backtrack.
- **Space Optimization:** Why backward? If you go forward: $dp[5]$ becomes true from $dp[0]$, then $dp[10]$ becomes true from $dp[5]$ in the _same_ iteration, effectively using the number '5' twice.

### Why Bottom-Up Works (The Snapshot Rule)

#### The Logic

Bottom-Up DP is just a way of saying: "If I have a set of possible sums, and I get a new number $x$, my new set of possible sums is (Old Sums) $\cup$ (Old Sums + $x$)."

#### Why the Backward Loop is Mandatory

- **0/1 Knapsack (Use each once):** We must update the array using only the "Old" information. By moving backwards ($k \to num$), we ensure that when we check `dp[i-num]`, it hasn't been touched by the current number yet. It is a "clean" value from the previous iteration.
- **Unbounded Knapsack (Use many times):** If the problem allowed you to use the same number infinitely, you would move **forwards**.

#### Decision Choice

- **Recursive (Top-Down):** Starts at the goal and asks "What do I need to get here?"
- **Iterative (Bottom-Up):** Starts at 0 and asks "What can I reach from here?"

## Logical Follow-up

Question: What if $K$ is $10^9$ and $N$ is 30?
Solution: Use **Meet-in-the-middle**. Split the array into two halves of size 15. Generate all possible $2^{15}$ sums for each half (Total $\approx 32,768$ sums each). Sort one set and for each sum $s$ in the other set, binary search for $k-s$. Total time: $O(2^{n/2} \cdot n)$.

Question: What if you can use each number an **infinite** number of times?
Solution: This is the **Coin Change** variation. Change the inner loop to run **forward** from `num` to $k$. This allows the current number to be added repeatedly to previously formed sums in the same pass.
