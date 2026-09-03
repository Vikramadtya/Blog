---
tags:
  - math
  - combinatorics
---

# Get specific element from Pascal's Triangle

## Question

Given two integers $r$ and $c$, return the value at the $r$-th row and $c$-th column (1-indexed) in Pascal's Triangle.

## Solution

### Pattern

**Combinatorics ($nCr$)**
The value at any coordinate $(r, c)$ in Pascal's triangle mathematically maps perfectly to the combination formula $\binom{n}{k}$ (n choose k), where $n = r - 1$ and $k = c - 1$. We calculate this iteratively to achieve $O(k)$ time and $O(1)$ space.

### How to Identify

- The problem asks for a *single specific element* in Pascal's triangle, or a single row.
- Generating the triangle row-by-row via dynamic programming takes $O(r^2)$ time/space, which is massively inefficient for isolated queries.
- The need to jump directly to an answer implies a closed-form math formula.

### Description

Step-by-step explanation:

1. **Index Conversion:** The prompt uses 1-based indexing. Combinatorics uses 0-based indexing. The top of the triangle is $\binom{0}{0}$. We map $n = r - 1$ and $k = c - 1$.
2. **Symmetry Optimization:** Pascal's triangle is horizontally symmetrical. Mathematically, $\binom{n}{k} = \binom{n}{n-k}$. If $k$ is greater than half of $n$, we set $k = n - k$. This bounds our maximum iterations.
3. **Iterative Expansion:** The combination formula is $\frac{n!}{k!(n-k)!}$. Calculating factorials directly causes instant integer overflow. Instead, we expand the terms iteratively: $\frac{n}{1} \times \frac{n-1}{2} \times \frac{n-2}{3} \dots \frac{n-k+1}{k}$.
4. Initialize a running total `res` to 1. **(Must use a 64-bit integer / long)**.
5. Loop $i$ from $0$ to $k-1$.
6. In each iteration, multiply `res` by $(n - i)$ and then *immediately* divide it by $(i + 1)$.
7. Cast the result back to a 32-bit integer and return.

### The Intuition

Why multiply and divide iteratively?
If you want to pick 3 people from a group of 10 ($\binom{10}{3}$), you have 10 choices for the first, 9 for the second, and 8 for the third. That is $10 \times 9 \times 8$. Because the order you picked them doesn't matter, you divide out the permutations of those 3 people ($3 \times 2 \times 1$).
Instead of calculating $720 / 6$, we pair the operations: $(10 / 1) \times (9 / 2) \times (8 / 3)$. 
By multiplying and dividing at every single step, we keep the running number as small as mathematically possible to avoid memory overflow limits, while guaranteeing that the division will always result in a clean whole number at every step.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(c)$         | $O(c)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

*Note: With symmetry optimization, worst-case time is tightly bounded to $O(\min(c, r-c))$.*

#### Time Complexity

The loop runs exactly $k$ times. Because of the symmetry optimization, $k \le n/2$. The time scales linearly with the column index (or distance from the nearest edge).

#### Space Complexity

Only a few primitive variables (`res`, `i`, `n`, `k`) are allocated. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int pascalTriangleI(int r, int c) {
        // Pascal(r, c) == (r-1) Choose (c-1)
        return (int) nCr(r - 1, c - 1);
    }

    private long nCr(int n, int k) {
        // Optimization: C(n, k) == C(n, n-k)
        if (k > n - k) {
            k = n - k;
        }

        // Use long to prevent silent overflow during multiplication
        long res = 1;
        for (int i = 0; i &lt; k; i++) {
            res *= (n - i);
            res /= (i + 1);
        }
        
        return res;
    }
}
```

## Caveats

- **Integer Overflow Trap:** The final answer might easily fit in a 32-bit `int`, but the intermediate step `res * (n - i)` can vastly exceed `2,147,483,647` before the division operation brings it back down. You **must** use a 64-bit `long` for the running product.
- **Order of Operations:** In the loop, you must multiply *before* you divide. `res = res * (n - i) / (i + 1)` works. If you do `res = res * ((n - i) / (i + 1))`, integer division truncation will destroy the math (e.g., $9 / 2$ evaluates to $4$ instead of $4.5$, ruining the product). 

## Concepts to Think About

- **Modular Arithmetic Limits:** If a problem requires you to return the combination modulo $10^9 + 7$, this iterative approach fails because you cannot easily divide under modulo. You must instead calculate the Modular Multiplicative Inverse of the denominator using Fermat's Little Theorem.
- **Factorial Array DP:** If you need to answer *many* $nCr$ queries rapidly, you can precompute an array of factorials (and their modular inverses) in $O(N)$ time, allowing you to answer any $\binom{n}{k}$ query in $O(1)$ time.
- **Symmetry Property:** Pascal's Triangle is a mirror image of itself. Mathematically: 
    $$\binom{n}{k} = \binom{n}{n-k}$$ 
    In your code, checking `if (k &gt; n / 2) k = n - k;` can cut your loop iterations in half and significantly reduce the risk of intermediate overflow.
- **DP vs. Math Trade-offs:**
  - **Use DP** ($\text{O}(r^2)$) if you need to return the **entire triangle**, as you have to touch every element anyway.
  - **Use Math** ($\text{O}(c)$) if you only need **one element** or a **single row**, as it is significantly more space and time-efficient.
- **The Row Generation "Trick":** There is a linear relationship between adjacent elements in a row. If you have the value of $\binom{n}{k}$, you can calculate $\binom{n}{k+1}$ in $\text{O}(1)$ time using the formula:
    $$\binom{n}{k+1} = \binom{n}{k} \times \frac{n-k}{k+1}$$
    This allows you to generate an entire row in $\text{O}(n)$ time and $\text{O}(n)$ space.

## Logical Follow-up

Question: Generate the *entire* $k$-th row of Pascal's triangle (0-indexed) using only $O(k)$ extra space and $O(k)$ time.

Solution: We use the exact same combinatorial logic. Instead of finding a single element, we leverage the fact that the *next* element in a row can be derived directly from the *previous* element in $O(1)$ time. 
The mathematical relationship between adjacent elements is: $Current = Previous \times \frac{n - i + 1}{i}$. 
Initialize an array `res[0] = 1`. Then, loop $i$ from $1$ to $k$, applying `res[i] = res[i-1] * (k - i + 1) / i`. Return the array. This generates the entire row efficiently without calculating combinations from scratch for every cell.

