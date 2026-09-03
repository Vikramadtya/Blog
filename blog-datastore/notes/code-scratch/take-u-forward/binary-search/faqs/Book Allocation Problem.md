---
tags:
  - binary-search
  - greedy
  - arrays
---

# Allocate Books

## Question

Given an array `nums` representing the number of pages in $N$ books, and an integer $M$ students. Allocate all books contiguously such that each student gets at least one book. Minimize the maximum number of pages assigned to any student. If allocation is impossible, return -1.

## Solution

### Pattern

**Binary Search on Answer (Min-Max Pattern)**
We cannot easily compute the exact contiguous partitions directly. However, the optimal "maximum pages" any single student must read exists within a strict mathematical range. We binary search this range. For a guessed limit, we use a greedy algorithm to simulate the assignment. If the assignment uses $\le M$ students, the guess is valid, and we try to find a smaller valid limit.

### How to Identify

- The problem explicitly asks to **minimize a maximum** (minimize the maximum pages assigned).
- The items must remain **contiguous** (subarrays).
- Simulating the process for a fixed "guessed" limit takes $O(N)$ linear time.

### Description

Step-by-step explanation:

1. **Edge Case Guard:** If $M > N$ (more students than books), return -1, because some students would get 0 books.
2. **Establish Bounds (using `long`):** - **Lower Bound (`low`):** The absolute smallest maximum pages a student can read is the largest single book. (Even if every student gets exactly 1 book, someone gets the biggest one).
   - **Upper Bound (`high`):** The absolute largest maximum pages is the sum of all books. (If there is only 1 student, they read everything).
3. **Binary Search:** Loop while `low &lt;= high`. Calculate `mid` as the guessed maximum allowed pages.
4. **Greedy Simulation:** Pass `mid` to a helper function. 
   - Iterate through the books. Assign books to a student until adding the next book exceeds `mid`. 
   - If it exceeds, allocate a new student.
   - If total students allocated $&gt; M$, the guess `mid` was too strict (too small). Return false.
5. **Adjust Bounds:**
   - If valid: `mid` works. Record it implicitly by throwing away the upper half `high = mid - 1` to search for a more optimal (smaller) limit.
   - If invalid: `mid` is too small. Throw away the lower half `low = mid + 1`.
6. **Final Computation:** When the loop breaks, `low` will hold the absolute optimal minimum max-pages. Return it.

### The Intuition

Imagine you have 3 students and a shelf of books of varying thicknesses. The reading assignment finishes only when the *slowest* student finishes. You want to divide the work as equally as possible, avoiding giving anyone a massive contiguous stack of reading.
You guess a quota: "No student reads more than 500 pages." You hand out books to Student 1 until they hit 500. Then you hand out to Student 2. 
If you run out of students before you run out of books, your quota of 500 was too small. You binary search this quota until you find the exact lowest number that perfectly utilizes your students.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \log S)$  | $O(N \log S)$    |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Let $S$ be the sum of all elements in array. The size of the search space is $S - \max(nums)$. We halve this space logarithmically, taking $\approx \log_2(S)$ steps. During each step, the helper function iterates the array of size $N$. Total time is $O(N \log S)$.

#### Space Complexity

Only primitive pointers (`low`, `high`, `mid`) are allocated. Auxiliary space is strictly $O(1)$.

### Code

```java
class Solution {
    public int findPages(int[] books, int students) {
        if (books == null || books.length == 0 || students > books.length) {
            return -1;
        }

        long low = 0;
        long high = 0;

        // Establish bounds. Use long to prevent summation overflow.
        for (int b : books) {
            low = Math.max(low, b);
            high += b;
        }

        while (low &lt;= high) {
            long mid = low + (high - low) / 2;

            if (isValidAllocation(books, students, mid)) {
                high = mid - 1; // Valid, but try to squeeze it tighter
            } else {
                low = mid + 1;  // Limit too strict, needs more students
            }
        }

        return (int) low;
    }

    private boolean isValidAllocation(int[] books, int targetStudents, long maxPagesAllowed) {
        long currentPages = 0;
        int studentsRequired = 1;

        for (int pages : books) {
            if (currentPages + pages &gt; maxPagesAllowed) {
                studentsRequired++;
                currentPages = pages;

                // Fast-fail to save iterations
                if (studentsRequired > targetStudents) {
                    return false;
                }
            } else {
                currentPages += pages;
            }
        }

        return true;
    }
}
```

## Caveats

- **Integer Overflow:** The sum of all books can easily exceed $2^{31}-1$. If `high` is an `int`, it will overflow into negative numbers, breaking the binary search instantly. Always use `long` when summing arrays for binary search bounds.
- **Lower Bound Logic:** If you set `low = 0` or `low = min(books)`, the greedy function fails immediately when encountering a book larger than `mid`, because a single book cannot be split between students. The minimum possible answer is *always* the largest single element.
- **Non-Contiguous Allocation:** If books weren't contiguous, this would become the "Partition Problem" or "Multi-way Number Partitioning," which is NP-hard and requires Backtracking or DP.
- **Minimum Value:** The search must start at `max(nums)`, not `0`. If `mid` is less than the largest book, that book can never be assigned.

## Concepts to Think About

- **The Master Template:** This problem is mathematically identical to LeetCode 410 (*Split Array Largest Sum*), LeetCode 1011 (*Capacity To Ship Packages Within D Days*), and Painter's Partition. Recognizing the "Minimize Maximum of Contiguous Subarrays" phrasing allows you to deploy this template universally.
- **Why `studentsRequired &lt;= targetStudents` works:** Even if we finish allocating and the required students is strictly *less* than $M$, it is still a valid answer. We can arbitrarily split any student's existing pile further to reach exactly $M$ students. Splitting an existing pile only *decreases* its sum, so the maximum limit constraint we tested for is never violated.
- **Aggressive Cows vs. Book Allocation:** One maximizes the minimum; the other minimizes the maximum. Both use BS on Answer Space.
- **Precision:** If the inputs were floating point (e.g., allocating "time" or "gas"), we would use `while (right - left &gt; 1e-7)` instead of `while (left <= right)`.

## Logical Follow-up

**Question:** If students were allowed to read *non-contiguous* books (e.g., Student 1 reads book 0 and book 5), how would the optimal solution change?
**Solution:** This transforms the problem into the **Multiprocessor Scheduling Problem** (a variation of the Partition Problem), which is NP-Hard. A greedy binary search no longer works because you must evaluate all combinations. You would sort the array descending and use Backtracking/DFS with Branch and Bound to find the optimal assignment, degrading time complexity to exponential $O(K^N)$ bounds, or use DP with bitmasking if $N$ is very small.


**Question:** How would you solve this if the array was too large to fit on a single machine?
**Solution:** (L5/L6 Response) Use a **MapReduce** style approach. The Binary Search logic remains on a coordinator node. The `getRequiredStudents` (Greedy check) is difficult to parallelize because it's contiguous. However, if we know the split points, we can distribute the array. Alternatively, we search for the answer on a coordinator and broadcast the `mid` to workers to validate their local chunks, but this requires careful coordination of "carry-over" pages between nodes.
