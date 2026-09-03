---
tags:
  - cc
  - backtracking
  - recursion
---

# Letter Combinations of a Phone Number

## Question

Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. The mapping of digits to letters is identical to a standard telephone keypad. Return the results in any order.



## Solution

### Pattern

**Recursive Backtracking (Decision Tree Exploration)**
This problem requires exploring every path in a decision tree where the depth is the length of the input string and the branching factor is the number of letters per digit (3 or 4).

### How to Identify

- **Exhaustive Search:** Requirement to return "all possible combinations."
- **N-ary Choices:** Each step has a discrete set of choices (letters) based on the input (digits).
- **Cartesian Product:** The problem is essentially finding the Cartesian product of $k$ sets of characters.

### Description

Step-by-step explanation:

- **Guard Clause:** Check if the input is empty. If so, return an empty list immediately.
- **Pre-mapping:** Use a static array or map to store the digit-to-letter relationships (e.g., `2 -> "abc"`).
- **Helper Function:** Create a recursive function `backtrack(index, path)`:
    - **Base Case:** If the `index` equals the length of the input string, convert the current `path` (accumulated letters) into a string and add it to the result list.
    - **Recursive Step:**
        - Identify the letters associated with the digit at `digits[index]`.
        - For each letter in that set:
            - **Append** the letter to the current path.
            - **Recurse** to the next index ($index + 1$).
            - **Backtrack** by removing the last letter to restore the path for the next choice in the current loop.



### The Intuition

Think of the input string as a sequence of **slots**.

- The first digit determines the possible characters for the first slot.
- Once the first slot is "fixed," the second digit determines the second slot.
The backtracking process effectively performs a Depth-First Search (DFS) on the tree of all possible letter arrangements. The `StringBuilder` acts as a shared buffer that we modify and "undo" to save on memory allocations.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \cdot 4^N)$ | $O(N \cdot 3^N)$ |
| Space Complexity | $O(N)$          | $O(N)$           |

#### Time Complexity
There are at most $4^N$ combinations. For each combination, we spend $O(N)$ time to build the string from the buffer and add it to the list. $N$ is the number of digits.

#### Space Complexity
$O(N)$ auxiliary space is required for the recursion stack and the `StringBuilder` buffer. The output list space is not typically counted as "auxiliary" space.

### Code

```java
import java.util.*;

class Solution {
    // Static keypad for O(1) access and better memory management
    private static final String[] KEYPAD = {
        "",     // 0
        "",     // 1
        "abc",  // 2
        "def",  // 3
        "ghi",  // 4
        "jkl",  // 5
        "mno",  // 6
        "pqrs", // 7
        "tuv",  // 8
        "wxyz"  // 9
    };

    public List&lt;String&gt; letterCombinations(String digits) {
        List&lt;String&gt; result = new ArrayList<>();
        // Edge case: input is empty
        if (digits == null || digits.isEmpty()) {
            return result;
        }

        backtrack(0, new StringBuilder(), digits, result);
        return result;
    }

    private void backtrack(int index, StringBuilder path, String digits, List&lt;String&gt; result) {
        // Base case: combination complete
        if (index == digits.length()) {
            result.add(path.toString());
            return;
        }

        // Get letters for the current digit
        String letters = KEYPAD[digits.charAt(index) - '0'];

        for (char c : letters.toCharArray()) {
            path.append(c);              // Choose
            backtrack(index + 1, path, digits, result); // Explore
            path.deleteCharAt(path.length() - 1); // Backtrack
        }
    }
}
```

### Caveats

- **The "" Trap**: Always remember that letterCombinations("") should return [], not [""].
- **StringBuilder Mutability**: In Java, you must explicitly delete the last character because StringBuilder is passed by reference.
- **String Copying**: Using path + c in the recursive call instead of StringBuilder is technically $$O( 4^N * N^2)$$ because a new string is created at every single node in the tree.

### Concepts to Think About

- BFS vs DFS: This can be solved iteratively using a Queue. For each digit, you dequeue all existing prefixes and enqueue new ones with each possible letter appended.
- Recursion Depth: The maximum depth is only `N`. In this problem, `N` is usually small (`&lt;= 4`), so stack overflow is not a concern.
- Character Math: `digits.charAt(index) - '0'` is a fast way to convert a numeric character to an integer index.

### Logical Follow-up

Question: How would you modify this to only return combinations that are valid English words?

Solution: Pass a Trie or HashSet of a dictionary into the function. At each step, only continue recursing if the current path prefix is a valid prefix in the dictionary. This is a common Pruning technique.

Question: What if the digit mapping could change dynamically?

Solution: Switch back to a `Map<Character, String&gt;` or pass the mapping array as a parameter to the helper function to maintain flexibility.
