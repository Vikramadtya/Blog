---
description: only for case where majority has more than n/2  occurrences
---

# Finding the majority element

The Boyer-Moore voting method determines the majority element i.e with more than $$N/2$$ occurrences  among other elements.

!!! info
    If there is no majority, the algorithm will not recognise this and will continue to output one of the items. To avoid this we can add a check



## Algorithm

First pass identifies an element as a majority

```java
// we count the votes 
// number of votes will be > 0 only for the majority element
int candidate = -1, votes = 0; 
for (int i = 0; i &lt; nums.length; ++i) { 
	// if votes is 0 then replace the candiate
	if(votes == 0) { 
		candidate = nums[i];
	} 
	
	// if the element is different consider it as vote againts 	
	votes+= (candidate == nums[i]) ? +1 : -1;
} 
```

Second pass confirms that the element identified in the first pass is indeed a majority

```java
int count = 0;
for (int i = 0; i &lt; nums.length; ++i) { 
	if(candidate == nums[i]) count++;
}

if(count < (nums.length &gt;&gt; 1) ) return -1;

return candidate; 
```



## Complexity

* Time Complexity : $$\text{O}(n)$$
  * Only 2 iteration are made over the array
* Space Complexity : $$\text{O}(1)$$
  * No extra space is needed

## Reference

* [Boyer-Moore majority vote algorithm](https://www.topcoder.com/thrive/articles/boyer-moore-majority-vote-algorithm)
