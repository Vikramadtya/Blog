# Java Utility Method

## Collections
Java provides the Collections utility class for common operations.

```
Collections.sort(list);
Collections.reverse(list);
Collections.max(list);
Collections.min(list);
Collections.frequency(list, value);
```

## Arrays
For arrays, use Arrays:

```
Arrays.sort(arr);
Arrays.binarySearch(arr, target);
Arrays.fill(dp, -1);
```

For immutable or fixed-size collections:
- `Arrays.asList()` returns a fixed-size list backed by the array.
- `List.of()` returns an unmodifiable list.

```
List<Integer> fixed = Arrays.asList(1, 2, 3);
List<Integer> immutable = List.of(1, 2, 3);
```

## StringBuilder	
Efficient string construction

```java
StringBuilder sb = new StringBuilder();
sb.append("hello");
sb.reverse();
```