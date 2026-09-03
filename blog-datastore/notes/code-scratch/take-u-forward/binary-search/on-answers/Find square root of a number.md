---
tags:
  - binary-search
  - math
---

# Find Square Root of a Number

## Question

Given a positive integer `n`, find and return its square root. If `n` is not a perfect square, return the floor value of the square root. Do not use built-in exponent functions.

## Solution

### Pattern

**Binary Search on Answer Space**
Instead of searching for an element in a given array, we know the answer must lie within a range (from 1 to `n`). We binary search this range, evaluating whether $mid^2 \le n$.

### How to Identify

- The problem asks for an optimal value (maximum/minimum/exact) that satisfies a condition.
- The condition exhibits **monotonicity** (e.g., if $x^2 > n$, then $(x+1)^2 > n$ is definitively true).
- The naive approach is a linear scan O(n), but the input size is large, demanding O(log n).

### Description

Step-by-step explanation:

1. Handle base cases: If `n` is 0 or 1, the square root is `n`. Return `n` immediately.
2. Define the search space: The square root of `n` will never be less than 1, nor greater than `n`. Set `left = 1` and `right = n`.
3. Loop while `left &lt;= right`.
4. Calculate `mid` safely to avoid integer overflow: `mid = left + (right - left) / 2`.
5. Calculate the square of `mid`. **Crucial step:** Cast `mid` to a 64-bit integer (`long`) before multiplying, as $mid^2$ can easily exceed the 32-bit `Integer.MAX_VALUE`.
6. Compare the square to `n`:
   - If `square == n`: We found a perfect square. Return `mid`.
   - If `square &lt; n`: `mid` is a valid floor square root. Record `ans = mid`. However, there might be a larger valid integer. Discard the left half: `left = mid + 1`.
   - If `square &gt; n`: `mid` is too large to be the square root. Discard the right half: `right = mid - 1`.
7. Once the search space collapses (`left &gt; right`), return the recorded `ans`.

### The Intuition

If you want to find the square root of 100, you know the answer is between 1 and 100.
Take a guess in the middle: 50.
$50 \times 50 = 2500$. 2500 is way bigger than 100. Because numbers increase monotonically, you instantly know that 51, 52, and 100 are also too big. You have safely thrown away half the possibilities.
Next guess: 25. $25 \times 25 = 625$. Still too big.
You keep halving the search space. If you guess 8 ($8 \times 8 = 64$), it's less than 100, so it's a valid floor answer. You write down "8" as a backup, but check if 9 or 10 work just in case.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(\log n)$    | $O(\log n)$      |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

The search space size is exactly `n`. We halve this search space on every iteration. This results in a maximum of $\log_2(n)$ operations.

#### Space Complexity

We only allocate three scalar variables (`left`, `right`, `mid`) and one `long` variable. No auxiliary structures are used.

### Code

```java
class Solution {
    public int floorSqrt(int n) {
        if (n == 0 || n == 1) return n;

        int left = 1;
        int right = n;
        int ans = 1;

        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            
            // Cast to long BEFORE multiplication to prevent overflow
            long square = (long) mid * mid;

            if (square == n) {
                return mid;
            } else if (square < n) {
                ans = mid; // Valid floor candidate
                left = mid + 1;
            } else {
                right = mid - 1; // Square is too large
            }
        }

        return ans;
    }
}
```

## Caveats

- **Integer Overflow:** The most common failure point in interviews. If `n = 2147395599`, and `mid` reaches `46340`, calculating `mid * mid` using 32-bit integers will wrap around to a negative number, breaking the binary search logic. You must use `(long) mid * mid` or evaluate via division `mid <= n / mid`.
- **Mixing Binary Search Templates:** Using `while (left < right)` while tracking an `ans` variable and conditionally skipping `right = mid` is highly prone to off-by-one errors. Stick strictly to `while (left <= right)` with `left = mid + 1` and `right = mid - 1`.

## Concepts to Think About

- **Binary Search on Answers:** This is the gateway problem for an entire class of advanced interview questions (e.g., Koko Eating Bananas, Capacity to Ship Packages). The concept is identical: define a min/max bound, pick a mid, run a boolean validation function (`square <= n`), and discard half the space.
- **Newton-Raphson Method:** Mathematically, $x_{k+1} = \frac{1}{2}\left(x_k + \frac{n}{x_k}\right)$ converges on the square root incredibly fast, often in fewer iterations than binary search, though binary search is the expected DSA answer.
- Monotonicity: This algorithm only works because $f(x)=x^2$ never decreases. If the function fluctuated, we couldn't discard half the range.
- Long vs Int: Always square the mid using long to prevent 32-bit overflow.
- The "Search for Last True": This is a classic variation where we want the last index where a condition (square ≤n) is true.


## Logical Follow-up

Question: How would you find the square root of a number accurate to 3 decimal places (e.g., return `2.236` for `n = 5`)?
Solution: You apply the exact same Binary Search logic, but using `double` instead of integers. Set `left = 0.0` and `right = n`. The loop condition changes from pointers crossing to a precision threshold: `while ((right - left) &gt; 1e-5)`. Update `mid = left + (right - left) / 2.0`. If `mid * mid &lt; n`, `left = mid`; else `right = mid`. Return `left` formatted to 3 decimal places.



**Question:** "How would you modify this to find the **Cube Root** ($\sqrt[3]{n}$) of an integer?"

**Solution:**
The logic is identical, only the "check" changes.

1.  Search range: $[1, n]$.
2.  Condition: `if (mid * mid * mid <= n)`.
3.  **L5 Caution:** $mid^3$ overflows even a `long` much faster than $mid^2$. For a cube root, you must be extremely careful or use `BigInteger` if $n$ is very large.

---

**Question (Precision Square Root):** "Now, find the square root of a **double** `n` with a precision of $10^{-7}$ (e.g., $sqrt(2) = 1.4142135$). How does the search range and termination condition change?"

**Analysis & Solution:**
Searching for a double is different because we no longer have discrete integer steps.

1.  **Range:** For $n \ge 1$, the range is $[1, n]$. However, for $0 < n < 1$, the square root is actually **larger** than $n$ (e.g., $\sqrt{0.25} = 0.5$). So the safe range is $[0, \max(1, n)]$.
2.  **Termination:** We don't use `left <= right`. Instead, we run the loop until the window is small enough: `while (right - left &gt; 1e-9)`.
3.  **Iteration Limit:** Alternatively, running the loop exactly $100$ times will always provide enough precision for a `double` and avoids potential infinite loops due to floating-point precision errors.

```java
public double getPrecisionSqrt(double n) {
    double left = 0, right = Math.max(1, n);
    // 100 iterations is a common trick for guaranteed precision
    for (int i = 0; i < 100; i++) {
        double mid = left + (right - left) / 2;
        if (mid * mid <= n) {
            left = mid;
        } else {
            right = mid;
        }
    }
    return left;
}
```
