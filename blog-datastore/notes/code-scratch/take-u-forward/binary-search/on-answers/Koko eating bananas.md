---
tags:
  - cc
  - binary-search
  - answer-space
  - greedy
---

# Koko Eating Bananas (Minimum Rate)

## Question

A monkey has $n$ piles of bananas. In one hour, she can eat $k$ bananas from a pile. If the pile has fewer than $k$, she finishes the pile and waits until the next hour. Given $h$ hours, find the **minimum integer** $k$ such that she can finish all bananas.

## Solution

### Pattern

**Binary Search on Answer Space**

### How to Identify

1. The goal is to **minimize** a value ($k$).
2. The search space is **monotonic**: If Koko can finish at speed $10$, she can definitely finish at speed $11$. If she can't finish at $10$, she definitely can't at $9$.
3. We have a clear range for the answer: $[1, \max(piles)]$.

### Description

We binary search for the speed $k$. For each `mid`, we calculate the total hours required by summing the ceiling of `pile / mid`.

- If `totalHours &lt;= h`: The speed is valid. Record it as a candidate and try to find a smaller one (`right = mid - 1`).
- If `totalHours &gt; h`: The speed is too slow. Increase it (`left = mid + 1`).

### The Intuition

Imagine a treadmill speed. If you set it to $10$ mph and finish your run in time, you ask, "Could I have gone slower and still finished?" You drop the speed and check. If you set it to $2$ mph and fail, you know you _must_ go faster.

### Complexity

- **Time Complexity:** $O(n \cdot \log(\max(piles)))$
- **Space Complexity:** $O(1)$

### Code

```java
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int left = 1;
        int right = 0;
        for (int pile : piles) right = Math.max(right, pile);

        int result = right;
        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, mid, h)) {
                result = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return result;
    }

    private boolean canFinish(int[] piles, int speed, int h) {
        long totalHours = 0;
        for (int pile : piles) {
            // Integer Ceiling: (a + b - 1) / b
            totalHours += (pile + (long)speed - 1) / speed;
        }
        return totalHours <= h;
    }
}
```

## Concepts to Think About

- The h == piles.length Case: In this case, the answer is always max(piles) because she needs at least one hour per pile.

- Large h: If h is much larger than the total number of bananas, the answer is 1.

- Floating Point Precision: Why not use Math.ceil((double)pile / speed)? Aside from performance, casting large long values to double can lose precision, leading to incorrect results for very large piles.

## Logical Follow-up

**Question:** "If Koko could eat from multiple piles in the same hour as long as she doesn't exceed k total bananas, how would the problem change?"

**Solution:** The problem would become much simpler. You would just need to find ⌈(∑piles)/h⌉. The restriction of "one pile per hour" is what makes the binary search necessary.

**Question:** "What if Koko is picky and will only eat from a pile if it has an **even** number of bananas? How does your `canFinish` function change?"

**Solution:** You would add an `if (pile % 2 == 0)` check inside the loop. However, you must ask the interviewer: "Does she skip the odd piles entirely, or does she eat the even portion and leave 1 banana?" This clarifies the **requirements phase** of the interview.

**Question (The Distributed Koko):**
"Imagine the `piles` array is so massive it is stored across 1,000 different machines in a Google Data Center. You cannot fit the array in one machine's memory. How do you find the minimum $k$?"

**L5 Analysis & Solution:**

1.  **MapReduce Approach:** The Binary Search still happens on a "Master" node because $\log(10^9)$ is only 30 iterations.
2.  **Worker Nodes:** For each iteration, the Master broadcasts the current `mid` (speed) to all 1,000 Worker nodes.
3.  **Local Summation:** Each worker calculates the `totalHours` for its local slice of `piles`.
4.  **Reduce:** The Master sums the 1,000 partial results and compares them to `h`.
5.  **Network Bottleneck:** Mention that the bottleneck here isn't the CPU; it's the network latency of broadcasting the `mid` and collecting the results. You might optimize by having workers skip the calculation if `mid` hasn't changed significantly.
