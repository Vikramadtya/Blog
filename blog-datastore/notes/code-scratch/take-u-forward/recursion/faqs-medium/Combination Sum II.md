---
tags:
  - cc
  - backtracking
  - recursion
  - combinations
---

# Combination Sum II (Unique Combinations)

## Question

Given a collection of candidate numbers `candidates` and a `target` sum, find all **unique** combinations where the numbers sum to `target`. 
- Each number in `candidates` may only be used **once** in the combination.
- The solution set must not contain duplicate combinations.
- The input may contain duplicate numbers.

## Solution

### Pattern

**Backtracking with Duplicate Pruning**

This involves exploring all possible paths in a decision tree while using sorting and index-skipping to avoid generating the same combination multiple times.

### How to Identify

- The problem asks for **all unique** combinations or subsets.
- Each element can be used **only once** (Selection without replacement).
- The input contains **duplicates**, but the output must not.

### Description

Step-by-step explanation:

- **Step 1 (Sort):** Sort the `candidates` array. This is essential to group duplicates together and enable early pruning.
- **Step 2 (Recursive Function):** Define `backtrack(index, target, currentPath)`.
- **Step 3 (Base Case):** If `target == 0`, a valid combination is found. Add a copy of `currentPath` to the result list.
- **Step 4 (Iterative Branching):** Loop from `i = index` to the end of the array.
- **Step 5 (Skip Duplicates):** If `i > index` and `candidates[i] == candidates[i-1]`, skip this iteration. This ensures we don't start a combination with the same value twice at the same recursion level.
- **Step 6 (Pruning):** If `candidates[i] > target`, break the loop. No further elements will work since the array is sorted.
- **Step 7 (Recurse & Backtrack):** Add `candidates[i]` to `currentPath`, call `backtrack(i + 1, target - candidates[i])`, and then remove the element (backtrack).

### The Intuition

Think of this as **filling slots** in a combination one by one.

At each "slot," we want to try every available unique number. If we have `candidates = [1, 1, 2, 5]` and we are picking the first number:
1. We pick the *first* `1`.
2. We skip the *second* `1` because we already explored all combinations starting with `1` when we picked the first one.
3. We pick `2`, and so on.
The "Skip" logic `i > index && candidates[i] == candidates[i-1]` is the mechanical way of saying: "Only use the first instance of a duplicate as the starting point for this specific level of recursion."

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(2^n \cdot k)$ | $O(2^n \cdot k)$ |
| Space Complexity | $O(n)$          | $O(n)$           |

#### Time Complexity
In the worst case (all unique elements), there are $2^n$ possible subsets. For each valid combination, we spend $O(k)$ time copying the list into the result. 

#### Space Complexity
$O(n)$ for the recursion stack (maximum depth is $n$) and the space used to store the `currentPath`.

### Code

```java
import java.util.*;

class Solution {
    public List&lt;List&lt;Integer&gt;&gt; combinationSum2(int[] candidates, int target) {
        List&lt;List&lt;Integer&gt;&gt; result = new ArrayList<>();
        // 1. Sort to group duplicates and enable pruning
        Arrays.sort(candidates);
        backtrack(0, target, new ArrayList<>(), candidates, result);
        return result;
    }

    private void backtrack(int index, int target, List&lt;Integer&gt; path, int[] candidates, List&lt;List&lt;Integer&gt;&gt; result) {
        // Base case: Target achieved
        if (target == 0) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = index; i &lt; candidates.length; i++) {
            // 2. Duplicate Pruning: Skip the same element at the same depth
            if (i &gt; index && candidates[i] == candidates[i - 1]) {
                continue;
            }

            // 3. Value Pruning: If the current element is too large, 
            // no need to check further elements in the sorted array
            if (candidates[i] > target) {
                break;
            }

            // 4. Choice: Include candidates[i]
            path.add(candidates[i]);
            
            // 5. Move to next index (i + 1) because each element used once
            backtrack(i + 1, target - candidates[i], path, candidates, result);
            
            // 6. Backtrack: Undo choice
            path.remove(path.size() - 1);
        }
    }
}
```

### Caveats

- **Sort is Non-negotiable** : The duplicate-skipping logic `candidates[i] == candidates[i - 1]` only works if identical numbers are adjacent.
- **Copying the List** : The statement `result.add(new ArrayList<>(path))` is necessary because `path` is a mutable reference that keeps changing during recursion.

- **Non-negative Assumption** : This logic assumes all candidates are positive. If negative numbers were allowed, the pruning condition `candidates[i] > target` would no longer be valid.


### Concepts to Think About

- **Recursion Tree Depth** : The recursion depth is at most `n`, representing the height of the decision tree.
- **State Space Search** : Think about how this differs from `Combination Sum I`, where reuse of elements is allowed.
- **Relation to Subsets II** : This problem is essentially finding unique subsets that sum to a specific value. The "Skip Duplicate" logic is identical to Subsets II.
- **Pass-by-Reference in Java** : Understand how Java handles objects in recursive calls. Objects like `List` are passed by reference, which is why copying becomes important.


### Logical Follow-up

Question : How would you modify this to return only the total count of combinations instead of the combinations themselves?

Solution : If you only need the count, this becomes a Dynamic Programming problem (specifically the 0/1 Knapsack / Subset Sum variant). Backtracking would be inefficient as it would re-calculate many states.

Question: What if the array was not sorted and you weren't allowed to sort it?
Solution: You would need to use a HashSet at each recursion level to keep track of which numbers you have already "tried" as the next element to avoid duplicates. This would cost `O(n)` space per level.
