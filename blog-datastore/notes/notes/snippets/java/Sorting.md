# Sorting

## Arrays

To sort an array use

```java
Arrays.sort(arr); // Sorts the array in ascending order
```

To sort an array in descending order 

```java
Arrays.sort(arr,Collections.reverseOrder());
```

this only works for non-primitive array i.e Integer [] array not int [] array

If we want to sort array from some index to some index use

```java
Arrays.sort(arr,fromIndex,toIndex);
```

If its a multi-dimensional array

```java
Arrays.sort(arr, (a, b) -> Integer.compare(a[column],b[column]));
```

to sort an array with custom comparator 

```java
CustomComparator implements Comparator&lt;T&gt; {
    public int compare(T c1, T c2)
     {
         // return -1, 0, +1
     }
}
```

## List

To sort a list use

```
Collections.sort(list);
```