# UUID, EntryID, logID, and logIndex in Rekor

UUID, EntryID, logID, and logIndex are all crucial concepts in Rekor, a tamper-evident transparency log developed by the sigstore project. Each of these concepts serves a different purpose, and it's essential to understand their differences to work effectively with Rekor.

## UUID
A UUID (Universally Unique Identifier) is a 128-bit number that is used to uniquely identify a resource. In Rekor, UUIDs are used to identify individual entries in the transparency log. Each entry in the log is assigned a unique UUID when it's added to the log. UUIDs are generated using the UUID version 4 algorithm, which ensures that they're random and unlikely to collide with other UUIDs.

## EntryID
An EntryID is a monotonically increasing integer that's assigned to each entry in the transparency log. EntryIDs are used to order the entries in the log and to detect gaps or missing entries in the log. EntryIDs start at 1 for the first entry in the log and increase by 1 for each subsequent entry. EntryIDs are not guaranteed to be unique across the entire log, but they're guaranteed to be unique within a given log shard.

## logID
A logID is a unique identifier for a particular transparency log in Rekor. Each log in Rekor is identified by a logID, which is a string that's unique across all logs in Rekor. LogIDs are used to distinguish between different logs and to ensure that entries are added to the correct log. LogIDs are randomly generated using the UUID version 4 algorithm.

## logIndex
A logIndex is a monotonically increasing integer that's assigned to each entry in the transparency log within a particular log shard. Log indices are used to order entries within a shard and to detect gaps or missing entries within a shard. Log indices start at 0 for the first entry in the shard and increase by 1 for each subsequent entry. Log indices are guaranteed to be unique within a given shard, but they're not guaranteed to be unique across different shards.

## Updates after sharding
In Rekor, sharding is the process of dividing a single large transparency log into multiple smaller logs called shards. This is done to improve performance and scalability. After sharding, the concepts of EntryID and logIndex remain the same, but UUID and logID are updated.

In a sharded log, each shard has its own UUID and logID. UUIDs are still generated using the UUID version 4 algorithm, but they're now generated separately for each shard. Similarly, logIDs are now generated separately for each shard to ensure that each shard has a unique identifier.

When adding an entry to a sharded log, the entry is assigned a UUID and an EntryID as before. However, the logIndex is now specific to the shard in which the entry is added. The logIndex starts at 0 for the first entry in each shard and increases by 1 for each subsequent entry in that shard.

## **Examples**
Suppose we have a sharded log with two shards, and each shard has three entries. Here's an example of how UUID, EntryID, logID, and logIndex would be assigned to each entry:

### Shard 1, Entry 1:
* UUID: e8ec8f69-d83b-4b05-ae68-8a26a1f142c3
* EntryID: 1
* logID: 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057
* logIndex: 0

### Shard 1, Entry 2:
* UUID: 8c066eeb-2715-4b5f-b46d-f5e0b9dc1419
* EntryID: 2
* logID: 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057
* logIndex: 1

### Shard 1, Entry 3:
* UUID: 04af1db9-1e5c-4810-92d5-694ca1b31c62
* EntryID: 3
* logID: 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057
* logIndex: 2

### Shard 2, Entry 1:
* UUID: d0dc5c5a-f0b4-4375-8b5e-ba3569f11bf3
* EntryID: 1
* logID: d7e39f21-b166-48d8-9c98-9bbab846d775
* logIndex: 0

### Shard 2, Entry 2:
* UUID: cee8b10c-6a9a-41c1-8d8c-1c678a3a6a3d
* EntryID: 2
* logID: d7e39f21-b166-48d8-9c98-9bbab846d775
* logIndex: 1

### Shard 2, Entry 3:
* UUID: 8da0c899-7ec1-46ce-8a24-21b891cf9a2f
* EntryID: 3
* logID: d7e39f21-b166-48d8-9c98-9bbab846d775
* logIndex: 2

In this example, we have a sharded log with two shards. Each shard represents a subset of the overall log, and each entry within the log is assigned a unique identifier to ensure that it can be easily located and referenced in the future.

For *Shard 1, Entry 1*, the UUID is e8ec8f69-d83b-4b05-ae68-8a26a1f142c3. UUID stands for Universally Unique Identifier, and it is a 128-bit value that is generated in a way that ensures that it is unique across all systems and all time. The EntryID for this entry is 1, indicating that it is the first entry in Shard 1. The logID for this entry is 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057, indicating that it belongs to the same log as the other entries in Shard 1. The logIndex for this entry is 0, indicating that it is the first entry in Shard 1.

For *Shard 1, Entry 2*, the UUID is 8c066eeb-2715-4b5f-b46d-f5e0b9dc1419. The EntryID is 2, the logID is 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057, and the logIndex is 1.

For *Shard 1, Entry 3*, the UUID is 04af1db9-1e5c-4810-92d5-694ca1b31c62. The EntryID is 3, the logID is 9b2d9b9a-4c07-4db4-b4ad-4f02ebfa0057, and the logIndex is 2.

For *Shard 2, Entry 1*, the UUID is d0dc5c5a-f0b4-4375-8b5e-ba3569f11bf3. The EntryID is 1, indicating that it is the first entry in Shard 2. The logID for this entry is d7e39f21-b166-48d8-9c98-9bbab846d775, indicating that it belongs to the same log as the other entries in Shard 2. The logIndex for this entry is 0, indicating that it is the first entry in Shard 2.

For *Shard 2, Entry 2*, the UUID is cee8b10c-6a9a-41c1-8d8c-1c678a3a6a3d. The EntryID is 2, the logID is d7e39f21-b166-48d8-9c98-9bbab846d775, and the logIndex is 1.

For *Shard 2, Entry 3*, the UUID is 8da0c899-7ec1-46ce-8a24-21b891cf9a2f. The EntryID is 3, the logID is d7e39f21-b166-48d8-9c98-9bbab846d775, and the logIndex is 2.

In this example, each entry in the sharded log has a unique UUID and EntryID, but the logID and logIndex are specific to each shard. Entries in the same shard have consecutive log indices, while entries in different shards may have the same log index.

Overall, these identifiers allow for each entry to be uniquely identified within the larger sharded log and provide a means for efficient retrieval and analysis of log data.
