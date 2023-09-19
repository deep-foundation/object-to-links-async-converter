[![npm](https://img.shields.io/npm/v/@deep-foundation/object-to-links-async-converter.svg)](https://www.npmjs.com/package/@deep-foundation/object-to-links-async-converter)
[![Gitpod](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/deep-foundation/object-to-links-async-converter)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A deep package for converting object to links

# Usage

1. Install the package
2. Give permissions to the package
3. Insert `Root` link
4. Update object value of `Root` link
5. Insert `ParseIt` link from `Root` to `Root`
6. See links created around `Root` link

# FAQ

## Must I use `Root` type

It is not required to use `Root` type but it is recommended to use it because this type is added to the tree. If you want to use your own type you should add it to tree of this package by using `TreeIncludeNode`

## Must `ParseIt.from` and `ParseIt.to` be equal?

`ParseIt.from` must point to a link with object value, `ParseIt.to` can point to any link and new links will be created around `ParseIt.to`

## How new links will look like?

Let us imagine we have this object and it is called `MyLink`:

```json
{
  "myObject": {
    "myStringField": "myStringValue",
    "myNumberField": 123,
    "myBooleanField": true
  }
}
```

These links will be created:
`Object` around `MyLink` (`from` and `to` are pointing to your link)
`Contain` with value `myObject` from `MyLink` to `Object`
`String` with value `myStringValue` from `Object` to `Object`
`Contain` with value `myStringField` from `Object` to `String`
`Number` with value `123` from `Object` to `Object`
`Contain` with value `myNumberField` from `Object` to `Number`
`Boolean` from `Object` to `true` or `false` (from the `@deep-foundation/boolean` package)
`Contain` with value `myBooleanField` from `Object` to `Boolean`

## Limitations

If you delete field in your object value and parse it again - link associated with that field will not be deleted. This feature will be implemented in the future!

# Feedback

Feel free to open issues to write there about bugs, improvement requests, questions
