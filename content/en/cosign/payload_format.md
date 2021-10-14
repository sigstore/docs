---
title: "Payload Format"
category: "Cosign"
position: 16
---

`cosign` only supports Red Hat's [simple signing](https://www.redhat.com/en/blog/container-image-signing)
format for payloads.

That looks like:

```json
{
    "critical": {
           "identity": {
               "docker-reference": "testing/manifest"
           },
           "image": {
               "Docker-manifest-digest": "sha256:20be...fe55"
           },
           "type": "cosign container image signature"
    },
    "optional": {
           "creator": "Bob the Builder",
           "timestamp": 1458239713
    }
}
```
**Note:** This can be generated for an image reference using `cosign generate <image>`.
