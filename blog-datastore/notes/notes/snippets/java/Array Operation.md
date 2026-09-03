# Arrays

## Splice

To create the sub-array

- `startInclusive` – the start index to extract from the array inclusive
- `endExclusive` – the end index to extract exclusive

```java
String[] result = Arrays.stream(&lt;array&gt;, &lt;startInclusiveIndex&gt;, &lt;endExclusiveIndex&gt;).toArray(String[]::new);
```
