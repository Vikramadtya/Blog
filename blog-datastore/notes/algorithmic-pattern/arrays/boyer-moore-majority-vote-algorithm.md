# Boyer-Moore Majority Vote Algorithm

The Boyer-Moore Majority Vote Algorithm is an **online streaming algorithm** designed to find the majority element in a sequence using linear time and constant space. It was published in 1981 by Robert S. Boyer and J Strother Moore.

---

## 1. Core Concept & Definitions

### What is a Majority Element?
A majority element in an array of size $N$ is an element that appears **strictly more than $\lfloor \frac{N}{2} \rfloor$ times**.
> **Important:** There can be at most **one** such element in any given array. If an element appears exactly $N/2$ times, it is technically NOT a majority element by this definition.

### The Problem of Validation
The algorithm works by process of elimination. It is guaranteed to find the majority element **if it exists**. If a majority element does not exist, the algorithm will still output one of the elements as a candidate. Therefore, the algorithm is traditionally divided into two passes:

1.  **Pass 1 (Find Candidate):** Identify a potential majority element.
2.  **Pass 2 (Verify Candidate):** Confirm the candidate appears $> \frac{N}{2}$ times.

---

## 2. The Stack Analogy (Intuition)

Imagine you have a physical stack. This stack has a very strange rule:

> It can only hold **one type of item at a time**.

---

### The Rules

1. **If the stack is empty**
      - Put the current item into the stack.
      - It becomes the current **Candidate**.

2. **If the item matches the Candidate**

      - Push it onto the stack.
      - This reinforces the candidate.

3. **If the item is different from the Candidate**

      - Pop one item from the stack.
      - The two elements effectively **cancel each other out**.

---

### Why the Majority Wins

Because the majority element appears more than `n/2` times, it has more occurrences than **all other elements combined**.


- In the worst-case scenario, every non-majority element tries to cancel out one majority element.
- Even if all minority elements work together perfectly, they still do **not** have enough occurrences to completely eliminate the majority.
- Therefore, after all cancellations:
    - The remaining element in the stack must be the **majority element** (if one exists).

---

## 3. Algorithm Steps ($N/2$ Case)

### Pass 1: Candidate Selection
1.  Initialize a variable `candidate` (can be null/empty) and a `count = 0`.
2.  Iterate through every element `x` in the array:
    * If `count == 0`:
        * Set `candidate = x`.
        * Set `count = 1`.
    * Else if `x == candidate`:
        * `count++`
    * Else:
        * `count--` (This represents a "pairing" where two different elements cancel each other out).

### Pass 2: Verification
1.  Reset `count = 0`.
2.  Iterate through the array again.
3.  Every time the element matches `candidate`, increment `count`.
4.  If `count > N/2`, return `candidate`.
5.  Otherwise, the array has no majority element (return -1 or null).

---

## 4. Implementation (Python)

```python
def find_majority_element(nums):
    # Pass 1: Find Candidate
    candidate = None
    count = 0
    
    for x in nums:
        if count == 0:
            candidate = x
            count = 1
        elif x == candidate:
            count += 1
        else:
            count -= 1
            
    # Pass 2: Verification
    actual_count = 0
    for x in nums:
        if x == candidate:
            actual_count += 1
            
    if actual_count > len(nums) // 2:
        return candidate
    else:
        return -1 # Or raise Exception
```
## 5. Complexity Analysis

- **Time Complexity:** `O(n)`  
  We perform exactly two linear scans of the input array.

- **Space Complexity:** `O(1)`  
  We only maintain two variables (`candidate` and `count`), regardless of the input size.

---

## 6. Extension: Finding Elements with Frequency > n/3

This is the generalized version, often referred to as the **Misra-Gries Heavy Hitters Algorithm**.

### The Logic (`n/3` example)

If we want to find all elements that appear more than `n/3` times, there can be at most **two** such elements because:

\[
\left\lfloor \frac&#123;n&#125;&#123;3&#125; \right\rfloor + 
\left\lfloor \frac&#123;n&#125;&#123;3&#125; \right\rfloor + 
\left\lfloor \frac&#123;n&#125;&#123;3&#125; \right\rfloor > n
\]

would be impossible.

So, we maintain:

- **2 candidates**
- **2 counters**

---

### Generalized Algorithm Steps (`n/k`)

1. Maintain `k - 1` candidates and `k - 1` counters.

2. For each element `x`:

   - If `x` matches any existing candidate, increment its corresponding counter.
   - Else if any counter is `0`, replace that candidate with `x` and set its counter to `1`.
   - Else:
     - Decrement all `k - 1` counters by `1`.

3. **Verification Pass**
   
   You **must** perform a second pass to count the actual occurrences of the remaining candidates, because the first pass only identifies the most likely heavy hitters.

---

## 7. Practice Problems

| Problem                            | Difficulty | Key Constraint                                    |
| ---------------------------------- | ---------- | ------------------------------------------------- |
| LeetCode 169: Majority Element     | Easy       | Guaranteed majority element (Pass 1 only)         |
| LeetCode 229: Majority Element II  | Medium     | Find all elements > `n/3` (two-candidate version) |
| Check for Majority in Sorted Array | Easy       | Can be solved in `O(log n)` using Binary Search   |
| Stream of Characters               | Hard       | Finding the heavy hitter in an infinite stream    |