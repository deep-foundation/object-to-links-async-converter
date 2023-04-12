# object-to-links-async-converter
[NPM](https://www.npmjs.com/package/@freephoenix888/object-to-links-async-converter)

# About
This package is used to convert object values to links for specific types you are going to choose on your own

# Feedback
Feel free to open issues to write there about bugs, improvement requests, questions

# FAQ

## How to use?
1. Install the package
2. Give permissions to the package
```ts
const joinTypeLinkId = await deep.id("@deep-foundation/core", "Join");
const packageLinkId = await deep.id("@freephoenix888/object-to-links-async-converter");
await deep.insert([
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id('deep', 'users', 'packages'),
  },
  {
    type_id: joinTypeLinkId,
    from_id: packageLinkId,
    to_id: await deep.id('deep', 'admin'),
  },
])
```
3. Insert `HandleUpdate` which points from handler from this package to the type that is going to be handler (links of your type will be processed by this package to convert their object values to links)
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
 
