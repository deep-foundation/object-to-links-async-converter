import {
  Package as BasePackage,
  PackageOptions as BasePackageOptions,
} from "@deep-foundation/deeplinks/imports/package.js";

/**
Represents a deep package

@remarks
Contains name of the package and all the links as the objects with id method which returns the id of the link.

@example
#### Use name field to get the name of the package
```ts
const package = new Package({deep});
const {name: packageName} = package;
```
#### Use id method to get the id of the link
```ts
const package = new Package({deep});
const @freephoenix888/booleanDependencyTypeLinkId = await package["@freephoenix888/booleanDependency"].id();
const parseItTypeLinkId = await package["ParseIt"].id();
const parseItInsertHandlerCodeTypeLinkId = await package["ParseItInsertHandlerCode"].id();
const propertiesTreeTypeLinkId = await package["PropertiesTree"].id();
const propertiesTreeIncludeNodeAnyTypeLinkId = await package["PropertiesTreeIncludeNodeAny"].id();
const propertyTypeLinkId = await package["Property"].id();
const propertiesTreeIncludeFromCurrentPropertyTypeLinkId = await package["PropertiesTreeIncludeFromCurrentProperty"].id();
const parseItInsertHandlerTypeLinkId = await package["ParseItInsertHandler"].id();
const handleParseItInsertTypeLinkId = await package["HandleParseItInsert"].id();
```

#### Use idLocal method to get the local id of the link
```ts
const package = new Package({deep});
await package.applyMinilinks();
const @freephoenix888/booleanDependencyTypeLinkId = package["@freephoenix888/booleanDependency"].idLocal();
const parseItTypeLinkId = package["ParseIt"].idLocal();
const parseItInsertHandlerCodeTypeLinkId = package["ParseItInsertHandlerCode"].idLocal();
const propertiesTreeTypeLinkId = package["PropertiesTree"].idLocal();
const propertiesTreeIncludeNodeAnyTypeLinkId = package["PropertiesTreeIncludeNodeAny"].idLocal();
const propertyTypeLinkId = package["Property"].idLocal();
const propertiesTreeIncludeFromCurrentPropertyTypeLinkId = package["PropertiesTreeIncludeFromCurrentProperty"].idLocal();
const parseItInsertHandlerTypeLinkId = package["ParseItInsertHandler"].idLocal();
const handleParseItInsertTypeLinkId = package["HandleParseItInsert"].idLocal();
```
#### Use name field to get the name of the link
```ts
const package = new Package({deep});
const @freephoenix888/booleanDependency = package["@freephoenix888/booleanDependency"].name;
const parseIt = package["ParseIt"].name;
const parseItInsertHandlerCode = package["ParseItInsertHandlerCode"].name;
const propertiesTree = package["PropertiesTree"].name;
const propertiesTreeIncludeNodeAny = package["PropertiesTreeIncludeNodeAny"].name;
const property = package["Property"].name;
const propertiesTreeIncludeFromCurrentProperty = package["PropertiesTreeIncludeFromCurrentProperty"].name;
const parseItInsertHandler = package["ParseItInsertHandler"].name;
const handleParseItInsert = package["HandleParseItInsert"].name;
```
*/
export class Package extends BasePackage {
  constructor(param: PackageOptions) {
    super({
      ...param,
      name: "@freephoenix888/object-to-links-async-converter",
    });
  }

  /**
      @example
      #### Use id method to get the id of the @freephoenix888/booleanDependency link
      ```ts
      const package = new Package({deep});
      const @freephoenix888/booleanDependencyTypeLinkId = await package["@freephoenix888/booleanDependency"].id();
      ```
      #### Use localId method to get the local id of the @freephoenix888/booleanDependency link
      ```ts
      const package = new Package({deep});
      const @freephoenix888/booleanDependencyTypeLinkId = await package["@freephoenix888/booleanDependency"].localId();
      ```
      #### Use name field to get the name of the @freephoenix888/booleanDependency link
      ```ts
      const package = new Package({deep});
      const @freephoenix888/booleanDependency = await package["@freephoenix888/booleanDependency"].name;
      ```
      */
  public "@freephoenix888/booleanDependency" = this.createEntity(
    "@freephoenix888/booleanDependency",
  );
  /**
      @example
      #### Use id method to get the id of the ParseIt link
      ```ts
      const package = new Package({deep});
      const parseItTypeLinkId = await package["ParseIt"].id();
      ```
      #### Use localId method to get the local id of the ParseIt link
      ```ts
      const package = new Package({deep});
      const parseItTypeLinkId = await package["ParseIt"].localId();
      ```
      #### Use name field to get the name of the ParseIt link
      ```ts
      const package = new Package({deep});
      const parseIt = await package["ParseIt"].name;
      ```
      */
  public "ParseIt" = this.createEntity("ParseIt");
  /**
      @example
      #### Use id method to get the id of the ParseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCodeTypeLinkId = await package["ParseItInsertHandlerCode"].id();
      ```
      #### Use localId method to get the local id of the ParseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCodeTypeLinkId = await package["ParseItInsertHandlerCode"].localId();
      ```
      #### Use name field to get the name of the ParseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCode = await package["ParseItInsertHandlerCode"].name;
      ```
      */
  public "ParseItInsertHandlerCode" = this.createEntity(
    "ParseItInsertHandlerCode",
  );
  /**
      @example
      #### Use id method to get the id of the PropertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTreeTypeLinkId = await package["PropertiesTree"].id();
      ```
      #### Use localId method to get the local id of the PropertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTreeTypeLinkId = await package["PropertiesTree"].localId();
      ```
      #### Use name field to get the name of the PropertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTree = await package["PropertiesTree"].name;
      ```
      */
  public "PropertiesTree" = this.createEntity("PropertiesTree");
  /**
      @example
      #### Use id method to get the id of the PropertiesTreeIncludeNodeAny link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeNodeAnyTypeLinkId = await package["PropertiesTreeIncludeNodeAny"].id();
      ```
      #### Use localId method to get the local id of the PropertiesTreeIncludeNodeAny link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeNodeAnyTypeLinkId = await package["PropertiesTreeIncludeNodeAny"].localId();
      ```
      #### Use name field to get the name of the PropertiesTreeIncludeNodeAny link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeNodeAny = await package["PropertiesTreeIncludeNodeAny"].name;
      ```
      */
  public "PropertiesTreeIncludeNodeAny" = this.createEntity(
    "PropertiesTreeIncludeNodeAny",
  );
  /**
      @example
      #### Use id method to get the id of the Property link
      ```ts
      const package = new Package({deep});
      const propertyTypeLinkId = await package["Property"].id();
      ```
      #### Use localId method to get the local id of the Property link
      ```ts
      const package = new Package({deep});
      const propertyTypeLinkId = await package["Property"].localId();
      ```
      #### Use name field to get the name of the Property link
      ```ts
      const package = new Package({deep});
      const property = await package["Property"].name;
      ```
      */
  public "Property" = this.createEntity("Property");
  /**
      @example
      #### Use id method to get the id of the PropertiesTreeIncludeFromCurrentProperty link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeFromCurrentPropertyTypeLinkId = await package["PropertiesTreeIncludeFromCurrentProperty"].id();
      ```
      #### Use localId method to get the local id of the PropertiesTreeIncludeFromCurrentProperty link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeFromCurrentPropertyTypeLinkId = await package["PropertiesTreeIncludeFromCurrentProperty"].localId();
      ```
      #### Use name field to get the name of the PropertiesTreeIncludeFromCurrentProperty link
      ```ts
      const package = new Package({deep});
      const propertiesTreeIncludeFromCurrentProperty = await package["PropertiesTreeIncludeFromCurrentProperty"].name;
      ```
      */
  public "PropertiesTreeIncludeFromCurrentProperty" = this.createEntity(
    "PropertiesTreeIncludeFromCurrentProperty",
  );
  /**
      @example
      #### Use id method to get the id of the ParseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTypeLinkId = await package["ParseItInsertHandler"].id();
      ```
      #### Use localId method to get the local id of the ParseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTypeLinkId = await package["ParseItInsertHandler"].localId();
      ```
      #### Use name field to get the name of the ParseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandler = await package["ParseItInsertHandler"].name;
      ```
      */
  public "ParseItInsertHandler" = this.createEntity("ParseItInsertHandler");
  /**
      @example
      #### Use id method to get the id of the HandleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsertTypeLinkId = await package["HandleParseItInsert"].id();
      ```
      #### Use localId method to get the local id of the HandleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsertTypeLinkId = await package["HandleParseItInsert"].localId();
      ```
      #### Use name field to get the name of the HandleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsert = await package["HandleParseItInsert"].name;
      ```
      */
  public "HandleParseItInsert" = this.createEntity("HandleParseItInsert");
}

export type PackageOptions = Omit<BasePackageOptions, "name">;
