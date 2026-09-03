# Binary Search

## Arrays

```java
public static T binarySearch(T[] a,int fromIndex,int toIndex,T key)
```

Searches a range of the specified array for the specified value it return
index of the search key, if it is contained in the array within the specified range. 
Otherwise, , where the insertion point is defined as the point at which the key would be inserted into the array.

### Example

to search for the index of target in a sorted array nums using binary search.

```java
int index = Arrays.binarySearch(nums,target);
to interpret the result
if (index >= 0) {
    // target found at index
} else {
    int insertionPoint = -index - 1;
    // target not found, but would go at insertionPoint to keep array sorted
}
```
