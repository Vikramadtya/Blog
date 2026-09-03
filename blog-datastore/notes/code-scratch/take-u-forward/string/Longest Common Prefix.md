---
tags:
  - strings
  - arrays
---

# Longest Common Prefix

## Question

Write a function to find the longest common prefix string amongst an array of strings `strs`. If there is no common prefix, return an empty string `""`.

## Solution

### Pattern

**Horizontal Scanning**
Assume the first string is the common prefix. Iterate through the rest of the array. Iteratively shorten the assumed prefix from the end until it matches the beginning of the current string. 



### How to Identify

- The problem asks for a commonality across an entire collection of strings.
- A prefix by definition must start at index 0, meaning we can use efficient string matching methods like `startsWith` or `indexOf(prefix) == 0`.
- The common prefix can only shrink, never grow, as we evaluate more strings.

### Description

Step-by-step explanation:

1. **Guard Clause:** If the input array is null or empty, return `""`.
2. **Initial Assumption:** Set `prefix = strs[0]`. The longest possible common prefix cannot be longer than the first string.
3. **Iterate:** Loop through the array starting from `i = 1`.
4. **Evaluate and Shrink:** For each string `strs[i]`, check if it begins with the current `prefix`.
   - In Java, use `!strs[i].startsWith(prefix)`.
   - While this is true (it does *not* start with the prefix), chop the last character off the prefix: `prefix = prefix.substring(0, prefix.length() - 1)`.
5. **Early Exit:** If at any point the `prefix` becomes empty (`""`), return `""` immediately. There is no common prefix, so there's no need to check the remaining strings in the array.
6. **Return:** Once the loop finishes evaluating all strings, whatever remains in `prefix` is the longest common prefix.

### The Intuition

Imagine finding the longest common trait among a group of people. 
You look at the first person and assume their traits are the baseline: "Tall, Dark Hair, Brown Eyes."
You look at the second person. They are "Tall, Dark Hair, Blue Eyes." You throw away "Brown Eyes" from your baseline. Your new baseline is "Tall, Dark Hair."
You look at the third person. They are "Tall, Blonde Hair, Blue Eyes." You throw away "Dark Hair." Your baseline is now just "Tall."
By starting with a massive assumption and rapidly whittling it down when it fails to match subsequent items, you efficiently zero in on the exact common denominator.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N \cdot M)$ | $O(N \cdot M)$   |
| Space Complexity | $O(1)$         | $O(1)$           |

#### Time Complexity

Let $N$ be the number of strings and $M$ be the length of the strings. In the worst case (all strings are identical), we evaluate $M$ characters for each of the $N$ strings. The time complexity is $O(S)$, where $S$ is the sum of all characters in all strings, equivalent to $O(N \cdot M)$.

#### Space Complexity

We only maintain a `prefix` string pointer. In Java, `substring` allocates a new string, but auxiliary structural space remains $O(1)$. 

### Code

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";
        
        String prefix = strs[0];
        
        for (int i = 1; i < strs.length; i++) {
            // While strs[i] does not start with the current prefix
            while (!strs[i].startsWith(prefix)) {
                // Shorten the prefix by 1 from the end
                prefix = prefix.substring(0, prefix.length() - 1);
                
                // Fast-fail: no common prefix exists
                if (prefix.isEmpty()) return "";
            }
        }
        
        return prefix;
    }
}
```

!!! info "Approach 2"
    Sorting. Sort the array of strings lexicographically. The longest common prefix of the entire array is guaranteed to be the longest common prefix of just the first string and the last string in the sorted array.

## Caveats

- **Vertical Scanning vs Horizontal Scanning:** Vertical scanning (checking index 0 of all strings, then index 1 of all strings) is technically better if the array contains a massive number of very long strings, but one string at the very end is just `"a"`. Horizontal scanning evaluates massive strings unnecessarily before hitting `"a"`. However, for standard inputs, horizontal scanning is vastly easier to write cleanly.
- **`indexOf` vs `startsWith`:** Some older Java templates use `while (strs[i].indexOf(prefix) != 0)`. While correct, `startsWith(prefix)` is far more semantically readable and communicates explicit intent.

## Concepts to Think About

- **Trie (Prefix Tree):** For a single array, a Trie is overkill. But if you were building a system where a massive dataset of strings is queried repeatedly for common prefixes (like autocomplete), inserting all strings into a Trie and returning the path up to the first branching node is the optimal system design approach.
- **Divide and Conquer:** You can split the array in half, find the common prefix of the left half, the common prefix of the right half, and then find the common prefix of those two results. This is $O(N \cdot M)$ time and $O(M \cdot \log N)$ space (due to the recursion stack).

## Logical Follow-up

Question: Is there an approach that requires fewer manual string comparisons?
Solution: **Sorting.** If you sort the array of strings lexicographically, you only need to compare the *first* string and the *last* string in the sorted array. By definition of lexicographical sorting, the longest common prefix of the first and last strings is guaranteed to be a common prefix for all strings in between them. Time complexity: $O(N \log N \cdot M)$ for sorting, plus $O(M)$ for the final comparison. It's theoretically slower but practically very fast and extremely concise to write.