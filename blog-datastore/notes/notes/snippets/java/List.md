# List


## Reverse List

The most common and efficient way to reverse a list in Java is using the `Collections.reverse()`

```java
import java.util.*;

List&lt;String&gt; list = new ArrayList<>(Arrays.asList("A", "B", "C"));
Collections.reverse(list); // list is now ["C", "B", "A"]
```

!!! note "Java 21+"
    Introduced in Java 21 as part of the Sequenced Collections API, this method returns a reversed view of the original list.

    ```java
    List&lt;String&gt; list = new ArrayList<>(Arrays.asList("1", "2", "3"));
    List&lt;String&gt; reversedView = list.reversed(); // ["3", "2", "1"]
    ```


## Add element at index

Can add element at index using

```java
// add element to the front
list.add(0,nums[i]);
```
