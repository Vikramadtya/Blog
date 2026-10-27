# Database Scaling

There are several techniques to scale databases to meet high read/write loads.

## Vertical Scaling

Increasing resources at a single database server like CPU, memory and storage can provide temporary relief for increased loads. vertical scaling keeps your database stack simple.

> There is a physical ceiling to how large a single server can scale and a monolithic database remains a single point of failure.

## Replication

Replication provides redundancy and improves performance by copying data across multiple database instances. A write to the leader node is replicated to read replicas. Reads can be served from the replicas, reducing load on the master. Also, replication copies data across redundant servers, eliminating the single point of failure risk.

## Sharding

Sharding partitions your database across multiple smaller servers, allowing you to add more nodes fluidly as needed.

Sharding or partitioning involves splitting your database into multiple smaller databases by a certain criteria like customer ID or geographic region. This allows you to scale horizontally by adding more database servers.


## Reference

- [Scaling Software Systems: 10 Key Factors](https://www.codereliant.io/p/scaling-software-systems-10-key-factors)
