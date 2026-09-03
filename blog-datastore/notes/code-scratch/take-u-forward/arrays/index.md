# The Ultimate Array Pattern Playbook

This playbook categorizes algorithmic array patterns not by how they are coded, but by **how you spot them** ("The Tell") and **how you execute them** ("The Blueprint"). 

---

## Part 1: Two Pointers & In-Place Segregation

### 1. Opposing Pointers (The $K$-Sum Paradigm)
* **The Tell:** You need to find pairs, triplets, or quadruplets that sum to a target. The problem explicitly forbids duplicate combinations, and you need to return values (not original indices).
* **The Blueprint:** 1. Always sort the array first ($O(N \log N)$).
  2. For $K$-Sum, use $K-2$ nested `for` loops to "fix" the outer elements.
  3. Use `left` and `right` pointers on the remaining subarray. If sum is too small, `left++`. If too large, `right--`.
  4. Skip adjacent identical elements at every loop level to prevent duplicate combinations.
* **Problems:** Two Sum (Sorted), 3Sum, 4Sum.

### 2. Slow/Fast Pointer Compaction (In-Place Segregation)
* **The Tell:** Modify an array in-place ($O(1)$ space) to group, remove, or push certain elements to one side while maintaining relative order (stability) of the rest.
* **The Blueprint:** `slow` tracks the boundary of the "completed" zone. `fast` explores ahead. When `fast` finds a valid element to keep, swap/overwrite it at the `slow` index, then `slow++`.
* **Problems:** Move Zeros to End, Remove Duplicates from Sorted Array.

### 3. Synchronized Linear Scan (The Merge Pattern)
* **The Tell:** You are given two or more *sorted* arrays and need to find their intersection, union, or merge them in $O(N+M)$ time.
* **The Blueprint:** Place pointer `i` at Array A and `j` at Array B. Compare `A[i]` and `B[j]`. The pointer on the *smaller* value must move forward to "catch up." If equal, process the match and move both. (If merging in-place with extra space at the end, run this *backwards*).
* **Problems:** Intersection of 2 Arrays, Union of 2 Arrays, Merge Sorted Arrays (In-Place).

### 4. Three-Way Partitioning (Dutch National Flag)
* **The Tell:** Group an array containing a strictly limited set of distinct values (e.g., 0s, 1s, 2s) in $O(N)$ time and $O(1)$ space.
* **The Blueprint:** Use `low`, `mid`, and `high` pointers. `mid` is the explorer. If `mid` finds a low value, swap with `low` and increment both. If it finds a high value, swap with `high` and decrement `high` (do NOT increment `mid` yet). If it's a middle value, just `mid++`.
* **Problems:** Sort an array of 0s, 1s, and 2s.

### 5. Strided Insertion (Stable Interleaving)
* **The Tell:** Interleave elements (e.g., positive/negative) while preserving relative order in $O(N)$ time.
* **The Blueprint:** Stable, in-place interleaving in $O(N)$ is practically impossible. Allocate a new result array. Use two "strided" pointers (e.g., `pos = 0`, `neg = 1`). Loop once, place the element, and jump the specific pointer by 2.
* **Problems:** Rearrange Array Elements by Sign.

---

## Part 2: Subarrays & Stream Processing

### 6. Kadane’s Paradigm (Local vs. Global Extrema)
* **The Tell:** Find a maximum or minimum metric (sum, product) derived from a *contiguous* subarray containing mixed positive and negative numbers.
* **The Blueprint:** Track `current_metric` and `max_metric`. At every step, decide: "Do I extend my existing subarray with this element, or do I start a brand new subarray right here?" Update the global max immediately if the current max exceeds it.
* **Problems:** Maximum Subarray (Kadane's), Maximum Product Subarray.

### 7. Right-to-Left State Carry (Reverse Traversal)
* **The Tell:** An element's valid state depends on an aggregate metric (like max, sum, or visibility) of all elements to its *right* (its "future").
* **The Blueprint:** Iterate backward ($N-1$ down to 0). Carry a state variable (e.g., `max_right`). Compute the answer for the current element in $O(1)$ time by comparing it against the state variable, then update the state variable for the next element.
* **Problems:** Leaders in an Array.

### 8. State Accumulator (Single-Pass Scan)
* **The Tell:** Find a global extremum, verify a strict sequence, or find a simple contiguous local maximum in one unidirectional pass.
* **The Blueprint:** Define state variables before the loop. Iterate once. Always identify your **Reset/Early Exit Condition** (e.g., return `false` the moment a drop is detected in a sorted check, or reset `streak = 0` when a 0 is found).
* **Problems:** Check if Array is Sorted, Max Consecutive Ones, Largest/Second Largest Element.

---

## Part 3: Mathematics, Frequency & Bit Manipulation

### 9. Mutual Cancellation (Boyer-Moore Majority Vote)
* **The Tell:** Find elements appearing more than $\lfloor N/K \rfloor$ times using strictly $O(1)$ auxiliary space.
* **The Blueprint:** Track $K-1$ candidates and $K-1$ counters. If an element matches a candidate, increment its counter. If not, and there's an empty slot, claim it. If no empty slots, decrement *all* counters. Mathematically, the true majorities survive. **Must do a 2nd pass** to verify the survivors.
* **Problems:** Majority Element I ($> N/2$), Majority Element II ($> N/3$).

### 10. Bitwise Annihilation (XOR Trick)
* **The Tell:** Elements are paired in exact duplicates, with exactly one missing its twin, OR you need to find a missing number in a strict sequence $[0, N]$. $O(1)$ space is strictly required.
* **The Blueprint:** XOR properties: $X \oplus X = 0$ and $X \oplus 0 = X$.
  * *For pairs:* XOR all array elements together. Duplicates annihilate to 0. The remainder is the unique element.
  * *For sequences:* XOR all array elements *and* all expected loop indices ($1$ to $N$). Every present number cancels its index. The remainder is the missing number.
* **Problems:** Single Number, Missing Number.

### 11. Combinatorial Generation (Pascal's Suite)
* **The Tell:** Problems involving combinations ($nCr$), grid paths, or Pascal's Triangle.
* **The Blueprint:** * *Full structure:* Use DP/Tabulation ($O(N^2)$).
  * *Single row/element:* Use the Multiplicative Math trick in $O(N)$ time: `Current = Previous * (n - i + 1) / i`. **Gotcha:** Use a 64-bit integer, and multiply before you divide to prevent truncation.
* **Problems:** Pascal's Triangle I, II, III.

---

## Part 4: Array Transformations & Matrix Algorithms

### 12. In-Place Cyclic Shifts (The Reversal Algorithm)
* **The Tell:** Rotate or shift an array by $K$ places using $O(1)$ auxiliary space.
* **The Blueprint:** Normalize $K = K \pmod N$. 
  1. Reverse the first block.
  2. Reverse the second block.
  3. Reverse the entire array. 
* **Problems:** Left/Right Rotate Array by K, Rotate by 1.

### 13. Lexicographical Pivot (Next Permutation)
* **The Tell:** Find the "next", "previous", or "$K$-th" arrangement of elements in-place.
* **The Blueprint:** 1. Traverse right-to-left to find the first decreasing element (the pivot).
  2. Traverse right-to-left again to find the smallest element strictly greater than the pivot.
  3. Swap them.
  4. Reverse everything to the right of the pivot to reset the suffix to its lowest order.
* **Problems:** Next Permutation.

### 14. Matrix Linear Transformations (Composition)
* **The Tell:** Rotate, reflect, or mirror a 2D matrix in-place.
* **The Blueprint:** Break complex rotations into two mathematically simple reflections. 
  * *90° Clockwise:* Transpose (swap `[i][j]` with `[j][i]`), then Reverse each Row.
  * *90° Counter-Clockwise:* Transpose, then Reverse each Column.
* **Problems:** Rotate Matrix by 90 Degrees.

### 15. Boundary Shrink Simulation
* **The Tell:** Non-linear traversal of a 2D grid (spiral, concentric circles).
* **The Blueprint:** Maintain `top`, `bottom`, `left`, `right` boundaries. Write 4 isolated loops (Right, Down, Left, Up). After a directional sweep, shrink that specific boundary (e.g., `top++`). Wrap in a master `while` loop. **Gotcha:** Always re-check bounds before the Left and Up sweeps to prevent duplicate processing on non-square matrices.
* **Problems:** Print Matrix in Spiral Manner.

---

## Part 5: Divide & Conquer

### 16. Modified Merge Sort
* **The Tell:** Count pairs `(i, j)` that satisfy an inequality (e.g., $nums[i] > nums[j]$) where relative order matters ($i < j$). Brute force is $O(N^2)$, required is $O(N \log N)$.
* **The Blueprint:** Hijack Merge Sort. During the merge step of the left and right sorted halves, if an element on the right is placed before an element on the left, it is out of order with *every remaining element* in the left half. Add the remaining size of the left half to your counter.
* **Problems:** Count Inversions, Reverse Pairs.

---

## 🚀 Meta-Strategies to Always Keep in Mind

1. **The "Sorting Cheat Code":** If the problem asks for values (not indices), and you are stuck on an $O(N^2)$ algorithm, ask yourself: *"Does sorting this first give me a linear pass?"* Sorting takes $O(N \log N)$, which is vastly better than $O(N^2)$.
2. **The "Space-Time Tradeoff":** If a linear search takes $O(N)$ and a Hash Map takes $O(N)$ space, clarify with the interviewer what the bottleneck is. (e.g., Two Sum: Hash Map vs Sorting + Two Pointers).
3. **The `long` Guard:** Anytime a problem asks you to calculate a sum, product, or combination of numbers, default to using a 64-bit integer (`long` in Java/C++) for intermediate calculations before casting back to 32-bit.
4. **The Base Case Check:** Before writing complex pointers, always write two lines of code to check `if (nums == null || nums.length == 0) return ...;`