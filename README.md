# About
This is `@freephoenix888/object-to-links-async-converter` package for deep  
https://www.npmjs.com/package/@freephoenix888/object-to-links-async-converter

# Feedback
Feel free to open issues to write there about bugs, improvement requests, questions

# FAQ

## How to use?
```ts
const linkWithObjectValueTypeLinkId = ; // Type which instances will trigger update handler to convert object value to links
const ownerLinkId = ;
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
## How does it look like after convertion?  
![image](https://user-images.githubusercontent.com/66206278/230576157-5bcfd0fa-4689-42b8-8ef0-badd7f5397ba.png)  
String/Number/Object values are converted to loop-links which points from and to the same link. Boolean links point from the link to the ["@freephoenix888/boolean", "True"] or ["@freephoenix888/boolean", "False"]  
 
