# The OSI Reference Model: A Comprehensive Guide

![images](/notes-assets/osi%20summary.jpg)

The **Open Systems Interconnection (OSI)** model was developed by the International Organization for Standardization (ISO) in 1984. It serves as a conceptual framework to understand how different networking protocols interact and communicate. While the modern internet primarily runs on the **TCP/IP model**, the OSI model remains the gold standard for troubleshooting and educational purposes.

---

## 1. The Seven Layers of OSI

The model is organized into seven distinct layers, often divided into "Upper Layers" (Host-focused) and "Lower Layers" (Network-focused).



### Layer 7: Application
The Application layer is the closest to the end-user. It provides network services directly to software applications.

* **Function:** Service advertisement and resource sharing.
* **Note:** It is NOT the application itself (like Chrome or Outlook), but the protocol the application uses to communicate.
* **Protocols:** HTTP/HTTPS, FTP, SMTP, DNS, SSH, DHCP.

### Layer 6: Presentation
This layer acts as the "translator" for the network. 

* **Function:** Data representation, character code translation (ASCII to EBCDIC), **encryption/decryption** (SSL/TLS), and data compression.
* **Standard:** It ensures that data sent by the application layer of one system can be read by the application layer of another.

### Layer 5: Session
The Session layer manages the "dialogue" between computers.

* **Function:** Establishing, managing, maintaining, and gracefully terminating connections (sessions). It provides checkpointing and recovery.
* **Example:** NetBIOS, RPC (Remote Procedure Call).

### Layer 4: Transport
This layer handles the end-to-end delivery of data.

* **Function:** Segmentation (breaking data into smaller chunks), error correction, and flow control. 
* **TCP (Transmission Control Protocol):** Connection-oriented; ensures reliable, sequenced delivery through "Three-Way Handshakes."
* **UDP (User Datagram Protocol):** Connectionless; "best-effort" delivery, faster but unreliable.
* **Key Concept:** Port numbers (Source/Destination) live here.

### Layer 3: Network
The Network layer manages logical addressing and routing.

* **Function:** Path selection and forwarding. It determines the best physical path for the data to reach its destination.
* **Hardware:** Routers, Layer 3 Switches.
* **Addressing:** IP Addressing (IPv4, IPv6).
* **Protocols:** IP, ICMP, ARP.

### Layer 2: Data Link
The Data Link layer provides node-to-node data transfer and handles physical addressing.

* **Function:** Framing, error detection (CRC), and MAC addressing.
* **Sublayers:** 1. **LLC (Logical Link Control):** Identifies network layer protocols.
    2. **MAC (Media Access Control):** Manages hardware addresses and media access.
* **Hardware:** Switches, Bridges, NICs.

### Layer 1: Physical
The Physical layer deals with the actual hardware and transmission of raw bitstreams.

* **Function:** Defining electrical, mechanical, and physical specifications (cables, connectors, voltage levels, radio frequencies).
* **Hardware:** Hubs, Repeaters, Fiber Optics, RJ45 cables.

---

## 2. Protocol Data Units (PDU) & Hardware Mapping

Understanding what data is called at each layer is vital for technical troubleshooting.

| Layer #     | Layer Name    | PDU Name                               | Typical Hardware  |
| :---------- | :------------ | :------------------------------------- | :---------------- |
| **7, 6, 5** | App/Pres/Sess | **Data**                               | Firewall, Gateway |
| **4**       | Transport     | **Segment** (TCP) / **Datagram** (UDP) | L4 Firewalls      |
| **3**       | Network       | **Packet**                             | Router            |
| **2**       | Data Link     | **Frame**                              | Switch, Bridge    |
| **1**       | Physical      | **Bits**                               | Hub, Cable, NIC   |

---

## 3. Data Flow: Encapsulation & De-encapsulation



### Encapsulation (Top to Bottom)
As data moves from Layer 7 down to Layer 1, each layer adds its own **header** (and sometimes a trailer) to the data. This process is like placing a letter inside an envelope, then inside a shipping box, then inside a shipping container.

### De-encapsulation (Bottom to Top)
When the destination receives the bits, it works its way up. Each layer strips off its corresponding header, checks for errors or addressing, and passes the remaining data up to the next layer.

---

## 4. Modern Standard: OSI vs. TCP/IP
In the real world, the **TCP/IP model** (or Department of Defense model) is what we actually use. It condenses the OSI model into four layers:

1.  **Application:** (Combines OSI 5, 6, and 7)
2.  **Transport:** (OSI 4)
3.  **Internet:** (OSI 3)
4.  **Network Access:** (OSI 1 and 2)

> **Mnemonic:** “**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way” (Physical, Data Link, Network, Transport, Session, Presentation, Application).

---

## Reference

- [Introduction to the OSI Model](https://networklessons.com/cisco/ccna-routing-switching-icnd1-100-105/introduction-to-the-osi-model)
