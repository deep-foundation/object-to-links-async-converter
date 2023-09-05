[![npm](https://img.shields.io/npm/v/@freephoenix888/object-to-links-async-converter.svg)](https://www.npmjs.com/package/@freephoenix888/object-to-links-async-converter)
[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/FreePhoenix888/object-to-links-async-converter)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Converts object values to links.

**In development**

# Usage

1. Install the package
2. Give permissions to the package

```ts
const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
const packageLinkId = await deep.id(
  "@freephoenix888/object-to-links-async-converter",
);
await deep.insert([
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id("deep", "users", "packages"),
  },
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id("deep", "admin"),
  },
]);
```

3. Create a `TestType` type link with `Object` value.

```js
const ownerLinkId = deep.linkId;

const result = await deep.serial({
  operations: [
    {
      table: "links",
      type: "insert",
      objects: {
        type_id: await deep.id("@deep-foundation/core", "Type"),
        out: {
          data: {
            type_id: await deep.id("@deep-foundation/core", "Value"),
            to_id: await deep.id("@deep-foundation/core", "Object"),
            in: {
              data: {
                type_id: await deep.id("@deep-foundation/core", "Contain"),
                from_id: ownerLinkId,
                string: { data: { value: "testTypeValue" } },
              },
            },
          },
        },
        in: {
          data: {
            type_id: await deep.id("@deep-foundation/core", "Contain"),
            from_id: ownerLinkId,
            string: { data: { value: "TestType" } },
          },
        },
      },
    },
  ],
});

const linkWithObjectValueTypeLinkId = result.data[0].id;
```

4. Insert `HandleUpdate` which points from handler from this package to the type that is going to be handled (links of your type will be processed by this package to convert their object values to links)

```ts
await deep.serial({
  operations: [
    {
      table: "links",
      type: "insert",
      objects: {
        type_id: await deep.id("@deep-foundation/core", "HandleUpdate"),
        from_id: linkWithObjectValueTypeLinkId,
        to_id: await deep.id(
          "@freephoenix888/object-to-links-async-converter",
          "UpdateHandler",
        ),
        in: {
          data: {
            type_id: await deep.id("@deep-foundation/core", "Contain"),
            from_id: ownerLinkId,
            string: { data: { value: "HandleUpdate" } },
          },
        },
      },
    },
  ],
});
```

## How does it look like after convertion?

![image](https://user-images.githubusercontent.com/66206278/230576157-5bcfd0fa-4689-42b8-8ef0-badd7f5397ba.png)  
String/Number/Object values are converted to loop-links which points from and to the same link. Boolean links point from the link to the ["@freephoenix888/boolean", "True"] or ["@freephoenix888/boolean", "False"]

## Limitations

If you delete field in your object value - link associated with that field will not be deleted. We will add this feature as soon as logger package will be ready!

# Feedback

Feel free to open issues to write there about bugs, improvement requests, questions
