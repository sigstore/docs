---
title: "Sharding"
description: "Sharding the Rekor Log"
category: "Logging"
position: 320
---

This document covers what Rekor log sharding is and how to shard the log.

## What is sharding?

When Rekor is started for the first time, its backend is a transparency log built on a single [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree).
This log can grow indefinitely as entries are added, which can present issues over time.
To resolve some of these issues the log can be "sharded" into multiple Merkle Trees.

## Why do we shard the log?

Sharding the log allows for:

* Freezing the current log and rotating signing keys if needed
* Easier and faster querying for entries from the tree
* Easier scaling and platform migrations


## How does this impact user experience?

It shouldn't!
End users shouldn't notice any difference in their experience.
They can still query via UUID, and Rekor will find the correct entry from whichever shard it's in.
Querying by log index works as well, since log indices are distinct and increase across shards.

## More Details

For more details around sharding, see the original [design doc](https://docs.google.com/document/d/1QBTyK-wquplNdeUB5_aqztQHigJOepCvd-4FL4H-zl8/edit?resourcekey=0-grdVbSltkTvpNvhj03laCQ#heading=h.al4txfo7pxwl)!

_Note: You'll need to join the sigstore-dev@googlegroups.com Google group for access to the doc._


## How do I shard the Rekor log?

**Sharding the Rekor log will require some downtime in your Rekor service.**
This is necessary because you'll need the length of the current shard later on, so new entries can't be added while sharding is in progress.

Follow these steps to shard the log:
1. Stop all traffic to Rekor so new entries can't be added to the log
2. Store the tree ID and length of the current active shard:
```
CURRENT_TREE_ID=$(rekor-cli loginfo --format json | jq -r .TreeID)
CURRENT_SHARD_LENGTH=$(rekor-cli loginfo --format json | jq -r .TreeSize)
```

3. Connect to the production cluster. Port-forward the running `trillian_logserver` container and run the [createtree](https://github.com/google/trillian/blob/master/cmd/createtree/main.go) script.
This will create a new Merkle Tree which will become the new active shard.

```
kubectl port-forward -n trillian-system deploy/trillian-log-server 8090:8090
# This is the Tree ID of the new active shard
NEW_TREE_ID=$(createtree --admin_server localhost:8090)
```

4. Update the Rekor `sharding-config` ConfigMap with details of the inactive shard:

```
kubectl edit configmap sharding-config -n rekor-system
```

Append the following onto the `sharding-config.yaml` key (it will be empty if this is the first shard):

```yaml
- treeID: $CURRENT_TREE_ID
  treeLength: $CURRENT_SHARD_LENGTH
```

5. In your rekor-server [Deployment](https://github.com/sigstore/rekor/blob/main/config/rekor.yaml), update the `--trillian_log_server.tlog_id` flag to point to the new Tree ID.

```
"--trillian_log_server.tlog_id=$NEW_TREE_ID",
```

6. Redeploy Rekor to the cluster with these changes.

7. Restart traffic to your Rekor service.

8. Congratulations, you've successfully sharded the log!

## Identifier Definitions: EntryID, UUID, LogID, Log Index

An **EntryID** is the unique identifier for an artifact in Rekor. It is made up of two parts, the TreeID and UUID: 

  `EntryID = TreeID (8 byte hex) + UUID (32 byte hex)`

The **TreeID** refers to the specific trillian tree (also known as log or shard) where the artifact can be found. Rekor uses Trillian to implement each transparency log.

The **UUID** refers to the specific artifact within a specified tree.

The **LogIndex** of an artifact identifies the index or order in which the artifact was entered into a specific tree.
