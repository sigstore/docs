---
title: "Installation"
category: "Rekor"
position: 303
---

There are several ways to install both the `rekor-cli` and `rekor-server`.

## Using go install

If you have Go installed, you can use go to retreive the `rekor-cli` binaries

```
go install -v github.com/sigstore/rekor/cmd/rekor-cli@latest
```

You may also do the same for `rekor-server`, but **please note** that the Rekor server also requires Trillian and a database. (see below for setup instructions).

```
go install -v github.com/sigstore/rekor/cmd/rekor-server@latest
```

## From the release page

Rekor releases are available on the [Release page](https://github.com/sigstore/rekor/releases).

Releases are available for both `rekor-server` and `rekor-cli`.

See [Verifying binaries](https://docs.sigstore.dev/rekor/verify-release/) for details ob how to verify Rekor release binaries.


## Build Rekor CLI manually

```
git clone https://github.com/sigstore/rekor.git rekor-cli
cd rekor-cli
make rekor-cli
cp rekor-cli /usr/local/bin/
```

## Deploy a Rekor Server manually

There are a few ways you can deploy a Rekor Server:

1.  We have a [docker-compose](https://github.com/sigstore/rekor/blob/main/docker-compose.yml) file available
2.  A [kubernetes operator](https://github.com/sigstore/rekor-operator)
3.  Alternatively, you can build a Rekor server yourself.

Note: The Rekor server manually creates a new Merkle tree (or shard) in the Trillian backend every time it starts up, unless an existing one is specified in via the `--trillian_log_server.tlog_id` flag. If you are building the server yourself and do not need [sharding](https://docs.sigstore.dev/rekor/sharding) functionality, you can find the existing tree's TreeID by issuing this client command while the server is running:

`CURRENT_TREE_ID=$(rekor-cli loginfo --format json | jq -r .TreeID)`

Then pass in this TreeID at the next server startup to tell Rekor to use the same existing tree:

`rekor-server serve --trillian_log_server.tlog_id=$CURRENT_TREE_ID`

Setting this flag isn't necessary in an environment like `docker-compose`.

### Prerequisites

You will need golang version 1.16 or greater and a `$GOPATH` set.
You will also need a MySQL compatible database and, if you want to perform fast queries, an instance of redis running.
Otherwise you must pass the `--enable_retrieve_api=false` flag when running `rekor-server` in the later steps of this page.

### Get Rekor

Grab the Rekor source:

`go get -u -t -v github.com/sigstore/rekor/cmd/rekor-server`

> Should you prefer, you can also `git clone https://github.com/sigstore/rekor.git`

### Create database and populate tables

Rekor requires a database. We use MariaDB for now (others to be explored later). Install and set up MariaDB on your machine.

```
dnf install mariadb mariadb-server
systemctl start mariadb
systemctl enable mariadb
mysql_secure_installation
```
 
The Rekor directory has a `scripts/createdb.sh` file that will set up a test database (default user: test; default password: zaphod) and populate the needed tables for Trillian. If you’re just trying out Rekor, keep the DB user name and password the same as in the script (test/zaphod). If you change these, you need to make the changes on Trillian’s side (visit the [Trillian repo](https://github.com/google/trillian) for details).

```
cd $GOPATH/pkg/mod/github.com/sigstore/rekor@v0.4.0/scripts/
sh createdb.sh
``` 
 
### Build Trillian

You also need to build Trillian, an append-only log:

```
go get -u -t -v github.com/google/trillian
cd $GOPATH/src/github.com/google/trillian/cmd/trillian_log_server
go build
cp trillian_log_server /usr/local/bin/

cd $GOPATH/src/github.com/google/trillian/cmd/trillian_log_signer
go build
cp trillian_log_signer /usr/local/bin/

cd $GOPATH/src/github.com/google/trillian/cmd/createtree
go build
cp createtree /usr/local/bin/
```

Next, run the Trillian log server:

```
trillian_log_server --logtostderr ...
```

Run the signer:

```
trillian_log_signer --logtostderr --force_master --rpc_endpoint=localhost:8190 -http_endpoint=localhost:8191  --batch_size=1000 --sequencer_guard_window=0 --sequencer_interval=200ms
```
> Note: you can log both to files and to stderr using `--alsologtostderr`

Create the tree:

```
createtree --admin_server=localhost:8090
```

#### Build the Rekor Server

With Trillian and MariaDB set up, you can now build the Rekor Server:

```
cd $GOPATH/pkg/mod/github.com/sigstore/rekor@v0.4.0/cmd/rekor-server
go build -v -o rekor-server
cp rekor-server /usr/local/bin/
```

#### Start the Rekor Server

```
rekor-server serve --enable_retrieve_api=false

2020-09-12T16:32:22.705+0100	INFO	cmd/root.go:87	Using config file: /Users/lukehinds/go/src/github.com/sigstore/rekor-server/rekor-server.yaml
2020-09-12T16:32:22.705+0100	INFO	app/server.go:55	Starting server...
2020-09-12T16:32:22.705+0100	INFO	app/server.go:61	Listening on 127.0.0.1:3000
```
> If you have a redis server running to enable searching your Rekor server, remove the `enable_reprieve_api` flag 

#### Next Steps

Congratulations! Your local Rekor server is now running. You can interact with it using the [Rekor CLI](https://docs.sigstore.dev/rekor/CLI).
