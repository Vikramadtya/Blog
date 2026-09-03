---
tags:
  - backtracking
  - recursion
  - catalan-numbers
  - string-manipulation
---

# Generate Parentheses

## Question

Given an integer $n$, generate all possible combinations of well-formed parentheses of length $2n$. A sequence is "well-formed" if every opening parenthesis `(` is closed in the correct order, and no closing parenthesis `)` ever appears without a matching preceding `(`.

## Solution

### Pattern

**Backtracking (State-Space Search)** We incrementally build the string character by character, only exploring paths that maintain the "well-formed" invariant, and undoing our last move to explore other branches.

### How to Identify

- **Generate All Combinations**: Whenever a problem asks to find all possible valid arrangements of a set.
- **Small Constraints**: $n$ is typically small (e.g., $n \le 15$), suggesting that an exponential time complexity is expected.
- **Prunable Search Space**: The validity of a partial solution can be checked at every step (you can't add a `)` if it makes the string unbalanced).
- **Matching/Nesting**: Problems involving balanced brackets, HTML tags, or nested levels.

### Description

We use a recursive helper function to track the state using two counters: `openCount` (total `(` placed) and `closeCount` (total `)` placed).

- **Base Case**: If the current string length reaches $2n$, we have a complete valid combination. Add it to the result list.
- **Decision 1 (Place Open)**: If `openCount &lt; n`, we can always choose to add a `(`.
- **Decision 2 (Place Close)**: If `closeCount &lt; openCount`, we can choose to add a `)`. This condition is the core invariant that ensures the string remains well-formed.
- **Backtracking**: To optimize for memory, use a single `StringBuilder`. Append a character, recurse, then remove that character (backtrack) before moving to the next decision branch.

### The Intuition

Think of this as a **Decision Tree**. At each step, you have two choices: add `(` or `)`. However, the tree is "pruned" to prevent invalid states.

- You cannot add more than $n$ open brackets.
- You cannot add a closing bracket if it would exceed the number of currently open brackets.

### Complexity

| Label            | Worst                     | Average                   |
| :--------------- | :------------------------ | :------------------------ |
| Time Complexity  | $O(\frac{4^n}{\sqrt{n}})$ | $O(\frac{4^n}{\sqrt{n}})$ |
| Space Complexity | $O(n)$                    | $O(n)$                    |

#### Time Complexity

The number of valid combinations is the $n^{th}$ **Catalan Number**, $C_n = \frac{1}{n+1}\binom{2n}{n}$. Asymptotically, this is $O(\frac{4^n}{n\sqrt{n}})$. Since each valid string takes $O(n)$ to build and copy, the total work is $O(\frac{4^n}{\sqrt{n}})$.

#### Space Complexity

The maximum depth of the recursion stack is $2n$, yielding $O(n)$ auxiliary space. The `StringBuilder` also maintains a length of $2n$. (Note: We exclude the space of the output list $O(C_n)$ as per standard interview auxiliary space analysis).

### Code

```java
class Solution {
    public List<String&gt; generateParenthesis(int n) {
        List&lt;String&gt; result = new ArrayList<&gt;();
        // Use StringBuilder for O(1) mutations instead of O(N) string copies
        backtrack(result, new StringBuilder(), 0, 0, n);
        return result;
    }

    private void backtrack(List&lt;String&gt; res, StringBuilder sb, int open, int close, int n) {
        // Base case: String is full length
        if (sb.length() == 2 * n) {
            res.add(sb.toString());
            return;
        }

        // Choice 1: Add an opening bracket if we haven't reached the limit n
        if (open < n) {
            sb.append("(");
            backtrack(res, sb, open + 1, close, n);
            sb.deleteCharAt(sb.length() - 1); // Backtrack step
        }

        // Choice 2: Add a closing bracket only if it maintains balance (close < open)
        if (close < open) {
            sb.append(")");
            backtrack(res, sb, open, close + 1, n);
            sb.deleteCharAt(sb.length() - 1); // Backtrack step
        }
    }
}
```

## Concepts to Think About

- **Catalan Number Formula**: $C_n = \frac{1}{n+1}\binom{2n}{n}$. This appears in many counting problems like Binary Search Tree structures and Polygon Triangulations.
- **String Immutability**: In Java, `String` is immutable. Using `s + "("` inside recursion creates $O(n)$ copies, leading to $O(n^2)$ overhead per valid path. Always prefer `StringBuilder`.
- **DFS vs. BFS**: Backtracking is a Depth-First Search. A Breadth-First Search would require significantly more memory to store all partial combinations at each level.
- **Pruning**: This algorithm is efficient because it never even considers an invalid string like `())`.
- **Tail Recursion**: Note that Java does not optimize for tail recursion; hence, the stack depth is a real constraint for very large $n$.
- **DP Approach**: You can solve this by building up from smaller $n$ where $f(n) = \sum_{i=0}^{n-1} "(" + f(i) + ")" + f(n-1-i)$.

## Logical Follow-up

**Question**: How would you check if a single given string is valid in $O(1)$ extra space?  
**Solution**: Iterate through the string while maintaining a `balance` counter. Increment for `(`, decrement for `)`. If `balance` ever drops below 0, or is not 0 at the end, the string is invalid.

**Question**: (Google L5 Role) If $n$ is too large to store the results in a list (e.g. $n=30$), how can you find the "Lexicographically Next" valid combination?  
**Solution**: To find the next string: (1) Find the rightmost `()` and swap it to `)(`. (2) Fill the remaining suffix with the smallest valid sequence (all remaining `(` followed by all remaining `)`). This allows iterating through combinations one-by-one with $O(n)$ space.

**Question**: How would you generate parentheses in a distributed system (Sharding)?  
**Solution**: Shard by prefix. Machine A generates all valid strings starting with `((`, Machine B generates strings starting with `()`, etc. Use a "prefix-aware" backtracking function to start at a specific state.
