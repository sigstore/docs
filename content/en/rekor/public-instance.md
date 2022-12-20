---
title: Public instance
category: "Rekor"
position: 302
---

A public instance of Rekor can be found at [rekor.sigstore.dev](https://rekor.sigstore.dev).

<div class="bg-orange-100 border-l-4 border-orange-500 p-3">
  <p>
    <span class="font-bold">🚨🚨 IMPORTANT 🚨🚨</span>
  </p>
  <p>
    This instance is currently operated on a best-effort basis.<br>
    <span class="font-bold">We will take the log down and reset it with zero notice.</span><br>
    We will improve the stability and publish SLOs over time.
  </p>
</div>

This instance is maintained by the Rekor community. Interested in helping operate and maintain our production CA system and Transparency Logs? Please reach out via the mailing list.

If you have production use-cases in mind, again - please reach out over email via the mailing list. **We are interested in helping onboard you!**

## Auditing the Public Instance

The sigstore community runs a job to publish the latest Signed Tree Hashes on GCS.

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

We store them in both raw (unverified) and decoded (verified) formats. You can verify the signatures against Rekor's public key.

These entries contain the tree length, tree root hash as well as the timestamp. The (signed) timestamp and index of a (signed) tree hash may be used as an attestation that any entries in the log prior to this index were witnessed by Rekor before this time.
