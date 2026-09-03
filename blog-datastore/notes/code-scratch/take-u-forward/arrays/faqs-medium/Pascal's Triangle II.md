---
tags:
  - cc
  - math
  - combinatorics
---

# Pascal's Triangle II (Row Generation)

## Question

Given a 1-indexed integer $r$, return the $r^{\text{th}}$ row of Pascal's Triangle. 
In Pascal's Triangle, each number is the sum of the two numbers directly above it.
**Goal:** Achieve $O(r)$ time and $O(1)$ auxiliary space.



## Solution

### Pattern

**Multiplicative Combinatorial Formula**
Instead of calculating factorials or summing previous rows, we compute $\binom{n}{k}$ using the value of $\binom{n}{k-1}$.

### How to Identify

- The problem asks for a specific row of Pascal's triangle.
- The constraints require a linear time $O(n)$ solution.
- The context involves combinations ($nCr$).

### Description

Step-by-step explanation:

- Recognize that the $r^{\text{th}}$ row (1-indexed) corresponds to combinations $\binom{n}{0}, \binom{n}{1}, \dots, \binom{n}{n}$ where $n = r - 1$.
- Start with the first element: $\text{ans}[0] = 1$.
- To find the next element at index $i$, use the previous element:
  $$\text{Current} = \text{Previous} \times \frac{n - i + 1}{i}$$
- **Key implementation detail:** Multiply the previous value by $(n - i + 1)$ first, then divide by $i$. This ensures the result remains an integer at each step. 
- **Critical Guard:** Use a 64-bit integer (`long`) for the multiplication to prevent overflow before the division brings the value back within 32-bit range.

### The Intuition



Think of the transition between terms in a binomial expansion. Each term is a ratio of the previous one. We are essentially moving the "choice" pointer across the row. The formula $\frac{n-i+1}{i}$ represents the ratio of how many ways we can choose $i$ items versus $i-1$ items.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(r)$         | $O(r)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
We calculate each of the $r$ elements exactly once using a constant number of arithmetic operations.

#### Space Complexity
We use $O(1)$ auxiliary space if we do not count the required output array.

### Code

```java
class Solution {
    public int[] pascalTriangleII(int r) {
        // Pascal's row r (1-indexed) has r elements.
        // n is the row index in combinatorial notation (0-indexed).
        int n = r - 1;
        int[] row = new int[r];
        
        row[0] = 1; // nC0 is always 1
        
        // We use a long to store the running product to prevent overflow
        // during the multiplication step.
        long currentVal = 1;
        
        for (int i = 1; i < r; i++) {
            // Formula: nCi = nC(i-1) * (n - i + 1) / i
            currentVal = currentVal * (n - i + 1) / i;
            row[i] = (int) currentVal;
        }
        
        return row;
    }
}
```

## Caveats

- **Integer Overflow:** Even if the final answer fits in an `int`, the intermediate product `currentVal * (n - i + 1)` can easily exceed $2 \times 10^9$.
- **Division Order:** You cannot divide before you multiply ($ (currentVal / i) * (n - i + 1) $) because integer division will truncate the result, leading to incorrect values.

## Concepts to Think About

- **Binomial Theorem:** Each row represents the coefficients of $(x+y)^n$.
- **Symmetry:** Pascal's triangle is symmetric ($\binom{n}{k} = \binom{n}{n-k}$). You could technically optimize by only calculating half the row and mirroring it, though the complexity remains $O(r)$.
- **Dynamic Programming:** The $O(r^2)$ approach is essentially DP ($dp[i][j] = dp[i-1][j-1] + dp[i-1][j]$).
- **Space Compression:** If you were asked to generate all rows up to $r$ in $O(r)$ space, you would use a single array and update it backwards to avoid overwriting values you still need.

## Logical Follow-up

Question: How would you find the value at a specific coordinate $(r, c)$ without generating the whole row?

Solution: Directly use the formula $\binom{r-1}{c-1} = \frac{(r-1)!}{(c-1)!(r-c)!}$. However, for large values, the multiplicative loop approach is still safer than calculating factorials directly.