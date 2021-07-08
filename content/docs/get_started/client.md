---
title: "Rekor Command Line Interface"
date: 2020-12-08T08:06:07Z
draft: false
section: single
type: page
---

The following guide is targeted towards developers / software maintainers who would like to make a provenance entry into the rekor transparency log.

The steps outlined below will show how to sign your software and then use the `rekor` CLI to make and verify an entry.

## Download the Rekor CLI application

## Prerequisites

You will of course also need golang version 1.15 or greater and a `$GOPATH` set.

## Build rekor

```
go get -u -t -v github.com/sigstore/rekor/cmd/rekor-cli
cd $GOPATH/src/github.com/sigstore/rekor/cmd/rekor-cli
go build -v -o rekor
cp rekor /usr/local/bin/
```

## Sign your release

Before using rekor, you are required to sign your release. The following example illustrates
this using GPG.

You may use either armored or plain binary:

```
gpg --armor -u jdoe@example.com --output mysignature.asc --detach-sig myrelease.tar.gz
```

You will also need to export your public key

```
gpg --export --armor "jdoe@example.com" > mypublickey.key
```

## Upload an entry rekor

The `upload` command sends your public key / signature and artifact URL to the rekor transparency log.

```
rekor upload --rekor_server https://rekor.sigstore.dev --signature <artifact_signature> --public-key <your_public_key> --artifact <url_to_artifact>
```

Firstly the rekor command will verify your public key, signature and download
a local copy of the artifact. It will then validate the artifact signing (no
access to your private key is required).

If the validations above pass correctly, the entry will be made to rekor and an entry URL will be returned:

```
Created entry at: https://rekor.sigstore.dev/api/v1/log/entries/b08416d417acdb0610d4a030d8f697f9d0a718024681a00fa0b9ba67072a38b5
```

This URL contains the UUID entry / merkle tree hash (in the above case `b08416d417acdb0610d4a030d8f697f9d0a718024681a00fa0b9ba67072a38b5`).

Within here is again the UUID and the body of the entry.

## Verify Proof of Entry

The `verify` command allows you to send a public key / signature and artifact to the rekor transparency log for verification of entry.

You would typically use this command as a means to verify an 'inclusion proof'
showing that your artifact is stored within the transparency log.

```
rekor verify --rekor_server <rekor_url> --signature <artifact-signature> --public-key <your_public_key> --artifact <url_to_artifact>|<local_path_artifact>
```

> Note that alternatively you can use a local artifact path with `--artifact`.

## Get Entry

An entry in the log can be retrieved by using the `get` command with either the log index or the artifact UUID:

```
rekor get --rekor_server https://rekor.sigstore.dev --log-index <log-index>
```

```
rekor get --rekor_server https://rekor.sigstore.dev --uuid <uuid>
```

## Log Info

The `loginfo` command retrieves the public key of the transparency log (unless already declared within the client `~/.rekor/rekor.yaml`)
and then uses this public key to verify the signature on the signed tree head.

```
rekor loginfo --rekor_server https://rekor.sigstore.dev
```

## Search

If running a redis instance within rekor, the `search` command performs a redis lookup using a file or a public key.

This command requires one of an artifact, a public key, or a SHA hash.

```
rekor search --rekor_server https://rekor.sigstore.dev --[artifact|public-key|sha]
```
