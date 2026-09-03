---
tags:
  - cc
  - backtracking
  - recursion
---

# Combination Sum (Unbounded)

## Question

Given an array of **unique** integers `candidates` and a `target` integer, return a list of all unique combinations where the chosen numbers sum to `target`. You may use the same number an **unlimited number of times**.

## Solution

### Pattern

**Backtracking (Pick or Skip)**

This is a state-space search problem where we explore a decision tree. At each step, we decide whether to include the current candidate in our sum or move to the next candidate.

### How to Identify

- The problem asks for **all possible** combinations/sequences.
- Elements can be reused (Unbounded).
- The solution requires exploring multiple branches of decisions.

### Description

Step-by-step explanation:

- **Sort (Optional but helpful):** Sorting candidates allows for early picking/pruning, though not strictly required for correctness.
- **Recursive Function:** Define a function `backtrack(index, currentTarget, currentPath)`.
- **Base Cases:**
    - If `currentTarget == 0`: We found a valid combination. Add a copy of `currentPath` to our results.
    - If `currentTarget &lt; 0` or `index == candidates.length`: We've exceeded the target or ran out of options. Stop this branch.
- **Decision 1 (Pick):** If `candidates[index] &lt;= currentTarget`, add the element to `currentPath` and call the function again **at the same index**. This allows for multiple selections of the same number.
- **Backtrack:** Remove the element we just added from `currentPath` to restore the state for other branches.
- **Decision 2 (Skip):** Call the function with `index + 1` and the same `currentTarget`. This explores combinations that do not use the current candidate.

### The Intuition

Think of this as a **Stay or Move** strategy. 

Imagine you are at a buffet. At each food station, you have two choices:
1. "I want another scoop of this." (Pick and **stay** at the station).
2. "I'm done with this; let's see what's next." (Don't pick and **move** to the next station).
Because you can take multiple scoops, you only move to the next station when you explicitly decide you don't want any more of the current food.

### Complexity

| Label            | Worst            | Average          |
| :--------------- | :--------------- | :--------------- |
| Time Complexity  | $O(2^t \cdot k)$ | $O(2^t \cdot k)$ |
| Space Complexity | $O(t)$           | $O(t)$           |

#### Time Complexity
The time complexity is $O(2^t \cdot k)$, where $t$ is the target value (representing the maximum depth of the tree $target/min\_val$) and $k$ is the average length of a combination. Each combination takes $O(k)$ to copy into the result list.

#### Space Complexity
The space complexity is $O(t)$ due to the recursion stack and the list used to store the current path.

### Code

```java
class Solution {
    public List<List<Integer&gt;&gt; combinationSum(int[] candidates, int target) {
        List&lt;List&lt;Integer&gt;&gt; result = new ArrayList<>();
        // Use a dynamic list to track the current combination (path)
        backtrack(0, candidates, target, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int index, int[] candidates, int target, 
                           List&lt;Integer&gt; path, List&lt;List&lt;Integer&gt;&gt; result) {
        // Base Case: Target reached
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }

        // Base Case: Out of bounds or target exceeded
        if (index == candidates.length || target &lt; 0) {
            return;
        }

        // Decision 1: Pick the current element
        // We stay at 'index' because we can reuse this number
        if (candidates[index] <= target) {
            path.add(candidates[index]);
            backtrack(index, candidates, target - candidates[index], path, result);
            // Backtrack: Remove the element to explore the "Skip" branch
            path.remove(path.size() - 1);
        }

        // Decision 2: Skip the current element
        // Move to the next index
        backtrack(index + 1, candidates, target, path, result);
    }
}
```

### Caveats

- **Deep Recursion** : If the target is large and the minimum candidate is small (e.g., target=500, min=1), you may hit a StackOverflowError.
- **Combination vs. Permutation** : This approach finds unique combinations. If the order mattered (Permutations), the logic would change to start the loop from index 0 every time.
- **Unique Candidates** : If the input array has duplicates, this logic will produce duplicate combinations unless handled (usually by sorting and skipping duplicates, see Combination Sum II).

### Concepts to Think About

- State Space Tree: Visualizing the recursion as a tree helps identify redundant work.
- Pass-by-Reference: In Java, List objects are passed by reference, necessitating the new ArrayList<&gt;(path) copy at the base case.
- Unbounded Knapsack: This problem is a variation of the Unbounded Knapsack where we want all solutions rather than just the max value.
- DP vs Backtracking: DP is used to find the number of ways or the best way. Backtracking is required when you need to list all actual ways.

### Logical Follow-up

Question: How would you modify this if each number in candidates could only be used once?

Solution: In the "Pick" branch, you would move to index + 1 instead of staying at index. Additionally, you would need to sort the array and skip adjacent duplicate elements to ensure unique results (Combination Sum II).