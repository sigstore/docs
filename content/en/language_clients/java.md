---
type: docs
category: Language Clients
title: Java
weight: 20
---

[`sigstore-java`](https://github.com/sigstore/sigstore-java#sigstore-java) is a java client for interacting with the Sigstore infrastructure.

## Features

- [Maven](https://github.com/sigstore/sigstore-java/tree/main/sigstore-maven-plugin) and [Gradle](https://github.com/sigstore/sigstore-java/tree/main/sigstore-gradle) signing plugins
- Keyless signing and verifying
- Java native signing and verifying [API](https://javadoc.io/doc/dev.sigstore/sigstore-java)

## Installation

Release information for the Java client is available [here](https://github.com/sigstore/sigstore-java/releases). We recommend using the latest version for your install.

### Maven

Requires Java 11

```java
      <plugin>
        <groupId>dev.sigstore</groupId>
        <artifactId>sigstore-maven-plugin</artifactId>
        <version>1.0.0</version>
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

More information on the Maven build plugin is available in the [project repository](https://github.com/sigstore/sigstore-java/tree/main/sigstore-maven-plugin#sigstore-maven-plugin).

### Gradle

Requires Java 11 and Gradle 7.5.

```java
plugins {
    id("dev.sigstore.sign") version "1.0.0"
}
```

More information on the Gradle build plugin is available in the [project repository](https://github.com/sigstore/sigstore-java/tree/main/sigstore-gradle#sigstore-gradle).

## API Usage Examples

### Signing

```java
Path testArtifact = Paths.get("path/to/my/file.jar")

// sign using the Sigstore public instance
var signer = KeylessSigner.builder().sigstorePublicDefaults().build();
Bundle result = signer.signFile(testArtifact);

// Sigstore bundle format (serialized as <artifact>.sigstore.json)
String bundleJson = result.toJson();
```

### Verifying

#### Get artifact and bundle

```java
Path artifact = Paths.get("path/to/my-artifact");

// import a json formatted Sigstore bundle
Path bundleFile = Paths.get("path/to/my-artifact.sigstore.json");
Bundle bundle = Bundle.from(bundleFile, StandardCharsets.UTF_8);
```

#### Configure verification options

```java
// add certificate policy to verify the identity of the signer
VerificationOptions options = VerificationOptions.builder().addCertificateMatchers(
  CertificateMatcher.fulcio()
    .subjectAlternativeName(StringMatcher.string("test@example.com"))
    .issuer(StringMatcher.string("https://accounts.example.com"))
    .build());
```

#### Do verification

```java
try {
  // verify using the Sigstore public instance
  var verifier = new KeylessVerifier.builder().sigstorePublicDefaults().build();
  verifier.verify(artifact, bundle, verificationOptions);
  // verification passed!
} catch (KeylessVerificationException e) {
  // verification failed
}
```

### Additional examples

[Additional](https://github.com/sigstore/sigstore-java/tree/main/examples/hello-world#sigstore-examples) [examples](https://github.com/sigstore/sigstore-java/tree/main/examples/pgp#pgp-test-keys-for-examples) are available in the project repository.
