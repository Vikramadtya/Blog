---
tags:
  - strings
  - two-pointers
---

# Reverse Words in a String

## Question

Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. Return a string of the words in reverse order concatenated by a single space. Do not include any leading, trailing, or multiple spaces between words.

## Solution

### Pattern

**Two-Pointer Backward Traversal**
Instead of using memory-heavy string splitting functions, traverse the string from right to left using a two-pointer technique. Identify word boundaries, extract the word, and append it directly to a `StringBuilder`.

### How to Identify

- The problem asks to process "words" or tokens in reverse order.
- The string contains irregular spacing that needs to be normalized (stripped).
- You want to avoid the heavy memory footprint of creating an array of substrings (which `split()` does).

### Description

Step-by-step explanation:

1. Create a `StringBuilder` to hold the final result.
2. Initialize a pointer `i` to point to the last character of the string (`s.length() - 1`).
3. Loop backwards while `i >= 0`:
   - Skip any spaces: `while (i >= 0 && s.charAt(i) == ' ') i--;`. If `i` drops below 0, the string is fully parsed; break the loop.
   - Set pointer `j = i`. This marks the end index of a valid word.
   - Move `i` left to find the start of the word: `while (i >= 0 && s.charAt(i) != ' ') i--;`.
   - Now, `i + 1` is the starting index of the word, and `j` is the ending index.
   - If the `StringBuilder` is not empty, append a single space `" "` to separate words.
   - Append the substring between `i + 1` and `j + 1` to the `StringBuilder`.
4. Return the finalized `StringBuilder` as a string.

### The Intuition

Think of reading a sentence from right to left with a magnifying glass. 
You scan leftward until you find a letter. You put a marker there (the end of the word). 
You keep scanning leftward until you hit a space. You put a marker there (the beginning of the word).
You now have the exact start and end coordinates of the word. You copy it, paste it onto a new page, add one space, and continue scanning leftward. This cleanly ignores irregular spaces and grabs words in exactly the reverse order without creating intermediate garbage arrays.

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | $O(N)$         | $O(N)$           |
| Space Complexity | $O(N)$         | $O(N)$           |

#### Time Complexity

We iterate over each character in the string exactly once from right to left. Appending to the `StringBuilder` takes time proportional to the length of the word being appended. Overall, this is strictly $O(N)$ time.

#### Space Complexity

In Java, Strings are immutable. A strictly $O(1)$ solution is impossible. We must allocate $O(N)$ space for the `StringBuilder`'s underlying character array to construct the final reversed string.

### Code

```java
class Solution {
    public String reverseWords(String s) {
        StringBuilder sb = new StringBuilder();
        int i = s.length() - 1;
        
        while (i >= 0) {
            // 1. Skip spaces
            while (i >= 0 && s.charAt(i) == ' ') {
                i--;
            }
            
            if (i &lt; 0) break; 
            
            // 2. Mark end of word
            int j = i;
            
            // 3. Find start of word
            while (i &gt;= 0 && s.charAt(i) != ' ') {
                i--;
            }
            
            // 4. Manage spacing between words
            if (sb.length() > 0) {
                sb.append(' ');
            }
            
            // 5. Fast append using coordinates (avoids creating substring objects)
            sb.append(s, i + 1, j + 1);
        }
        
        return sb.toString();
    }
}
```

## Caveats

- **Immutability Constraint:** A true $O(1)$ space complexity solution is impossible in Java, Python, or C# because strings are immutable. You must allocate memory for the result. Claiming $O(1)$ space in these languages indicates a lack of understanding of memory allocation.
- **Built-in Methods (`split`):** Using `s.trim().split("\\s+")` followed by a reverse loop is a valid 3-line production-level shortcut. However, interviewers often ban `split()` because it hides algorithmic complexity and allocates an unnecessary $O(N)$ `String[]` array, causing heavy garbage collection overhead.
- **`sb.append(CharSequence s, int start, int end)`:** This is a highly optimized Java method. Instead of calling `s.substring(start, end)`, which creates a brand new `String` object on the heap every time, this method copies characters directly from the source string's backing array into the `StringBuilder`'s backing array.

## Concepts to Think About

- **The C++ Advantage (In-Place Reversal):** If you are coding in C/C++, strings are mutable character arrays. You can solve this problem in strictly $O(1)$ space using the "Reverse Whole, Reverse Parts" algorithm (which your original Java logic somewhat mimicked). You reverse the entire string, then reverse each individual word in place, and finally shift characters leftward to overwrite multiple spaces.

## Logical Follow-up

**Question:** If you were using a language with mutable strings (like C++), how would you solve this in strictly $O(1)$ auxiliary space?

**Solution:**

1. Reverse the entire string character by character (using a two-pointer swap). This puts the words in the right order but spells them backwards.
2. Iterate through the string. When you identify the boundaries of a word, do a localized two-pointer swap to reverse the characters of just that word, fixing the spelling.
3. Use a fast/slow two-pointer approach to shift characters leftward, overwriting multiple spaces and keeping only single spaces, then truncate the string to the slow pointer's length.