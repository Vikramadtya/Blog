---
tags:
  - math
  - divide-and-conquer
  - binary-exponentiation
  - binary-search-principle
---

# Power Function: pow(x, n)

## Question

Implement the power function $pow(x, n)$, which calculates $x$ raised to the power $n$ ($x^n$). The solution must handle negative exponents ($x^{-n} = 1/x^n$) and be efficient enough for very large values of $n$. The output should be formatted to 4 decimal places.

## Solution

### Pattern

**Binary Exponentiation (Fast Power)** Instead of multiplying $x$ by itself $n$ times ($O(n)$), we use the mathematical property $x^n = (x^{n/2})^2$ to reduce the number of multiplications to $O(\log n)$.

### How to Identify

- Calculating large powers where $n$ can be up to $2^{31}-1$.
- Problems involving modular exponentiation (crucial for Cryptography/RSA).
- Scenarios where you need to perform an associative operation $n$ times (e.g., Matrix Exponentiation).
- Any "growth" problem where a linear loop would exceed a 1-second time limit.

### Description

Imagine you want to calculate $2^{10}$. Instead of doing $2 \times 2 \times 2...$ ten times, we use a "halving" strategy:

1.  **The Core Logic**: We know $2^{10} = 2^5 \times 2^5$. If we find $2^5$ once, we can just square it to get $2^{10}$.
2.  **Handling Parity**: If the exponent is odd, like $2^{11}$, it’s simply $2^{10} \times 2^1$. We calculate the even "half" and multiply by the base one extra time.
3.  **Negative Exponents**: If $n$ is negative, $x^{-n}$ is the same as $(1/x)^{n}$. We flip the base and treat the exponent as positive.
4.  **Overflow Safety**: Because the absolute value of `Integer.MIN_VALUE` exceeds `Integer.MAX_VALUE`, we convert $n$ to a 64-bit `long` to safely negate it.
5.  **Termination**: We continue halving the power until it reaches $0$, where $x^0 = 1$.

### The Intuition

Think of this as the **Binary Representation** of the exponent. Every number $n$ can be broken down into powers of 2. For example, $13$ is $8 + 4 + 1$ (Binary: `1101`). Therefore:
$$x^{13} = x^8 \cdot x^4 \cdot x^1$$
Instead of 13 steps, we just keep squaring the base ($x^1 \to x^2 \to x^4 \to x^8$) and "pick up" the value whenever the corresponding binary bit of $n$ is set to $1$.

This "halving" intuition—where you only need to know the result of a sub-problem to solve the larger one—is a common optimization pattern for any problem involving **associative operations** (like matrix multiplication or finding the $n^{th}$ Fibonacci number).

### Complexity

| Label            | Worst       | Average     |
| :--------------- | :---------- | :---------- |
| Time Complexity  | $O(\log n)$ | $O(\log n)$ |
| Space Complexity | $O(\log n)$ | $O(\log n)$ |

#### Time Complexity

We divide the exponent $n$ by $2$ at every recursive step. The total number of steps is $\lceil \log_2 n \rceil$. Since each step involves $O(1)$ multiplication, the total time is logarithmic.

#### Space Complexity

In the recursive approach, each halving adds a new frame to the **recursion stack**. The stack depth is equal to the number of steps, $O(\log n)$. Note: An iterative version reduces this to $O(1)$.

### Code

```java
class Solution {
    public double myPow(double x, int n) {
        // 1. Use long to handle Integer.MIN_VALUE overflow (-2147483648)
        long N = n;
        if (N &lt; 0) {
            x = 1 / x;
            N = -N;
        }

        double result = fastPow(x, N);

        // 2. Note: For 4 decimal places, you would use:
        // return Double.parseDouble(String.format("%.4f", result));
        return result;
    }

    private double fastPow(double x, long n) {
        // Base case
        if (n == 0) return 1.0;

        // Recursive step: Divide problem into half
        double half = fastPow(x, n / 2);

        // Combine step
        if (n % 2 == 0) {
            return half * half;
        } else {
            return half * half * x;
        }
    }
}
```

## Concepts to Think About

- **Integer Overflow**: Always check the boundaries of `int` when dealing with absolute values or negation. For example, $n = -2,147,483,648$ becomes positive by overflow if not handled with a `long`.
- **Tail Recursion**: Is this function tail-recursive? (No, because we perform multiplication after the recursive call returns, requiring the stack to stay open).
- **Iterative Logic**: How to use bitwise operators (`n & 1`, `n &gt;>= 1`) to solve this in $O(1)$ space by processing the bits of the exponent from right to left.
- **Floating Point Precision**: Be aware that repeated multiplication of small doubles can lead to underflow, where the value becomes too small to be represented.
- **Modular Exponentiation**: This same pattern is used for $(x^n) \pmod m$, which is vital in RSA cryptography for encrypting and decrypting data.
- **Base Cases**: What happens if $x = 0$? Usually, $0^0$ is defined as 1 in many programming libraries, but mathematically it can be an indeterminate form.

## Logical Follow-up

**Question**: How can you optimize the space complexity to $O(1)$?

**Solution**: Use an iterative approach. While $n > 0$, if $n$ is odd, multiply the result by $x$. Then square $x$ ($x = x \cdot x$) and right-shift $n$ ($n = n / 2$).

**Question**: How would you handle the case where $n$ is so large it doesn't fit in a 64-bit `long`?
**Solution**: If $n$ is passed as a string (BigInt), we use the property $(x^n) \pmod m$ or process the string digit by digit, using the rule: $x^{123} = (x^{12})^{10} \cdot x^3$.

**Question**: If you had to compute $x^n$ for many different $n$ values but the same $x$, how would you optimize?

**Solution**: Precompute powers of $x$ in the form $x^{2^k}$ (e.g., $x^1, x^2, x^4, x^8...$) and then combine them based on the binary representation of each $n$.
