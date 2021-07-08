---
title: "Run a Rekor Server"
date: 2020-12-08T08:12:58Z
draft: false
section: single
type: page
---
There are a few ways to deploy a Rekor Server:

 1. We have a [docker-compose](https://github.com/sigstore/rekor/blob/main/docker-compose.yml) file available
 2. A [kubernetes operator](https://github.com/sigstore/rekor-operator)
 3. Or you could do this manually and build rekor yourself.

# Manual Installation

## Prerequisites

You will of course also need golang version 1.15 or greater and a `$GOPATH` set.

If you want to perform fast queries you will need to add redis, otherwise you must pass the `--enable_retrieve_api=false`
flag when running `rekor-server` in the later steps of this page.

## Get Rekor

Grab the rekor source:

`go get -u -t -v github.com/sigstore/rekor/cmd/server`

> Note: You can also `git clone` should you prefer.

## Create Database and populate tables

Trillian requires a database, we use MariaDB for now (others to be explored later). Once this
is installed on your machine, edit the `scripts/createdb.sh` file with your database root account credentials and run the
script. If you're just trying out rekor, keep the DB user name and password the same as in the script (test/zaphod). If
you change these, you need to make the changes on Trillian's side (visit the trillian repo for details).

## Build Trillian

To run rekor you need to build trillian:

```
go get -u -t -v github.com/google/trillian
cd $GOPATH/src/github.com/google/trillian/cmd/trillian_log_server
go build
cp trillian_log_server /usr/local/bin/
cd $GOPATH/src/github.com/google/trillian/cmd/trillian_log_signer
go build
cp trillian_log_signer /usr/local/bin/
```

### Start the tlog server

```
trillian_log_server -http_endpoint=localhost:8090 -rpc_endpoint=localhost:8091 --logtostderr ...
```

### Start the tlog signer

```
trillian_log_signer --logtostderr --force_master --http_endpoint=localhost:8190 -rpc_endpoint=localhost:8191  --batch_size=1000 --sequencer_guard_window=0 --sequencer_interval=200ms
```

## Build Rekor Server

```
cd $GOPATH/src/github.com/sigstore/rekor/cmd/server
go build -v -o rekor-server
cp rekor-server /usr/local/bin/
```

## Start the rekor server

```
rekor-server serve
2020-09-12T16:32:22.705+0100	INFO	cmd/root.go:87	Using config file: /Users/lukehinds/go/src/github.com/sigstore/rekor-server/rekor-server.yaml
2020-09-12T16:32:22.705+0100	INFO	app/server.go:55	Starting server...
2020-09-12T16:32:22.705+0100	INFO	app/server.go:61	Listening on 127.0.0.1:3000
```
