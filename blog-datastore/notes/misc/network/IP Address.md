# IP Address

The IP address is the ID, the identifier of each host – client or server device on the network.

An IPv4 address is a 32-bit address that identifies a device on a network. It is made of 4 groups of numbers (octets) with up to 3 numbers each. The IPv4 will identify the network and the individual host on the network. 



find the website’s IP address

```
nslookup domainname.com
```

the result will be IPv4 address (from the A DNS record) and IPv6 address (from the AAAA DNS record).


## IPv4 classification
We can distinguish five classes of IPv4 addresses: A, B, C, D, and E. Each of them has its own set of IP addresses. Let’s take a look at them.
- Class A – The first bit, which is 0, spans the values 0.0.0.0 to 127.255.255.255. This class, which has 8 bits for the network and 24 bits for hosts, is designed for large networks.
- Class B – It is intended for medium-sized to big networks. The first two bits, which are 10s, fall between 128.0.0.0 and 191.255.255.255. It also contains 16 bits for hosts and 16 bits for the network.
- Class C – We use it for the small local area networks (LANs). The network in this class is indented using three octets. And the IP address has a range of 192.0.0.0 to 223.255.255.255, 24 network bits, and 8 host bits.
- Class D – Only programs that require multicasting use it. That means we don’t use Class D for standard networking functions. Instead, it first three bits are set to “1,” and the fourth bit is used for “0”. Furthermore, 32-bit network addresses make up Class D addresses.
- Class E – We use it for experimental or study-related reasons. This class of IP addresses covers the first octet values 240.0.0.0 to 255.255.255.255. An E class IP address’s first four bits are one in binary format.


## Reference 
- [IP Address (Internet Protocol Address)](https://www.kentik.com/kentipedia/ip-address/)
- [What is IPv4? Everything you need to know](https://www.cloudns.net/blog/what-is-ipv4-everything-you-need-to-know/)