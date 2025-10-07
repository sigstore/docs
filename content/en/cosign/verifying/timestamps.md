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

Sigstore clients relying on Rekor to provide the timestamp use the entry's inclusion time from the [`integratedTime` response field](https://github.com/sigstore/rekor/blob/35c4489abcff256298f1bc9f7caaf5a946750dac/openapi.yaml#L461-L462), which is signed over in the [`signedEntryTimestamp` signature](https://github.com/sigstore/rekor/blob/35c4489abcff256298f1bc9f7caaf5a946750dac/openapi.yaml#L475-L482).

Note that this timestamp comes from Rekor's internal clock, which is not externally verifiable, and a timestamp is not a part of the node that goes into the append-only data structure that backs Rekor, meaning the timestamp is mutable in Rekor without detection.

### Using Rekor timestamps in Cosign

By default, certificates are verified using the time provided by Rekor. You do not need to provide any additional flags when running `cosign sign` or `cosign verify`.

## Timestamp authorities

Sigstore also supports [signed timestamps](https://en.wikipedia.org/wiki/Trusted_timestamping). Trusted Timestamp Authorities (TSAs) issue signed timestamps following the [RFC 3161](https://www.ietf.org/rfc/rfc3161.txt) specification. Since the timestamps are signed, the time becomes immutable and verifiable. During verification, verifiers will use the TSA's provided certificate chain to verify signed timestamps.

Leveraging signed timestamps from TSAs also distributes trust. Anyone can operate a TSA. If you represent an ecosystem that would like to integrate with Sigstore and leverage the public good instance but would like to have control over a part of the trust root, you can operate a TSA whose signed timestamps will be used during verification.

You also have many options for public TSAs, including [FreeTSA](https://freetsa.org/index_en.php) or [Digicert](https://knowledge.digicert.com/generalinformation/INFO4231.html).

Signed timestamps are associated with some value to bind the timestamp to the signing event. We recommend signing over a signature, a process called "countersigning", ensuring that the signature, not the artifact, was created at a certain time.

If you'd like to operate a timestamp authority, we have [implemented a service](https://github.com/sigstore/timestamp-authority) to issue RFC 3161 timestamps. We have also provided [a client](https://github.com/sigstore/timestamp-authority/releases) to query this service. See the [API specification](https://github.com/sigstore/timestamp-authority/blob/main/openapi.yaml) for more information on how to call the service.

If you have questions, come chat on Slack on the [#timestamping channel](https://sigstore.slack.com/archives/C047W7KEU6A).

### Using signed timestamps in Cosign

To use a TSA to fetch a signed timestamp during signing, pick a timestamp authority, and run:

```
export TSA_URL=https://freetsa.org/tsr
cosign sign --timestamp-server-url $TSA_URL <artifact>
```

To verify, retrieve the TSA's certificate chain, which must contain the root CA certificate, any number of intermediate CA certificates, and the issuing leaf TSA certificate. The chain could come from a trusted source such as [TUF metadata](https://theupdateframework.io/), from the TSA documentation, or through an API, `/api/v1/timestamp/certchain`, if the TSA is an instance of [the service we've implemented](https://github.com/sigstore/timestamp-authority). Run the following:

```
cosign verify --timestamp-certificate-chain ts_chain.pem <artifact>
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

## Future goals

We would like to make timestamps immutable in Rekor. While the clock would not be verifiable and trust isn't distributed, it would make mutations to the timestamps detectable. We would like to include a signed timestamp, which could come from a 3rd party TSA or from a TSA operated by the Sigstore community, in the Rekor entry so that it is a part of the Merkle leaf hash computation and therefore becomes immutable. 

As a long-term goal, we would also like to support [Roughtime](https://blog.cloudflare.com/roughtime/), which distributes trust across a set of time providers. The specification is still under development, and there are opportunities for client & server development.
