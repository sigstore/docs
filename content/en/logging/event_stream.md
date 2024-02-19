---
type: docs
category: Transparency Log
menuTitle: Event Stream
title: Using the Rekor Event Stream
weight: 1850
---

The public Rekor instance provides an event stream of new entries added to the transparency log using GCP Pub/Sub. This can be used to monitor the log in real-time for events you are interested in.

## Pub/Sub details

> **Important:** Pub/Sub usage is not free. Please familiarize yourself with the [pricing](https://cloud.google.com/pubsub/pricing) before proceeding.

> **Tip:** You can avoid paying egress network costs by placing the workload that processes events from the subscription in the same region as the topic.

The details needed to subscribe to the topic are below. Any authenticated GCP principal can create subscriptions to the topic.

| Item                 | Value           |
|----------------------|-----------------|
| GCP Project ID       | `project-rekor` |
| Pub/Sub Topic ID     | `new-entry`     |
| Pub/Sub Topic Region | `us-central1`   |

## Event format

The events are published in both the [JSON](https://github.com/cloudevents/spec/blob/main/cloudevents/formats/json-format.md) and [Protobuf](https://github.com/cloudevents/spec/blob/main/cloudevents/formats/protobuf-format.md) formats of the CloudEvents specificaion. The `data` field is always a serialized [`TransparencyLogEntry`](https://github.com/sigstore/protobuf-specs/blob/b46b842040854ceab8f3a42547ae6e991793d0ef/protos/sigstore_rekor.proto#L92) proto message. For JSON formatted events, this follows the JSON serialization [specification](https://protobuf.dev/programming-guides/proto3/#json) for Protobufs.

All published events have attributes attached to them. Attributes that are custom to Rekor and not a part of the CloudEvents specification are prefixed by `rekor_`. You can add [server-side filters](https://cloud.google.com/pubsub/docs/subscription-message-filter) based on these attributes to automatically acknowledge messages you are not interested in to reduce costs.

| Attribute                | Value                                                                   |
|--------------------------|-------------------------------------------------------------------------|
| `datacontenttype`        | `application/json` or `application/protobuf`                            |
| `id`                     | The unique identifier for the entry in the Rekor log.                   |
| `rekor_entry_kind`       | The kind of the Rekor entry (`hashedrekord`, `intoto`, etc.)            |
| `rekor_signing_subjects` | A sorted, comma-delimeted list of the principals that signed the entry. |
| `source`                 | `/createLogEntry`                                                       |
| `specversion`            | `1.0`                                                                   |
| `time`                   | The timestamp the entry was added to the log.                           |
| `type`                   | `dev.sigstore.rekor.events.v1.NewEntry`                                 |

## Example usage

In this example scenario, we want to monitor all log entries added by GitHub Actions CI workers in the Sigstore GitHub org. We do this to verify that all CI runs that upload entries to Rekor are from the `main` branch only. Uploads from other branches could indicate a GitHub Actions misconfiguration that allowed a malicious actor to submit a pull request which triggered a CI run that allowed them to sign their artifacts using our identity.

### Setting up the subscription

> **Note:** To perform the steps below, you will need the [gcloud CLI](https://cloud.google.com/sdk/docs/install).

First, define some environment variables. You may pick any value you like for `SUBSCRIPTION_PROJECT_ID` and `SUBSCRIPTION_ID`. The value for `SUBSCRIPTION_PROJECT_ID` must be globally unique among all GCP projects. 

```sh
export SUBSCRIPTION_PROJECT_ID="your-gcp-project-id"
export SUBSCRIPTION_ID="new-entry-subscription"
export SUBSCRIPTION_CONTENT_TYPE="application/protobuf"
```

If the project does not exist, you can create it with the command below.

```sh
gcloud projects create $SUBSCRIPTION_PROJECT_ID
```

Then, you can create the subscription, filtering on the content type and the signing subjects we want to receive messages about.

```sh
export SUBSCRIPTION_FILTER='attributes.datacontenttype = "$SUBSCRIPTION_CONTENT_TYPE" AND hasPrefix(attributes.rekor_signing_subjects, "https://github.com/sigstore/")'
```

```sh
gcloud pubsub subscriptions create \
    $SUBSCRIPTION_ID \
    --project $SUBSCRIPTION_PROJECT_ID \
    --topic new-entry \
    --topic-project project-rekor \
    --message-filter $SUBSCRIPTION_FILTER
```

The subscription is now set up and we can pull the events 

### Processing log entries

The first step is to create a program that pulls all messages from the subscription indefinitely. It passes all received messages to a `handleMsg` function. The code examples below omit imports from Go's standard library for brevity.

```go
import (
	"cloud.google.com/go/pubsub"
)

func main() {
	ctx, done := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer done()

	// Bootstrap the PubSub client.
	client, err := pubsub.NewClient(ctx, os.Getenv("SUBSCRIPTION_PROJECT_ID"))
	if err != nil {
		log.Fatal(err)
	}
	sub := client.Subscription(os.Getenv("SUBSCRIPTION_ID"))

	// Continuously read messages into a channel.
	msgs := make(chan *pubsub.Message)
	go func() {
		for {
			err := sub.Receive(ctx, func(_ context.Context, msg *pubsub.Message) {
				msgs <- msg
			})
			if err != nil {
				log.Print(err)
			}
		}
	}()

	// Handle each message received until the process is terminated.
	for {
		select {
		case msg := <-msgs:
			if err := handleMsg(msg); err != nil {
				log.Print(err)
			}
			msg.Ack()
		case <-ctx.Done():
			return
		}
	}
}
```

The `handleMsg` function deserializes the event and then checks the signing subjects.

```go
import (
	"google.golang.org/protobuf/proto"
	eventspb "github.com/sigstore/protobuf-specs/gen/pb-go/events/v1"
)

func handleMsg(msg *pubsub.Message) error {
	event := new(eventspb.CloudEvent)
	if err := proto.Unmarshal(msg.Data, event); err != nil {
		return fmt.Errorf("unmarshal msg %q: %w", msg.ID, err)
	}

	// In a real implementation, you should verify the entry before proceeding!

	attr, ok := event.Attributes["rekor_signing_subjects"]
	if !ok {
		return fmt.Errorf("entry %q is missing rekor_signing_subjects", event.GetId())
	}
	subjects := strings.Split(attr.GetCeString(), ",")
	for _, subject := range subjects {
		if !strings.HasSuffix(subject, "@refs/heads/main") {
			return fmt.Errorf("entry %q was not run from the main branch: %s", event.GetId(), subject)
		}
	}

	return nil
}
```
