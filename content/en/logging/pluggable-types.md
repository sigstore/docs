---
type: docs
category: Transparency Log
title: Pluggable Types
weight: 1830
---

Rekor supports pluggable types (aka different schemas) for entries stored in the transparency log. This will allow you to develop your own manifest type in your preferred formatting style (json|yaml|xml).

## Currently supported types

The list of currently supported types and their schema is [maintained in the repository](https://github.com/sigstore/rekor/tree/main/pkg/types#currently-supported-types).

## Base schema

The base schema for all types is modeled off of the schema used by Kubernetes and can be found in `openapi.yaml` as `#/definitions/ProposedEntry`:

```bash
definitions:
  ProposedEntry:
    type: object
    discriminator: kind
    properties:
      kind:
        type: string
    required:
      - kind
```

The `kind` property is a [discriminator](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-13) that is used to differentiate between different pluggable types. Types can have one or more versions of the schema supported concurrently by the same Rekor instance; an example implementation can be seen in `rekord.go`.

## Adding support for a new type

To add a new type (called `newType` in this example):

1. Add a new definition in `openapi.yaml` that is a derived type of ProposedEntry (expressed in the `allOf` list seen below); for example:

    ```yaml
    newType:
      type: object
      description: newType object
      allOf:
        - $ref: "#/definitions/ProposedEntry"
        - properties:
            version:
              type: string
            metadata:
              type: object
              additionalProperties: true
            data:
              type: object
              $ref: "pkg/types/newType/newType_schema.json"
          required:
            - version
            - data
          additionalProperties: false
    ```

    > Note: the `$ref` feature can be used to refer to an externally defined JSON schema document; however it is also permitted to describe the entirety of the type in valid Swagger (aka OpenAPI) v2 format within `openapi.yaml`.

2. Create a subdirectory under `pkg/types/` with your type name (e.g. `newType`) as a new Go package

3. In this new Go package, define a struct that implements the `TypeImpl` interface as defined in `pkg/types/types.go`:

    ```go
    type TypeImpl interface {
      CreateProposedEntry(context.Context, version string, ArtifactProperties) (models.ProposedEntry, error)
        DefaultVersion() string
        SupportedVersions() []string
        IsSupportedVersion(version string) bool
        UnmarshalEntry(pe models.ProposedEntry) (EntryImpl, error)
    }
    ```

    - `CreateProposedEntry` creates an instance of a proposed entry based on the specified API version and the provided artifact properties
    - `DefaultVersion` returns the default API version string across all types (to be used if a caller does not specify an explicit version)
    - `SupportedVersions` returns the list of all API version strings that can currently be inserted into the log.
    - `IsSupportedVersion` returns a boolean denoting whether the specified version could be inserted into the log
    - `UnmarshalEntry` will be called with a pointer to a struct that was automatically generated for the type defined in `openapi.yaml` by the [go-swagger](http://github.com/go-swagger/go-swagger) tool used by Rekor
      - This struct will be defined in the generated file at `pkg/generated/models/newType.go` (where `newType` is replaced with the name of the type you are adding)
      - This method should return a pointer to an instance of a struct that implements the `EntryImpl` interface as defined in `pkg/types/types.go`, or a `nil` pointer with an error specified

    Also, the `Kind` constant must return the _exact_ same string as you named your new type in `openapi.yaml` (e.g. "`newType`")

4. Also in this Go package, provide an implementation of the `EntryImpl` interface as defined in `pkg/types/entries.go`:

    ```go
    type EntryImpl interface {
      APIVersion() string                                 // the supported versions for this implementation
        IndexKeys() ([]string, error)                     // the keys that should be added to the external index for this entry
        Canonicalize(ctx context.Context) ([]byte, error) // marshal the canonical entry to be put into the tlog
        Unmarshal(e models.ProposedEntry) error           // unmarshal the abstract entry into the specific struct for this versioned type
        CreateFromArtifactProperties(context.Context, ArtifactProperties) (models.ProposedEntry, error)
        Verifier() (pki.PublicKey, error)
        Insertable() (bool, error) // denotes whether the entry that was unmarshalled has the writeOnly fields required to validate and insert into the log
    }
    ```

   - `APIVersion` should return a version string that identifies the version of the type supported by the Rekor server
   - `IndexKeys` should return a `[]string` containing the keys that are stored in the search index that should map to this log entry's ID.
   - `Canonicalize` should return a `[]byte` containing the canonicalized contents representing the entry. The canonicalization of contents is important as we should have one record per unique signed object in the transparency log.
   - `Unmarshal` will be called with a pointer to a struct that was automatically generated for the type defined in `openapi.yaml` by the [go-swagger](http://github.com/go-swagger/go-swagger) tool used by Rekor
     - This method should validate the contents of the struct to ensure any string or cross-field dependencies are met to successfully insert an entry of this type into the transparency log
   - `CreateFromArtifactProperties` returns a proposed entry of this specific entry implementation given the provided artifact properties
   - `Verifier` returns the verification material that was used to verify the digital signature
   - `Insertable` introspects the entry and determines if the object is sufficiently hydrated to make a new entry into the log. Entry instances that are created by reading the contents stored in the log may not be sufficiently hydrated.

5. In the Go package you have created for the new type, be sure to add an entry in the `TypeMap` in `github.com/sigstore/rekor/pkg/types` for your new type in the `init` method for your package. The key for the map is the unique string used to define your type in `openapi.yaml` (e.g. `newType`), and the value for the map is the name of a factory function for an instance of `TypeImpl`.

    ```go
    func init() {
        types.TypeMap.Set("newType", NewEntry)
    }
    ```

6. Add an entry to `pluggableTypeMap` in `cmd/server/app/serve.go` that provides a reference to your package. This ensures that the `init` function of your type (and optionally, your version implementation) will be called before the server starts to process incoming requests and therefore will be added to the map that is used to route request processing for different types.

7. After adding sufficient unit & integration tests, submit a pull request to `sigstore/rekor` for review and addition to the codebase.

## Adding a new version of the `Rekord` type

To add new version of the default `Rekord` type:

1. Create a new subdirectory under `pkg/types/rekord/` for the new version

2. If there are changes to the Rekord schema for this version, create a new JSON schema document and add a reference to it within the `oneOf` clause in `rekord_schema.json`. If there are no changes, skip this step.

3. Provide an implementation of the `EntryImpl` interface as defined in `pkg/types/types.go` for the new version.

4. In your package's `init` method, ensure there is a call to `SemVerToFacFnMap.Set()` which provides the link between the valid _semver_ ranges that your package can successfully process and the factory function that creates an instance of a struct for your new version.

5. Add an entry to `pluggableTypeMap` in `cmd/server/app/serve.go` that provides a reference to the Go package implementing the new version. This ensures that the `init` function will be called before the server starts to process incoming requests and therefore will be added to the map that is used to route request processing for different types.

6. After adding sufficient unit & integration tests, submit a pull request to `sigstore/rekor` for review and addition to the codebase.
