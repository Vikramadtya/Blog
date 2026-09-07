Template to analyse the solution 

Assume you are a senior google interviewer evaluating a candidate’s solution.

Your job is to:

1. Critically evaluate the solution like a real interview
2. Suggest improvements and alternatives
3. Then generate high-quality structured notes

Be precise, honest, and technical. Avoid generic praise.

First analyse my submission & complexity , tell me where i can improve. If there is a better approach explain that. Then after analysis generate structured notes for the given problem using EXACTLY the format below. Maintain clarity, depth, and interview-level insights. Avoid fluff.

---

### INPUT

Problem Link :

https://leetcode.com/problems/valid-parentheses/?envType=company&envId=linkedin&favoriteSlug=linkedin-all

Problem Statement:

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.
Every close bracket has a corresponding open bracket of the same type.

 


Candidate Solution:

```java
class Solution {
    public boolean isValid(String s) {
        if( s == null || s.isEmpty() ) return true;

        // if length is odd its not valid
        if(s.length()%2 != 0) return false;

        Stack<Character> stk = new Stack<>();

        for(char c : s.toCharArray()) {
            if(c == '(' || c == '{' || c == '[') {
                stk.push(c);
            } else if(c == ')') {
                if(stk.isEmpty()) return false;
                if(stk.peek() != '(') return false;
                stk.pop();
            } else if(c == '}') {
                if(stk.isEmpty()) return false;
                if(stk.peek() != '{') return false;
                stk.pop();
            } else if(c == ']') {
                if(stk.isEmpty()) return false;
                if(stk.peek() != '[') return false;
                stk.pop();
            }
        }


        return stk.isEmpty();
    }
}
```

Claimed Complexity:

Space Complexity : O(n)
Time Complexity : O(n)

---

## PHASE 1: INTERVIEW ANALYSIS

Evaluate the solution on:

### 1. Correctness

- Is the solution correct for all cases?
- Any edge cases missed?

### 2. Optimality

- Is this the best possible approach?
- If not, what is better?

### 3. Code Quality

- Readability
- Naming
- Structure
- Any unnecessary work?

### 4. Complexity Review

- Verify time and space complexity
- Correct if wrong
- Explain reasoning clearly

### 5. Improvements

- How would you improve THIS solution?
- Then suggest a better approach (if exists)

### 6. Interview Verdict

- Would this pass a Google interview? Why or why not?

---

## PHASE 2: REFINED SOLUTION

If a better or cleaner approach exists:

- Present the optimal approach
- Explain WHY it is better

---

## PHASE 3: STRUCTURED NOTES

Generate notes in EXACT format:

### OUTPUT FORMAT (STRICT)

A code block with notes in markdown format as shown below

````md

---
tags:
  - cc
---

# Title

## Question

{Rewrite the problem clearly and concisely. Use math notation if needed.}

## Solution

### Pattern

**{Primary pattern}**
Short explanation
Explain in 1–2 lines.

### How to Identify

Give 3–5 bullet points explaining how to recognize this pattern in interviews.

- Key signals
- When to use

### Description

Explain the approach step-by-step but in reader friendly way so that a person with no idea can read it and understand

Step-by-step explanation:

- Mention constraints or invariants
- Explain decision choices
- Keep it structured and logical
- Flow

### The Intuition

Give a strong mental model or analogy or Deep reasoning::

- Solution choice reasoning
- Why this works
- Mental model

### Complexity

| Label            | Worst          | Average          |
| :--------------- | :------------- | :--------------- |
| Time Complexity  | ${Worst Case}$ | ${Average Case}$ |
| Space Complexity | ${Worst Case}$ | ${Average Case}$ |

#### Time Complexity

Explain clearly, not just Big-O

#### Space Complexity

Include recursion stack if applicable

### Code

Provide clean, optimal code:

- Prefer Java (default) unless specified
- Use best practices (no brute force unless necessary)
- Add short comments where useful

```java
{code_here}
```

## Caveats

Situation where this approch might not work or alternatve way would be better

- Limitations
- When not to use

## Concepts to Think About

Provide 5–8 deeper insights:

- Related formulas
- Variations or extensions
- Tradeoffs
- Common mistakes
- Performance considerations
- Patterns
- Variations
- Tradeoffs
- Mistakes

## Logical Follow-up

Give me all logical follow ups for top-tier technical interviews (Google, Meta, Uber etc.).

Question: {Follow-up question}
Solution: {Answer with explaination}

````

RULES

- do put tags
- Do not miss any section follow the output format strictly and consider the points listed under each strictly
- The Intuition section is very important clearly highlight how to buidl it do discover problems where a similar approach can be used
- Focus on intuition + pattern recognition
- Ensure formatting matches EXACTLY
- Keep explanations crisp but insightful (Google-level clarity)
- Use LaTeX for formulas where helpful
- Make it feel like elite interview notes
- Add visualtisation where needed
- Be honest and critical in analysis
- Avoid generic explanations
- Focus on intuition and decision-making
- Keep notes structured and clean
- Prioritize interview usefulness over completeness

