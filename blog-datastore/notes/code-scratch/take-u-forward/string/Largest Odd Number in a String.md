---
tags:
  - strings
  - math
  - greedy
---

# Largest Odd Number in String

## Question

Given a string `num` representing a large integer, return the largest-valued odd integer (as a string) that is a non-empty substring of `num`. If no odd integer exists, return `""`.

## Solution

### Pattern

**Greedy Right-to-Left Traversal**
A number is odd if and only if its rightmost (least significant) digit is odd. To maximize the value of the substring, we want it to be as long as possible. Therefore, we greedily search from right to left for the first odd digit. Once found, everything to its left is included to maximize the magnitude.

### How to Identify

- The problem asks for the "largest" or "maximum" valid substring of a number.
- The property we are testing (odd/even) is determined entirely by the least significant digit, regardless of what precedes it.
- A greedy choice (taking the longest possible prefix) is mathematically provable to yield the maximum value.

### Description

Step-by-step explanation:

1. Handle edge cases: If the string is null or empty, return `""`.
2. Start iterating through the string from the last character (index `n - 1`) down to `0`.
3. Check if the character at the current index is odd. We can do this directly by checking `num.charAt(i) % 2 != 0` because the ASCII values of odd digits (`'1'`=49, `'3'`=51, etc.) are odd numbers.
4. The moment we find an odd digit, we know this is the rightmost possible end of an odd substring. To make the number as large as possible, we must include all digits to its left.
5. Immediately return the substring from index `0` up to and including this odd digit (`i + 1`).
6. If the loop finishes without finding any odd digits, all digits are even. Return `""`.

### The Intuition

In base-10 mathematics, the magnitude of a number is determined by its length (number of digits), and its parity (odd/even) is determined *only* by its final digit.
If you have the string `"35427"`, the possible odd substrings ending at `'7'` are `"7"`, `"27"`, `"427"`, `"5427"`, and `"35427"`. Because adding digits to the left increases the magnitude by a factor of 10, the longest prefix will *always* be the largest number.
Therefore, we just need to find the furthest right odd digit and chop off any even digits that come after it.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

In the worst case (e.g., all even digits `"2468"`), we iterate through every character in the string once, which is $O(N)$. The `substring()` operation also takes $O(N)$ time to copy the characters. Total time is strictly bounded by $O(N)$.

#### Space Complexity

In Java, strings are immutable. The `substring()` method allocates a new `String` object and a new backing `char[]` array on the heap of up to size $N$. Therefore, the space complexity is $O(N)$ for the returned result.

### Code

```java
class Solution {
    public String largestOddNumber(String num) {
        if (num == null || num.isEmpty()) return "";

        for (int i = num.length() - 1; i >= 0; i--) {
            // The ASCII value of an odd digit is mathematically odd.
            // e.g., '1' is 49, '3' is 51. So we can modulo the char directly.
            if (num.charAt(i) % 2 != 0) {
                // Return everything from the start up to the odd digit
                return num.substring(0, i + 1);
            }
        }

        // If no odd digit was found
        return "";
    }
}
```

## Caveats

- **Java `substring` Memory Leak (Historical):** Prior to Java 7u6, `substring` did not create a new character array; it shared the backing array of the original string and just adjusted pointers, making it an $O(1)$ time and space operation. However, this caused memory leaks if you kept a small substring of a massive string. Modern Java always copies the array, making it $O(N)$.
- **Integer Parsing Limits:** Do not attempt to parse the string into an `Integer` or `Long` to check for parity (e.g., `Long.parseLong(num) % 2 != 0`). The string can be up to 100,000 characters long, which will immediately cause an `NumberFormatException` (overflow). Always operate on characters.

## Concepts to Think About

- **String Immutability:** In languages like C++, you could achieve $O(1)$ space by mutating the string in-place (e.g., adding a null terminator `\0` after the odd digit) or returning a `string_view`.
- **Greedy Algorithms:** This is a pure greedy algorithm. Local optimal choice (find the first odd digit from the right) leads to the global optimal solution (the largest magnitude number).

## Logical Follow-up

Question: What if the problem asked for the largest *even* number as a contiguous substring?
Solution: The exact same logic applies, but you check for even digits (`num.charAt(i) % 2 == 0`). You traverse right-to-left and return the prefix ending at the first even digit.