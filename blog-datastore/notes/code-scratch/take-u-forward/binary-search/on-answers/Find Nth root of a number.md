---
tags:
  - binary-search
  - math
---

# Find Nth Root of M

## Question

Given two integers $N$ and $M$, find the $N$th root of $M$. The $N$th root of $M$ is defined as an integer $X$ such that $X^N = M$. If the $N$th root is not an integer, return `-1`.

## Solution

### Pattern

**Binary Search on Answer Space with Safe Evaluation**
We search the numerical range $[1, M]$ for the correct root. Because raising a number to the power of $N$ can easily overflow standard data types, we must implement a custom evaluation function that halts multiplication immediately if the running product exceeds $M$.

### How to Identify

- The problem asks for an exact numerical value satisfying a monotonic mathematical condition ($X^N = M$).
- A linear scan from 1 to $M$ is too slow, demanding a logarithmic approach.
- The combination of exponents and large bounds strongly signals that preventing integer overflow is the primary hidden challenge.

### Description

Step-by-step explanation:

1. Handle base cases: If $M=1$ or $N=1$, return $M$.
2. Initialize search boundaries: `left = 1` and `right = M`.
3. Loop while `left &lt;= right`. Calculate `mid` safely.
4. Call a helper function `evaluatePower(mid, N, M)` to safely calculate $mid^N$.
   - **Inside the helper:** Loop $N$ times, multiplying `ans * mid`.
   - **The Safety Valve:** After every multiplication, check if `ans &gt; M`. If it is, return a flag indicating "Too Large" immediately. This prevents the number from growing out of bounds and crashing the program.
5. Based on the helper's return value:
   - If exact match: Return `mid`.
   - If too small: Search higher (`left = mid + 1`).
   - If too large: Search lower (`right = mid - 1`).
6. If the loop breaks without finding an exact match, return `-1`.

### The Intuition

Finding a root is a guessing game. If you want the 4th root of 10000, you know it's between 1 and 10000. 
If you guess 50, you need to calculate $50^4$. But $50 \times 50 \times 50 \times 50 = 6,250,000$. 
The trick is, you don't need to calculate the *exact* massive number. After just the second multiplication ($50 \times 50 = 2500$), you already know $2500 &lt; 10000$, but on the third multiplication ($2500 \times 50 = 125,000$), it dramatically exceeds 10,000. You stop right there. You don't need the fourth multiplication to know that 50 is too big. This early stopping is what prevents systems from crashing due to integer overflow during mathematical binary searches.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log M)$  | $O(N \log M)$    |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The binary search takes $O(\log M)$ iterations. In each iteration, we multiply `mid` by itself up to $N$ times. The total time is $O(N \log M)$. *(Note: $N$ is usually small in these constraints. If $N$ were massive, you would use Binary Exponentiation to reduce this to $O(\log N \log M)$).*

#### Space Complexity

We only allocate primitive scalar variables. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int NthRoot(int N, int M) {
        if (M == 1 || N == 1) return M;

        int left = 1;
        int right = M;

        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            int state = evaluatePower(mid, N, M);

            if (state == 1) {
                return mid; // Exact match found
            } else if (state == 0) {
                left = mid + 1; // Mid is too small
            } else {
                right = mid - 1; // Mid is too large
            }
        }

        return -1; 
    }

    // Helper to safely evaluate mid^n relative to m
    // Returns: 0 if < m, 1 if == m, 2 if &gt; m
    private int evaluatePower(int mid, int n, int m) {
        long ans = 1;
        for (int i = 1; i &lt;= n; i++) {
            ans *= mid;
            
            // HALT EARLY: Prevents overflow and wasted cycles
            if (ans &gt; m) return 2; 
        }
        
        if (ans == m) return 1;
        return 0; // ans &lt; m
    }
}
```

## Caveats

- **The `Math.pow()` Trap:** Do not use `Math.pow(mid, N)`. `Math.pow` uses floating-point arithmetic (`double`), which loses precision on large integers, causing exact equality checks to fail. Furthermore, it does not halt early, meaning it will calculate massive numbers, eventually hitting `Infinity` and breaking comparison logic entirely.
- **Binary Exponentiation:** While the linear multiplication loop is sufficient if $N \le 30$, if the constraints allowed $N \ge 10^5$, you would be forced to use a modified Binary Exponentiation (Fast Power) algorithm to evaluate the threshold in $O(\log N)$ time instead of $O(N)$.

## Concepts to Think About

- **Safe Mathematics:** In software engineering, preventing overflow is often more critical than theoretical execution speed. Early halting is a standardized pattern when validating upper limits.
- **Search Space Reduction:** You can mathematically optimize the initial `right` bound. The $N$th root of $M$ is bounded by $M / N$ or $\min(M, \text{reasonable maximum})$. However, initializing `right = M` is perfectly safe because binary search eliminates bloated spaces logarithmically fast anyway.
- Integer vs. Double: When the problem asks for an integer root, avoid double to prevent precision errors.
- Early Exit Pattern: In the `check` function, we don't need the full value of $X^N$ if it's already larger than M. This is an L5 optimization.
- Binary Exponentiation: Could you make the check function $O(logN)$ instead of $O(N)$?
- Overflow Limits: What is the maximum value mid can take before $mid^N$ overflows a long? (In Java, `Long.MAX_VALUE` is $≈9×10^18$).


## Logical Follow-up

**Question:** Suppose you needed to return a decimal approximation of the $N$th root accurate to 5 decimal places. How does the algorithm change?

**Solution:** The binary search bounds become `left = 1.0` and `right = (double) M`. The loop condition changes to a precision threshold: `while (right - left &gt; 1e-6)`. We cannot use early halting for the multiplication since we need exact decimal comparisons to pinpoint the float, so we would use `Math.pow` or a custom double multiplier. Update bounds via `left = mid` or `right = mid` (no `+1` or `-1`). Time complexity depends on the precision required $P$.



**Question:** "What if the problem asked for the $N^{th}$ root of $M$ as a decimal with $10^{-6}$ precision?"

**Solution:**

1.  Change the search range to `double`.
2.  The `while` condition becomes `while (high - low &gt; 1e-7)`.
3.  The result would be `low` (or `high`).
4.  Binary search works perfectly for continuous values as long as the function remains monotonic.

**Question (Koko Eating Bananas):**
"Koko loves to eat bananas. There are `n` piles of bananas, the $i^{th}$ pile has `piles[i]` bananas. The guards will be back in `h` hours. Koko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile and eats `k` bananas from it. If the pile has less than `k` bananas, she eats them all and does not eat any more bananas during that hour. Return the minimum integer `k` such that she can eat all the bananas within `h` hours."

**Solution:**

1.  **Search Range:** The minimum speed is $1$, the maximum speed is $max(piles)$.
2.  **Monotonicity:** If Koko can finish at speed $K$, she can definitely finish at speed $K+1$. If she _cannot_ finish at speed $K$, she definitely cannot finish at speed $K-1$.
3.  **Check Function:** For a given speed `mid`, calculate the total hours: $\sum \lceil piles[i] / mid \rceil$.
4.  **Optimization:** This is the same "Answer Space" pattern. You are searching for the "Lower Bound" of speed $K$ such that `totalHours <= h`.
