---
tags:
  - cc
  - bit-manipulation
  - arrays
---

# Single Number

## Question

Given a non-empty array of integers `nums`, every element appears exactly twice except for one unique element. Find and return that single element. The algorithm must achieve linear time complexity and use only constant auxiliary space.

## Solution

### Pattern

**Bitwise XOR Bit-Annihilation**
By exploiting the bitwise Exclusive-OR (XOR) properties, duplicates running within an accumulation stream cancel each other out completely, leaving behind only the unique non-paired bits.

### How to Identify

- The collection features elements paired in exact duplicates (or even frequencies).
- Exactly one item is missing its matching twin or pair.
- Auxiliary space constraints are strictly limited to O(1), making HashSets or frequency maps illegal.

### Description

Step-by-step explanation:

- Step 1: Initialize an integer accumulator variable `xorSum` to 0.
- Step 2: Iterate sequentially through every integer `num` inside the array using a linear scan loop.
- Step 3: Apply the bitwise XOR assignment operator (`xorSum ^= num`) at each iteration step.
- Step 4: Due to the commutative and associative nature of bitwise logic gates, matching duplicate values will eventually resolve to 0 when paired against each other, regardless of their position in the array.
- Step 5: Once the loop exits, return the value inside `xorSum`. It will contain the exact value of the lone unique element.

### The Intuition

Think of this strategy as a binary version of a self-clearing inventory list. 

The XOR operator asks a single question at the bit level: "Are these two bits different?" 
- If you XOR a number with 0, the result is the number itself (0 acts as an identity element).
- If you XOR a number with itself, the two identical bit patterns clash and wipe each other out completely, dropping down to a clean 0.

Because the order of operations does not matter, you can imagine sorting all identical numbers together instantly. Every duplicate pair forms a mini-annihilation loop turning into 0. Ultimately, the entire array condenses into: `0 ^ 0 ^ ... ^ UniqueNumber`, which evaluates directly to the unique number.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | O(n)           | O(n)             |
| Space Complexity | O(1)           | O(1)             |

#### Time Complexity
O(n). The array is traversed exactly once. Bitwise logic gates execute natively within single-cycle CPU instructions, making the real-world execution incredibly fast.

#### Space Complexity
O(1). No secondary tables, dynamic sets, or recursive stack frames are generated. Memory footprint remains entirely flat.

### Code

```java
class Solution {
    /**
     * Finds the single unique element using bitwise XOR reduction.
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     */
    public int singleNumber(int[] nums) {
        int xorSum = 0; // Seeding with 0 as the bitwise identity element
        
        for (int num : nums) {
            xorSum ^= num; // Blasting matching pairs out of the system
        }
        
        return xorSum;
    }
}
```

## Caveats

- Even-frequency Rules: This pattern relies on duplicates appearing an *even* number of times. If a duplicate occurs 3 times and the unique number occurs 1 time, the cancellation logic fails.
- Empty Arrays: If the input array could be empty, initializing with 0 would return 0, which might mistakenly imply that 0 was the unique element present.

## Concepts to Think About

- Truth Table Properties: Understanding how bitwise gates filter input streams directly at the registry hardware level.
- Commutativity (A ^ B = B ^ A) and Associativity (A ^ (B ^ C) = (A ^ B) ^ C): These algebraic properties explain why the array layout sequence does not impact the output variable.
- Hash-Map Memory Tradeoffs: A tracking set can isolate the value without bitwise tricks but introduces an unoptimized O(n) storage allocation penalty.
- Array Mutability: This algorithm operates strictly as a read-only sequence scan, ensuring complete thread safety across safe shared memory models.

## Logical Follow-up

Question: What if every element appears **three** times except for one unique element which appears exactly once? (Single Number II)

Solution: You cannot use simple XOR because three identical values XORed together results in the value itself, bypassing cancellation. Instead, maintain a bit-count array of size 32. For every number, iterate through its 32 bits and accumulate the counts. Finally, mod each bit position's sum by 3. The remaining bits form the binary representation of the unique target number.

Question: What if **two** distinct elements appear exactly once each, while all other elements appear twice? (Single Number III)

Solution: Running a global XOR pass down the array will yield a composite value equal to `X ^ Y` (where X and Y are the two unique values). Find the rightmost set bit in this compound value. This bit represents a location where X and Y differ. Run a second linear loop, partitioning all elements into two isolated groups based on whether that specific bit is set or clear. XORing each group independently will isolate X in one pool and Y in the other.