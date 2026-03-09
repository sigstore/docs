---
type: docs
category: verifying
title: Timestamps
weight: 305
---

Time is a critical component of Sigstore. It's used to verify that a short-lived certificate issued by Fulcio was valid at a previous point, when the artifact was signed.

During artifact verification, a client must verify the certificate. Typically, certificate verification would require that the certificate not be expired. In this model for code signing, the certificate would need to be longer-lived, on the order of months or years, and the signer would periodically re-sign the artifact. This becomes a burden on both the signer and verifier, who has to periodically re-fetch the code signing certificate.

Instead, Sigstore relies on time provided by another service. When verifying the short-lived code signing certificate, Sigstore verifies that the provided timestamp falls within the certificate's validity period. Sigstore clients can use either the time of inclusion in Rekor or a signed timestamp provided by a trusted timestamping authority.

## Timestamping in Rekor

### Rekor v1

Sigstore clients relying on Rekor to provide the timestamp use the entry's inclusion time from the [`integratedTime` response field](https://github.com/sigstore/rekor/blob/35c4489abcff256298f1bc9f7caaf5a946750dac/openapi.yaml#L461-L462), which is signed over in the [`signedEntryTimestamp` signature](https://github.com/sigstore/rekor/blob/35c4489abcff256298f1bc9f7caaf5a946750dac/openapi.yaml#L475-L482).

Note that this timestamp comes from Rekor's internal clock, which is not externally verifiable, and a timestamp is not a part of the node that goes into the append-only data structure that backs Rekor, meaning the timestamp is mutable in Rekor without detection.

### Rekor v2

When using Rekor v2, Sigstore clients will get a signed timestamp from a timestamp authority separate from Rekor.

### Using Rekor timestamps in Cosign

By default, Cosign will use a timestamp authority when appropriate. You do not need to provide any additional flags when running `cosign sign` or `cosign verify`.

## Timestamp authorities

Sigstore supports [signed timestamps](https://en.wikipedia.org/wiki/Trusted_timestamping). Trusted Timestamp Authorities (TSAs) issue signed timestamps following the [RFC 3161](https://www.ietf.org/rfc/rfc3161.txt) specification. Since the timestamps are signed, the time becomes immutable and verifiable. During verification, verifiers will use the TSA's provided certificate chain to verify signed timestamps.

Leveraging signed timestamps from TSAs also distributes trust. Anyone can operate a TSA. If you represent an ecosystem that would like to integrate with Sigstore and leverage the public good instance but would like to have control over a part of the trust root, you can operate a TSA whose signed timestamps will be used during verification.

You also have many options for public TSAs, including timestamp.sigstore.dev, timestamp.githubapp.com,  [FreeTSA](https://freetsa.org/index_en.php) or [Digicert](https://knowledge.digicert.com/generalinformation/INFO4231.html).

Signed timestamps are associated with some value to bind the timestamp to the signing event. We recommend signing over a signature, a process called "countersigning", ensuring that the signature, not the artifact, was created at a certain time.

If you'd like to operate a timestamp authority, we have [implemented a service](https://github.com/sigstore/timestamp-authority) to issue RFC 3161 timestamps. We have also provided [a client](https://github.com/sigstore/timestamp-authority/releases) to query this service. See the [API specification](https://github.com/sigstore/timestamp-authority/blob/main/openapi.yaml) for more information on how to call the service.

If you have questions, come chat on Slack on the [#timestamping channel](https://sigstore.slack.com/archives/C047W7KEU6A).

### Using signed timestamps in Cosign

You can see Cosign's default timestamp authority signing configuration with:

```
$ cosign signing-config create --with-default-services | jq ".tsaUrls"
[
  {
    "url": "https://timestamp.sigstore.dev/api/v1/timestamp",
    "majorApiVersion": 1,
    "validFor": {
      "start": "2025-07-04T00:00:00Z"
    },
    "operator": "sigstore.dev"
  }
]
```

Similarly you can see Cosign's default timestamp authority verification information with:

```
$ cosign trusted-root create --with-default-services | jq ".timestampAuthorities"
[
  {
    "subject": {
      "organization": "sigstore.dev",
      "commonName": "sigstore-tsa-selfsigned"
    },
    ...
```

### mTLS connection to the TSA server

The `cosign sign`, `sign-blob`, `attest` and `attest-blob` commands accept several additional optional parameters to pass the CA certificate of
the TSA server in cases where it uses a custom CA, or to establish a mutual TLS connection to the TSA server:
```
    --timestamp-client-cacert='':
	path to the X.509 CA certificate file in PEM format to be used for the connection to the
	TSA Server

    --timestamp-client-cert='':
	path to the X.509 certificate file in PEM format to be used for the connection to the TSA
	Server

    --timestamp-client-key='':
	path to the X.509 private key file in PEM format to be used, together with the
	'timestamp-client-cert' value, for the connection to the TSA Server

    --timestamp-server-name='':
	SAN name to use as the 'ServerName' tls.Config field to verify the mTLS connection to the
	TSA Server
```
