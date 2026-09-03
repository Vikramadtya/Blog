# Reversing an Array

Just push each item onto the stack and then pop it back off.  Because of the stack's LIFO nature, the items come back out in reverse order.

```java
int[] reverserArray(int[] arr) {
    Stack&lt;Integer&gt; stack = new Stack<>();
    
    for(int i = 0; i < arr.length; ++i) {
        stack.push(arr[i]);    
    }
    
    for(int i = 0; !stack.isEmpty(); ++i) {
        arr[i] = stack.pop();
    }
    
    return arr;
}
```

**Runtime :** we do two iteration over the array$$\text{O}(n)$$

