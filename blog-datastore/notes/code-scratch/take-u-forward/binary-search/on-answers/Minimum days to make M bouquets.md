---
tags:
  - cc
  - binary-search
  - greedy
  - sliding-window-logic
---

# Minimum Days to Make M Bouquets

## Question

Given an array `nums` where `nums[i]` is the day rose `i` blooms. To make a bouquet, you need $k$ **adjacent** bloomed roses. Find the minimum days required to make $m$ bouquets. Return $-1$ if impossible.

## Solution

### Pattern

**Binary Search on Answer Space**

### How to Identify

1. **Optimization Goal:** "Minimum days to..."
2. **Monotonicity:** If you can make $m$ bouquets on day $D$, you can definitely make them on day $D+1$. If you can't on day $D$, you definitely can't on day $D-1$.
3. **Contiguity Constraint:** The "adjacent" requirement suggests a greedy linear scan.

### Description

We binary search through the range of days $[\min(nums), \max(nums)]$. For a candidate day `mid`:

- Iterate through the roses. If a rose's bloom day $\le mid$, it is bloomed.
- Count how many sets of $k$ **consecutive** bloomed roses exist.
- If total bouquets $\ge m$, `mid` is possible. Try a smaller day (`right = mid - 1`).
- Otherwise, we need more time (`left = mid + 1`).

### The Intuition

Imagine a garden where roses pop up like lights. You are standing with a stopwatch. You want to press "STOP" at the exact moment you see $m$ blocks of $k$ lights glowing next to each other. Instead of waiting second-by-second, you use binary search to "jump" through time.

### Complexity

- **Time Complexity:** $O(n \cdot \log(\max(nums)))$
- **Space Complexity:** $O(1)$

### Code

```java
class Solution {
    public int minDays(int[] bloomDay, int m, int k) {
        // Defensive check for overflow
        if ((long) m * k > bloomDay.length) return -1;

        int left = Integer.MAX_VALUE;
        int right = Integer.MIN_VALUE;
        for (int day : bloomDay) {
            left = Math.min(left, day);
            right = Math.max(right, day);
        }

        int ans = right;
        while (left &lt;= right) {
            int mid = left + (right - left) / 2;
            if (getBouquets(bloomDay, mid, k) &gt;= m) {
                ans = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return ans;
    }

    private int getBouquets(int[] bloomDay, int day, int k) {
        int total = 0;
        int count = 0;
        for (int b : bloomDay) {
            if (b <= day) {
                count++;
                if (count == k) {
                    total++;
                    count = 0;
                }
            } else {
                count = 0; // Reset because roses must be adjacent
            }
        }
        return total;
    }
}
```

## Concepts to Think About

Greedy vs. DP: Why does a greedy count work for adjacency here? (Because taking the first available k roses never prevents you from making more bouquets later).

Search Range: If m and k are small, we might find the answer early. If m⋅k is close to n, the answer will be closer to max(nums).

Predicate Logic: The getBouquets function is a "Predicate." In Binary Search on Answer Space, the efficiency of your predicate determines your total runtime.

## Logical Follow-up

**Question:** "What if the bouquets didn't have to be made of **adjacent** roses? How would the code and complexity change?"

**Solution:**

- **Logic:** You would no longer need the `count` reset in the `check` function. You would simply count all roses where `bloomDay[i] <= mid` and return `total / k`.
- **Optimization:** In that case, you wouldn't even need Binary Search! You could just find the $m \cdot k$-th smallest value in the array using a **QuickSelect** algorithm in $O(n)$ average time.

**Question (The Fertilizer Boost):**
"You are now given an additional integer `fertilizer`. You can use one unit of fertilizer to make any rose bloom **instantly** (on Day 0). Find the minimum days required to make $m$ bouquets now."

**Analysis & Solution:**

1.  **Binary Search remains:** We still search for `days`.
2.  **Modified Predicate:** Our `check(mid)` function now needs to be smarter. For a given `mid`, some roses are already bloomed. For those that aren't, we _could_ use fertilizer.
3.  **Greedy is no longer enough:** We want to use fertilizer where it helps form a bouquet most efficiently (i.e., in a gap of size $G$ where we already have $k-G$ roses bloomed).
4.  **Sliding Window / DP:** This becomes a problem of finding the maximum number of bouquets we can form if we are allowed to "fill" up to `fertilizer` gaps.
    - You would use a **Sliding Window** inside the Binary Search to see if there's a way to use $\le \text{fertilizer}$ units to reach the $m$ bouquets goal.
