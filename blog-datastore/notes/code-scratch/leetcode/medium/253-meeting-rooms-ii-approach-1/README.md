# 253. Meeting Rooms II

## Intitution

To find the **minimum number of conference rooms** required, we need to **track how many meetings are happening simultaneously**. A good way to do this is by **sweeping through the timeline** of all meeting start and end times:

* Each time a meeting starts, a room is needed.
* Each time a meeting ends, a room is freed.

By tracking the net changes in active meetings at every time point, we can figure out the **peak number of overlapping meetings**, which is our answer.

## Complexity

| Space Complexity | Time Complexity         |
| ---------------- | ----------------------- |
| $$\text{O}(N)$$  | $$\text{O}(N*\log{N})$$ |

## Code

```java
public int minMeetingRooms(int[][] intervals) {
    // TreeMap to hold time -> net change in rooms (+1 for start, -1 for end)
    TreeMap&lt;Integer, Integer&gt; timeToRoomChange = new TreeMap<>();

    for (int[] meeting : intervals) {
        int startTime = meeting[0];
        int endTime = meeting[1];

        // Increment room count at start time
        timeToRoomChange.put(startTime, timeToRoomChange.getOrDefault(startTime, 0) + 1);

        // Decrement room count at end time
        timeToRoomChange.put(endTime, timeToRoomChange.getOrDefault(endTime, 0) - 1);
    }

    int ongoingMeetings = 0;
    int maxConcurrentMeetings = 0;

    // Sweep through the time points in order
    for (int time : timeToRoomChange.keySet()) {
        ongoingMeetings += timeToRoomChange.get(time);
        maxConcurrentMeetings = Math.max(maxConcurrentMeetings, ongoingMeetings);
    }

    return maxConcurrentMeetings;
}

```

