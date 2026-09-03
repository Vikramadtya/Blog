---
tags:
  - hash-table
  - strings
  - arrays
---

# Isomorphic Strings

## Question

Given two strings $s$ and $t$, determine if they are isomorphic. Two strings are isomorphic if the characters in $s$ can be replaced to get $t$. All occurrences of a character must be replaced with another character while preserving the order. No two characters may map to the same character, but a character may map to itself.

## Solution

### Pattern

**Bijection (Two-Way Mapping) / Index Fingerprinting**
To ensure a valid 1-to-1 mapping between two datasets, track the structural "fingerprint" of both sets. If the characters at the current index in both strings were last seen at the exact same previous index, their structural patterns match perfectly.

### How to Identify

- The problem asks to verify a 1-to-1 mapping, structural match, or pattern adherence.
- Key phrases like "replaced while preserving order" or "no two characters may map to the same".
- Character sets are usually restricted (e.g., ASCII), allowing the use of $O(1)$ fixed-size arrays instead of heavy HashMaps.

### Description

Step-by-step explanation:

1. **Initial Guard:** If the lengths of $s$ and $t$ differ, they cannot be isomorphic.
2. **Setup Arrays:** Create two integer arrays, `mapS` and `mapT`, both of size 256 (to cover all extended ASCII characters). These arrays will store the *last seen index* of each character.
3. **Iterate Synchronously:** Loop through both strings simultaneously from $i = 0$ to $N - 1$.
4. **Compare Last Seen Indices:** For the current characters `sChar` and `tChar`, check their values in `mapS` and `mapT`.
   - If they are structurally isomorphic, they should have been last seen at the exact same index. 
   - If `mapS[sChar] != mapT[tChar]`, the pattern is broken. Return `false`.
5. **Update Indices:** Update both `mapS[sChar]` and `mapT[tChar]` to `i + 1`. (We use `i + 1` so that index 0 is not confused with the default array initialization value of 0).
6. **Completion:** If the loop finishes without mismatches, the strings are fully isomorphic. Return `true`.

### The Intuition

Think of this like reading two books in different languages, but the grammar structure is identical. You don't need a dictionary to translate every word. You just need to know: *"The word I am reading right now in Book A was last seen on Page 5. Is the corresponding word in Book B also last seen on Page 5?"*
If yes, the structural rhythm is identical. By logging the "last seen position" for every character as we iterate, we enforce a perfect 1-to-1 structural fingerprint without actually storing the explicit $A \rightarrow B$ translations.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(|\Sigma|)$  | $O(|\Sigma|)$    |

#### Time Complexity

We iterate through the strings of length $N$ exactly once. Array lookups and updates are strict $O(1)$ operations. The time complexity is exactly $O(N)$.

#### Space Complexity

The space complexity is $O(|\Sigma|)$, where $|\Sigma|$ is the size of the character set. For ASCII strings, this is strictly $O(1)$ because the arrays are always bounded at 256 integers, regardless of how large $N$ becomes. 

### Code

```java
class Solution {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;

        int[] mapS = new int[256];
        int[] mapT = new int[256];

        for (int i = 0; i &lt; s.length(); i++) {
            char sChar = s.charAt(i);
            char tChar = t.charAt(i);

            // If the structural fingerprint diverges, they are not isomorphic
            if (mapS[sChar] != mapT[tChar]) {
                return false;
            }

            // Record the position (1-indexed to avoid conflict with default 0)
            mapS[sChar] = i + 1;
            mapT[tChar] = i + 1;
        }

        return true;
    }
}
```

## Caveats

- **Unicode Constraints:** The `int[256]` optimization only works if the string characters fall within the ASCII range. If the input allows arbitrary Unicode characters (e.g., emojis, Chinese characters), the array would be too large to allocate efficiently. In that case, falling back to `HashMap&lt;Character, Character&gt;` (like your original solution) or `HashMap&lt;Character, Integer&gt;` is mandatory.
- **The Zero-Index Trap:** A common bug when using arrays to track indices is assigning `map[c] = i`. When $i = 0$, `map[c]` becomes 0. But 0 is also the default uninitialized value of the array. Thus, the program cannot differentiate between "seen at index 0" and "never seen before". Always offset the stored index by $+1$ (e.g., `map[c] = i + 1`).

## Concepts to Think About

- **Bijection (1-to-1 Correspondence):** A mapping where every element of Set A maps to exactly one element of Set B, and no two elements in A map to the same element in B. This is why a simple 1-way mapping array fails (e.g., "ab" -&gt; "cc" would map 'a' to 'c' and 'b' to 'c', passing a 1-way check but failing a bijection).
- **Primitive vs Object Overhead:** In Java, converting a primitive `char` to an object `Character` to store it in a generic Collection creates heap allocations and GC overhead. Leveraging arrays for ASCII keys is a fundamental systems optimization.

## Logical Follow-up

Question: How would you solve LeetCode 290: Word Pattern, where you are given a string pattern like `"abba"` and a string of words like `"dog cat cat dog"`?
Solution: The exact same core algorithm applies, but because words are strings of arbitrary length rather than ASCII characters, we cannot use a size-256 array. We must use two HashMaps: `HashMap&lt;Character, Integer&gt;` for the pattern and `HashMap&lt;String, Integer&gt;` for the words. We split the string by spaces, ensure lengths match, and verify that the `put` operations (or `last seen indices`) match for both the character and the word at each step.