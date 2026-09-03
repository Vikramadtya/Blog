# The Binary Search Master Guide

Binary search is not just about finding a number in an array; it is about **reducing a search space by half at every step**. To master it, you must recognize the core patterns and know exactly which loop condition to apply.


## Identifying Binary Search

1. **Search Space:** Can I define a `low` and `high` for the final answer?
2. **The Predicate:** Can I write a `boolean isPossible(x)` function that runs in $O(N)$?
3. **The Flip:** Does `isPossible(x)` go from `false, false, false...` to `true, true, true...`?


### 🔍 Quick Reference: The 4 Core Patterns

| Pattern              | Purpose                            | Loop Condition          | Search Space Update                 | Typical Use Cases                     |
| :------------------- | :--------------------------------- | :---------------------- | :---------------------------------- | :------------------------------------ |
| **Exact Match**      | Find a specific target.            | `while (left &lt;= right)` | `left = mid + 1`, `right = mid - 1` | Standard sorted array search.         |
| **Lower Bound**      | Find first element $\ge$ target.   | `while (left &lt; right)`  | `left = mid + 1`, `right = mid`     | First occurrence, insertion point.    |
| **Upper Bound**      | Find first element $&gt;$ target.     | `while (left &lt; right)`  | `left = mid + 1`, `right = mid`     | Counting occurrences, range limits.   |
| **Search on Answer** | Find min/max satisfying condition. | `while (left < right)`  | Depends on the $T/F$ predicate.     | Optimization, "minimize the maximum". |

---

## Part 1: The Foundational Patterns

### 1. Standard Binary Search (Exact Match)
**Scenario:** You need to find if a specific value exists and return its exact index. 
**Logic:** If $nums[mid]$ is not the target, you can safely discard it completely.

```java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    // Inclusive search space: we check the element even if left == right
    while (left <= right) {
        int mid = left + ((right - left) &gt;&gt; 1);
        
        if (nums[mid] == target) return mid; // Early return
        if (nums[mid] &lt; target) left = mid + 1;
        else right = mid - 1;
    }
    return -1; // Target not found
}
```

### 2. Lower Bound (First element $\ge$ target)
**Scenario:** You need to find the **first occurrence** of a number, or find where a number *should* be inserted to maintain a sorted order.
**Logic:** If $nums[mid] \ge target$, $mid$ *could* be the answer, so we cannot discard it. We squeeze the right bound to $mid$.

```java
public int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length; 
    
    // Exclusive search space: we squeeze until left == right
    while (left &lt; right) {
        int mid = left + ((right - left) &gt;&gt; 1);
        
        if (nums[mid] &lt; target) left = mid + 1;
        else right = mid; // Squeeze leftward, keeping mid in the search space
    }
    return left; // Could be nums.length if all elements are &lt; target
}
```

### 3. Upper Bound (First element $&gt;$ target)
**Scenario:** You need to find the position strictly *after* the last occurrence of a target (useful for range queries: `upper_bound - lower_bound = total_occurrences`).
**Logic:** Similar to lower bound, but we only squeeze the right bound when the element is strictly greater than the target.

```java
public int upperBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    
    while (left &lt; right) {
        int mid = left + ((right - left) &gt;&gt; 1);
        
        if (nums[mid] &lt;= target) left = mid + 1;
        else right = mid; // Only squeeze when nums[mid] &gt; target
    }
    return left; // Could be nums.length if all elements are &lt;= target
}
```


!!! note "Note"
    We can use _lower_ & _upper_ bound to find the occurrence count efficiently.

---

## Part 2: Advanced Scenarios & Special Cases

### Case A: Binary Search on Answer (Predicate-based)

**Scenario:** You are not searching an array; you are searching a range of possible answers (e.g., "What is the minimum speed required to finish this task?").

**How to Identify:** 1. The problem asks to find a minimum/maximum value that satisfies a condition.
2. You can write a boolean `isPossible(x)` function.
3. The function's results are monotonic (e.g., `False, False, True, True, True`).

```java
public int binarySearchAnswer(int low, int high) {
    while (low &lt; high) {
        int mid = low + ((high - low) &gt;&gt; 1);
        
        if (isPossible(mid)) {
            high = mid; // Try to find a smaller valid answer (Look left)
        } else {
            low = mid + 1; // Answer must be larger (Look right)
        }
    }
    return low;
}
```

### Case B: Rotated Sorted Arrays

**Scenario:** The array was sorted but shifted (e.g., `[4,5,6,7,0,1,2]`). 
**Core Principle:** No matter where you split a rotated array, **at least one half will always be perfectly sorted**. 
**Tactic:** Check which half is sorted ($nums[left] \le nums[mid]$). Then, check if your target falls within the boundary of that sorted half. If it does, search there; if not, search the other half.

### Case C: Infinite / Unknown Length Arrays

**Scenario:** You don't have a `.length` property and accessing out of bounds throws an error.
**Core Principle:** Exponential backoff (or expansion). 
**Tactic:** Start with bounds $left = 0$, $right = 1$. If $nums[right] &lt; target$, double the search space: `left = right` and `right = right * 2`. Repeat until $nums[right] \ge target$, then perform a standard binary search between those established bounds.

---

## Part 3: Masterclass on Loop Conditions

Knowing when to use `left &lt;= right` vs `left < right` is the most common point of failure. Use this framework to never get stuck.

| Scenario                | Loop Condition          | Search Space       | Update Logic                 | Exit State                       |
| :---------------------- | :---------------------- | :----------------- | :--------------------------- | :------------------------------- |
| **Finding Exact Value** | `while (left <= right)` | Inclusive $[L, R]$ | `L = mid + 1`, `R = mid - 1` | `L &gt; R`, Target not found.       |
| **Finding Boundary**    | `while (left &lt; right)`  | Half-Open $[L, R)$ | `L = mid + 1`, `R = mid`     | `L == R`, This is the candidate. |


- Use `while (left <= right)` when you have an **early return** (`if nums[mid] == target return mid`).
- Use `while (left < right)` when you are **narrowing down** to a specific index (like the minimum or a peak).


### The "Search" Pattern (`left <= right`)

- **Best for:** Finding an exact value.
- **Search Space:** Inclusive $[L, R]$.
- **Update:** `left = mid + 1` and `right = mid - 1`. You discard $mid$ entirely because you already verified it isn't the target.
- **Exit State:** The loop finishes when $left &gt; right$. If you haven't returned inside the loop, the target does not exist.
- **Logic:** If `nums[mid]` isn't the target, discard it completely (`mid + 1`, `mid - 1`).
- **Why:** If the search space is one element ($L=R$), you still want to check that element.
- **Movement:** Since you checked `mid` and it wasn't the target, you must exclude it: `mid + 1` and `mid - 1`.


### The "Squeeze" Pattern (`left &lt; right`)

- **Best for:** Finding boundaries, transitions, or answering "Binary Search on Answer" problems.
- **Search Space:** Half-Open $[L, R)$.
- **Update:** `left = mid + 1` and `right = mid`. You keep $mid$ in the search space because it *might* be the boundary you are looking for.
- **Logic:** The `right = mid` update keeps `mid` in the search space because it _could_ be the answer.
- **Exit State:** Terminate when only one element remains ($left == right$). That remaining element is your candidate.
- **Critical Safety Rule:** When using `right = mid`, you **must** ensure the loop terminates to avoid infinite loops. 
- **Why:** The loop stops when $L=R$, which is usually the point where the condition flips.
- **Movement:** Often uses `right = mid` because `mid` might still be the answer you're looking for (the boundary).

Because division truncates toward zero, $mid$ leans left. Therefore, `left = mid + 1` guarantees progress. If your logic ever requires `left = mid`, you must change your mid calculation to round up: `mid = left + ((right - left + 1) &gt;&gt; 1)`.


## Concepts to Think About

- **Lower Bound:** Finding the first element $\ge$ target always uses `left &lt; right`.
- **Search Space:** Does `left < right` work if the target might NOT be in the array? (Yes, but you need a final check: `if (nums[left] == target)` after the loop).

- **Search Space Size:** `left < right` ensures the search space is always $\ge 2$ elements.
- **Convergence:** The "squeeze" approach is more mathematically robust for finding transition points in functions or rotated arrays.



## Common Question

**Question:** "Given a sorted array that has been **rotated** at some pivot, find the index of a target. For example: `nums = [4,5,6,7,0,1,2], target = 0` should return `4`."

**Hint:** Even if rotated, at least one half (left or right) is always sorted. Use that sorted half to determine which direction to move.


**Question (Search in an Infinite Array):** "Imagine you are searching for a `target` in a sorted array, but you **don't know the size of the array**. There is no `.length` property. If you access an index out of bounds, it throws an exception or returns `Integer.MAX_VALUE`. How do you find the target in $\text{O}(\log \text{index})$ time?"

**Solution Logic:**

1.  **Exponential Backoff (Phase 1):** You need to find the "Right" boundary. Start with `right = 1`. If `nums[right] < target`, double it: `right = right * 2`.
2.  Once `nums[right] &gt;= target`, you have found a range $[right/2, right]$ where the target must live.
3.  **Binary Search (Phase 2):** Perform standard Binary Search within that range.
