---
title: Auditing the Public Instance
category: "Rekor"
position: 302
---

Sigstore community runs a job to publish the latest Signed Tree Hashes on GCS.

They are served publicly, and can be found with:

    $ gsutil ls gs://rekor-sth/
    gs://rekor-sth/sth-1173.json

The format is currently:

    $ gsutil cat gs://rekor-sth/sth-1173.json | jq .
    {
      "SignedLogRoot": {
        "key_hint": "Ni+Oy6cvQyY=",
        "log_root": "AAEAAAAAAAAElSB3sp4yw0NFEWsTB6RT5mjr6GCKxVQ8Tlym+P3uKTQwuxZquNPzzd3mAAAAAAAACIUAAA==",
        "log_root_signature": "MEUCIQCb8QHWym7jBvBMFk8ir1ZTqT83zpjE0c90vi7VrTG70wIgBwQmaQ96Od62ODZkdT6r1eVsl4r14tYR1MwQbkNv8ZM="
      },
      "VerifiedLogRoot": {
        "TreeSize": 1173,
        "RootHash": "d7KeMsNDRRFrEwekU+Zo6+hgisVUPE5cpvj97ik0MLs=",
        "TimestampNanos": 1615306636833709600,
        "Revision": 2181,
        "Metadata": ""
      }
    }

We store them in both raw (unverified) and decoded (verified) formats.
You can verify the signatures against Rekor's public key.

These entries contain the tree length, tree root hash as well as the timestamp.
The (signed) timestamp and index of a (signed) tree hash may be used as an attestation that any entries in the log
prior to this index were witnessed by Rekor before this time.
