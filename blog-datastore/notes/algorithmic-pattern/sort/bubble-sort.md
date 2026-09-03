# Bubble Sort

The sorting algorithm works on the principle of moving the largest element to the end of the array just like a bubble moves up.

We do multiple pass over the array till its sorted, during each pass we compare the adjacent elements ( i.e `i` and `i+1`) and swap if the first is greater than the second. So at the end of the pass the largest element is at the top.

```java
// we will need n passess
for ( int i = n-1 ; i >= 0; i-- ) {
    for ( int j = 0; j+1 &lt;= i; j++ ) {
        // swap if the current element 
        // is larger than the next
        if ( arr[j] < arr[j+1] ) {
            swap(arr,i,j);
        }
    }
}
```

After each pass, the last part of the array will become sorted. That is why the last index of the range decreases by 1 after each pass.&#x20;

This decrement is achieved by the outer loop and the last index is represented by variable `i` in the above code.&#x20;

The inner loop by `j` helps to push the maximum element of range `[0….i]` to the last index (i.e. `i`)\


\
If the array becomes sorted before all passes, to avoid unnecessary work we can have a small check to see if the array is already sorted

```java
boolean isSorted = true;

// we will need n passess
for ( int i = n-1 ; i &gt;= 0; i-- ) {
    for ( int j = 0; j+1 <= i; j++ ) {
        // swap if the current element 
        // is larger than the next
        if ( arr[j] < arr[j+1] ) {
            swap(arr,i,j);
            isSorted = false;
        }
    }
    
    // if no swap took place the array is sorted 
    // break to avoid unneeded iteration 
    if(isSorted) break;
}
```

If the array is already sorted no swap will occur and we will break out from the loops.





!!! info
    The best case occurs if the given array is already sorted due to the chaeck we find this in single iteration thus leading to best case complexity of $$\text{O}(n)$$





