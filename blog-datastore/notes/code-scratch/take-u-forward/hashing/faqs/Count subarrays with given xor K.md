---
tags:
  - arrays
  - hash-table
  - bit-manipulation
  - prefix-sum
---

# Count Subarrays with Given XOR K

## Question

Given an array of integers `nums` and an integer $k$, return the total number of contiguous subarrays whose elements, when XORed together, equal $k$.

## Solution

### Pattern

**Prefix XOR with Hash Map (Frequency Map)**
Maintain a running XOR as you iterate through the array. Store the frequencies of all running XORs seen so far in a Hash Map. At each step, check if the value $(current\_xor \oplus k)$ exists in the map; if it does, add its frequency to your total count.

### How to Identify

- The problem asks for the count of **contiguous subarrays**.
- The constraint relies on a binary operation (**XOR**), similar to prefix sum problems.
- Sliding Window / Two Pointers cannot be used because XOR operations are not monotonic (adding a number to a subarray can either increase or decrease the XOR value unpredictably).

### Description

Step-by-step explanation:

1. Create a `HashMap` to store `&lt;PrefixXorValue, Frequency&gt;`.
2. Seed the map with `(0, 1)`. This handles the case where a valid subarray starts exactly at index 0. (Conceptually, the prefix XOR before the array begins is 0).
3. Initialize `currentXor = 0` and `count = 0`.
4. Iterate through the array. For each element:
   - Update `currentXor = currentXor ^ num`.
   - Calculate the required past prefix XOR: `targetXor = currentXor ^ k`.
   - If `targetXor` exists in the map, it means there are historical prefixes we can "chop off" to leave a remaining subarray with an XOR of exactly $k$. Add its frequency to `count`.
   - Update the map by incrementing the frequency of the `currentXor`.
5. Return the total `count`.

### The Intuition

This relies heavily on a fundamental property of the XOR operation:
If $A \oplus B = C$, then $A \oplus C = B$.

Let's define:
- $CurrentXor$ = the XOR of all elements from index $0$ to $i$.
- $SubarrayXor$ = the XOR of elements in our target subarray (which we want to be $k$).
- $PastXor$ = the XOR of the prefix we need to "remove" or "chop off" to get our subarray.

We know that:
$PastXor \oplus SubarrayXor = CurrentXor$

We want $SubarrayXor = k$. Substituting this:
$PastXor \oplus k = CurrentXor$

Using the XOR property to solve for $PastXor$:
$PastXor = CurrentXor \oplus k$

Therefore, as we stand at index $i$, if we can look back into our Hash Map and find *how many times* the value $(CurrentXor \oplus k)$ occurred in the past, that is exactly the number of valid subarrays ending at index $i$.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N^2)$       | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

We iterate through the array of size $N$ exactly once. Hash Map lookups and insertions are $O(1)$ on average, yielding $O(N)$ time. In the absolute worst case (extreme hash collisions), map operations degrade, leading to $O(N^2)$ time.

#### Space Complexity

In the worst case, every running prefix XOR is unique. The Hash Map will store $N$ distinct entries, resulting in $O(N)$ auxiliary space.

### Code

```java
class Solution {
    public int subarraysWithXorK(int[] nums, int k) {
        if (nums == null || nums.length == 0) return 0;

        Map&lt;Integer, Integer&gt; prefixXorFreq = new HashMap<>();
        // Base case: An XOR of 0 has been seen exactly once (conceptually before the array starts)
        prefixXorFreq.put(0, 1);

        int currentXor = 0;
        int count = 0;

        for (int num : nums) {
            currentXor ^= num;

            // Property of XOR: If A ^ B = C, then A ^ C = B
            // Let A = past prefix, B = subarray, C = current prefix
            // We want B = k. Therefore, past prefix A = C ^ k
            int targetXor = currentXor ^ k;
            
            count += prefixXorFreq.getOrDefault(targetXor, 0);

            // Add the current prefix XOR to our frequency map
            prefixXorFreq.put(currentXor, prefixXorFreq.getOrDefault(currentXor, 0) + 1);
        }

        return count;
    }
}
```

## Caveats

- **Sliding Window Trap:** XOR behaves wildly. `5 ^ 2 = 7`, but `7 ^ 1 = 6`. Because the value does not strictly increase or decrease, you cannot use a two-pointer sliding window to shrink/expand based on the current XOR value. Prefix Maps are mandatory.
- **Order of Operations:** You must evaluate `currentXor ^ k` and add to the `count` *before* inserting the `currentXor` into the map. If $k = 0$, inserting first will falsely count the empty subarray (an element XORed with itself is 0).

## Concepts to Think About

- **Isomorphic to Subarray Sum:** Notice how this algorithm is character-for-character identical to "Subarray Sum Equals K", simply replacing the `+` and `-` operators with `^`. Addition and XOR share group-theoretic properties (associativity, identity, inverse) that make prefix algorithms interchangeable between them.
- **Self-Inverse Property:** In prefix sum, to remove prefix $A$ from prefix $C$, you do $C - A$. Because XOR is its own inverse, to remove prefix $A$ from prefix $C$, you do $C \oplus A$.

## Logical Follow-up

Question: What if the problem asked for the *longest* subarray with XOR $k$?
Solution: Instead of storing `&lt;PrefixXor, Frequency&gt;`, we store `&lt;PrefixXor, Earliest_Index&gt;`. When we calculate `targetXor = currentXor ^ k`, we check if it exists in the map. If it does, the length of the subarray is `current_index - map.get(targetXor)`. We track the maximum length found. Time: $O(N)$, Space: $O(N)$.

Question: Can you solve this using a Trie?
Solution: Yes. While a HashMap is standard, you can insert the binary representation of the running XORs into a Trie. When searching for `currentXor ^ k`, you traverse the Trie. A Trie approach provides a strict $O(N \cdot 32)$ worst-case time complexity, bypassing the $O(N^2)$ hash collision worst-case of HashMaps, though it takes more memory and code to write.