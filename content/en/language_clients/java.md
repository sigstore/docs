---
type: docs
category: Language Clients
title: Java
weight: 20
---

[`sigstore-java`](https://github.com/sigstore/sigstore-java) is a Java client for signing and verifying artifacts with Sigstore. It supports keyless signing — signing without managing long-lived private keys, using short-lived certificates tied to an [OIDC](https://openid.net/developers/how-connect-works/) (OpenID Connect) identity — via build plugins for Maven and Gradle, and a direct Java API.

## Features

* [Maven](https://github.com/sigstore/sigstore-java/tree/main/sigstore-maven-plugin) and [Gradle](https://github.com/sigstore/sigstore-java/tree/main/sigstore-gradle) signing plugins
* Keyless signing and verification
* Java API ([Javadoc](https://javadoc.io/doc/dev.sigstore/sigstore-java))
* [DSSE](https://github.com/secure-systems-lab/dsse) (Dead Simple Signing Envelope) attestation signing and verification
* [TUF](https://theupdateframework.io) (The Update Framework) integration for trusted root management
* GitHub Actions OIDC support for CI/CD pipelines

## Requirements

* Java 11 or higher
* Gradle 7.5 or higher (for the Gradle plugin)

## Installation

Release information is available on the [releases page](https://github.com/sigstore/sigstore-java/releases). Use the latest version for your install.

### Maven

```xml
<plugin>
  <groupId>dev.sigstore</groupId>
  <artifactId>sigstore-maven-plugin</artifactId>
  <version>2.0.0</version>
  <executions>
    <execution>
      <id>sign</id>
      <goals>
        <goal>sign</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

More information on the Maven plugin is available in the [project repository](https://github.com/sigstore/sigstore-java/tree/main/sigstore-maven-plugin#sigstore-maven-plugin).

### Gradle

```kotlin
plugins {
    id("dev.sigstore.sign") version "2.0.0"
}
```

This automatically signs all Maven publications. More information is available in the [project repository](https://github.com/sigstore/sigstore-java/tree/main/sigstore-gradle#sigstore-gradle).

#### Signing individual files

Use the `sign-base` plugin to sign individual files without tying into Maven publication:

```kotlin
plugins {
    id("dev.sigstore.sign-base")
}

val signHelloProps by tasks.registering(SigstoreSignFilesTask::class) {
    signFile(/* File or Provider<RegularFile> */)
}
```

## API Usage

The stable public API consists of [`KeylessSigner`](https://javadoc.io/doc/dev.sigstore/sigstore-java) and [`KeylessVerifier`](https://javadoc.io/doc/dev.sigstore/sigstore-java). Other library classes may change between releases without notice.

### Signing

```java
import dev.sigstore.KeylessSigner;
import dev.sigstore.bundle.Bundle;
import java.nio.file.Path;
import java.nio.file.Paths;

Path artifact = Paths.get("path/to/my/file.jar");

var signer = KeylessSigner.builder().sigstorePublicDefaults().build();
Bundle bundle = signer.signFile(artifact);

// serialized as <artifact>.sigstore.json
String bundleJson = bundle.toJson();
```

### Verifying

#### Get artifact and bundle

```java
import dev.sigstore.bundle.Bundle;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;

Path artifact = Paths.get("path/to/my-artifact");
Path bundleFile = Paths.get("path/to/my-artifact.sigstore.json");
Bundle bundle = Bundle.from(bundleFile, StandardCharsets.UTF_8);
```

#### Configure verification options

```java
import dev.sigstore.verification.VerificationOptions;
import dev.sigstore.strings.StringMatcher;

VerificationOptions verificationOptions = VerificationOptions.builder()
  .addCertificateMatchers(
    VerificationOptions.CertificateMatcher.fulcio()
      .subjectAlternativeName(StringMatcher.string("test@example.com"))
      .issuer(StringMatcher.string("https://accounts.example.com"))
      .build())
  .build();
```

#### Do verification

```java
import dev.sigstore.KeylessVerifier;
import dev.sigstore.KeylessVerificationException;

try {
  var verifier = KeylessVerifier.builder().sigstorePublicDefaults().build();
  verifier.verify(artifact, bundle, verificationOptions);
  // verification passed
} catch (KeylessVerificationException e) {
  // verification failed
}
```

### DSSE Attestation Signing

DSSE attestation signing requires [Rekor](https://docs.sigstore.dev/logging/overview/) V2, Sigstore's append-only transparency log. The following example uses the staging instance, which has Rekor V2 enabled:

```java
import dev.sigstore.KeylessSigner;
import dev.sigstore.bundle.Bundle;

String payload = "<some https://in-toto.io/Statement/v1 statement>";
var signer = KeylessSigner.builder().sigstoreStagingDefaults().enableRekorV2(true).build();
Bundle bundle = signer.attest(payload);
String bundleJson = bundle.toJson();
```

[Additional examples](https://github.com/sigstore/sigstore-java/tree/main/examples/hello-world#sigstore-examples) are available in the project repository.

## Known Limitations

* **Offline signing** is not supported.
* **Multi-module Maven builds**: each module that signs artifacts requires its own OIDC authentication step.
* **Long-running builds**: the OIDC token has a 10-minute validity window. Builds that take longer than 10 minutes may require re-authentication partway through.

