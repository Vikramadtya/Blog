---
tags:
  - cc
  - bit-manipulation
  - arrays
---

# Missing Number

## Question

Given an array `nums` containing $n$ distinct numbers chosen strictly from the range $[0, n]$, find and return the single number that is missing from the sequence. The execution must run in $O(n)$ time and use $O(1)$ auxiliary space.

## Solution

### Pattern

**Bitwise XOR Cancellation**
This approach leverages the self-inverting property of the exclusive-OR logic gate: $X \oplus X = 0$ and $X \oplus 0 = X$. By XORing the input set against the complete range sequence, all present numbers cancel out, isolating the single missing entry.

### How to Identify

- The input elements are bound within a highly strict sequential index envelope ($0$ to $n$).
- The problem mandates an exhaustive search for a single missing, duplicated, or altered item.
- Rigid space bounds ($O(1)$ memory) prevent the use of secondary tracking buffers like sets or hash tables.

### Description

Step-by-step explanation:

- **Step 1: Set Base State.** Initialize an integer tracking register `xorSum` to the value $n$ (the length of the array). This accounts for the upper bound element of the range $[0, n]$ since the tracking loop will only step through indexes up to $n-1$.
- **Step 2: Linear Stream Scan.** Run a linear scan through the input collection from index $i = 0$ to $n-1$.
- **Step 3: Bitwise Masking.** At every single item iteration, update your tracking register by XORing it with both the current loop index counter $i$ and the value stored at that index location `nums[i]`:
  $$\text{xorSum} = \text{xorSum} \oplus i \oplus \text{nums}[i]$$
- **Step 4: Return Isolated Value.** Upon loop termination, every number that appeared as both an index position and an array entry will have self-destructed into a value of $0$. The value remaining in `xorSum` is the missing element.



### The Intuition

Think of this solution as an automated **Inventory Audit Registry**. 

Imagine you are handed a manufacturing manifest containing a list of uniquely stamped parts ranging from $0$ to $n$ (represented by your loop index counters plus the base offset $n$). You are also handed a physical storage crate containing these parts, but one item is missing (represented by the values inside `nums`). 



Instead of counting or adding their weights up to massive amounts, you pick up a manifest item and a crate item simultaneously and clash them together. If they match, they cancel out and vanish from your workspace. Because your tracking variable processes every index alongside every value, every matched pair annihilates itself. The unique item that fails to find a twin never gets canceled out and is left standing alone at the end.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(n)$         | $O(n)$           |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity
$O(n)$. The sequence is parsed exactly once via a single-pass loop layout. Every element triggers low-level bit operations that run in constant time.

#### Space Complexity
$O(1)$. The internal memory allocation requires only a single scalar primitive variable, completely independent of input scaling.

### Code

```java
class Solution {
    /**
     * Finds the missing number using bitwise XOR to enforce 32-bit type safety.
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public int missingNumber(int[] nums) {
        int n = nums.length;
        
        // Seed with 'n' because the loop indices will only span from 0 to n-1
        int xorSum = n;
        
        // Accumulate cancellations across all index-value pairings
        for (int i = 0; i < n; i++) {
            xorSum ^= i ^ nums[i];
        }
        
        return xorSum;
    }
}
```

## Caveats

- **Unordered Constraints Only:** This linear approach is independent of ordering. However, if the interviewer states the array is **already sorted**, a linear pass is sub-optimal; you should transition to a **Binary Search** approach to locate the index mismatch in $O(\log n)$ time.
- **Strict Boundary Bounds:** The properties of this bitwise cancellation model depend on values matching the range $[0, n]$. If any element violates this boundary, the cancellation mechanics break completely.

## Concepts to Think About

- **Algebraic Formula Bounds:** While $\frac{n(n+1)}{2}$ works conceptually, implementing it using standard 32-bit integers risk overflow at $n \ge 46,341$, necessitating a 64-bit `long` conversion.
- **XOR Algebraic Properties:** Bitwise exclusive-OR operations are fully commutative ($A \oplus B = B \oplus A$) and associative ($A \oplus (B \oplus C) = (A \oplus B) \oplus C$).
- **Cyclic Sort Placement:** If array modification is permitted, swapping elements into their literal matching indices (`nums[i] == i`) isolates missing values without tracking calculations.
- **In-Place Read Immutability:** Unlike mutating sort operations, the bitwise XOR framework treats the underlying collection as read-only, ensuring complete thread safety.
- **Cyclic Sort**: This problem can also be solved using the Cyclic Sort pattern, where you try to place every number i at nums[i]. After sorting, the first index i where nums[i] != i is your missing number. When would you prefer this over the Math approach?
- **Multiple Missing Numbers**: If the array was missing two numbers, would the Sum method still work? (Hint: You would need a second equation, like the sum of squares, to solve for two variables).
- **Binary Search**: If the input array was sorted, could you find the missing number faster than O(n)? (Hint: Look for the first index i where `nums[i] != i$ using Binary Search).

## Logical Follow-up

Question: What if the sequence spans from $1$ to $n+1$ instead of $0$ to $n$?
Solution: Initialize `xorSum = 0` and process the loop indices as `i + 1` inside your XOR expression to match the value structure.

Question: What if **two** distinct numbers are missing from the array instead of one?
Solution: A single XOR pass over the combined elements and indices will yield a value equal to $X \oplus Y$ (the XOR of the two missing numbers). Find the rightmost set bit in this result to establish a dividing line. Run a second pass, separating numbers and indices into two distinct groups based on whether that specific bit is set or clear. Each pool will isolate one of the missing values.

