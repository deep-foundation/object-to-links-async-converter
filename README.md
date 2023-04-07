# About
This is `@freephoenix888/object-to-links-async-converter` package for deep  
https://www.npmjs.com/package/@freephoenix888/object-to-links-async-converter

# Feedback
Feel free to open issues to write there about bugs, improvement requests, questions

# FAQ

## How to use?
```ts
const linkWithObjectValueTypeLinkId = ;
conost ownerLinkId = ;
await deep.serial({
  operations: [
    ({
      table: 'links',
      type: 'insert',
      objects: {
        type_id: await deep.id("@deep-foundation/core", "HandleUpdate"),
          from_id: linkWithObjectValueTypeLinkId,
          to_id: await deep.id("@freephoenix888/object-to-links-async-converter", "UpdateHandler"),
        in: {
          data: {
            type_id: await deep.id("@deep-foundation/core", "Contain"),
            from_id: ownerLinkId,
            string: { data: { value: "HandleUpdate" } },
          }
        }
      }
    }),
  ]
})
```
