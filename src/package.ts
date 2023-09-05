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
const dependency@freephoenix888/booleanLinkId = await package["dependency@freephoenix888/boolean"].id();
const booleanTypeLinkId = await package["Boolean"].id();
const objectTypeLinkId = await package["Object"].id();
const numberTypeLinkId = await package["Number"].id();
const stringTypeLinkId = await package["String"].id();
const parseItTypeLinkId = await package["ParseIt"].id();
const parseItInsertHandlerCodeLinkId = await package["parseItInsertHandlerCode"].id();
const propertiesTreeLinkId = await package["propertiesTree"].id();
const treeIncludeFromCurrentObjectLinkId = await package["treeIncludeFromCurrentObject"].id();
const treeIncludeFromCurrentNumberLinkId = await package["treeIncludeFromCurrentNumber"].id();
const treeIncludeFromCurrentStringLinkId = await package["treeIncludeFromCurrentString"].id();
const treeIncludeFromCurrentBooleanLinkId = await package["treeIncludeFromCurrentBoolean"].id();
const parseItInsertHandlerLinkId = await package["parseItInsertHandler"].id();
const handleParseItInsertLinkId = await package["handleParseItInsert"].id();
```

#### Use idLocal method to get the local id of the link
```ts
const package = new Package({deep});
await package.applyMinilinks();
const dependency@freephoenix888/booleanLinkId = package["dependency@freephoenix888/boolean"].idLocal();
const booleanTypeLinkId = package["Boolean"].idLocal();
const objectTypeLinkId = package["Object"].idLocal();
const numberTypeLinkId = package["Number"].idLocal();
const stringTypeLinkId = package["String"].idLocal();
const parseItTypeLinkId = package["ParseIt"].idLocal();
const parseItInsertHandlerCodeLinkId = package["parseItInsertHandlerCode"].idLocal();
const propertiesTreeLinkId = package["propertiesTree"].idLocal();
const treeIncludeFromCurrentObjectLinkId = package["treeIncludeFromCurrentObject"].idLocal();
const treeIncludeFromCurrentNumberLinkId = package["treeIncludeFromCurrentNumber"].idLocal();
const treeIncludeFromCurrentStringLinkId = package["treeIncludeFromCurrentString"].idLocal();
const treeIncludeFromCurrentBooleanLinkId = package["treeIncludeFromCurrentBoolean"].idLocal();
const parseItInsertHandlerLinkId = package["parseItInsertHandler"].idLocal();
const handleParseItInsertLinkId = package["handleParseItInsert"].idLocal();
```
#### Use name field to get the name of the link
```ts
const package = new Package({deep});
const dependency@freephoenix888/boolean = package["dependency@freephoenix888/boolean"].name;
const boolean = package["Boolean"].name;
const object = package["Object"].name;
const number = package["Number"].name;
const string = package["String"].name;
const parseIt = package["ParseIt"].name;
const parseItInsertHandlerCode = package["parseItInsertHandlerCode"].name;
const propertiesTree = package["propertiesTree"].name;
const treeIncludeFromCurrentObject = package["treeIncludeFromCurrentObject"].name;
const treeIncludeFromCurrentNumber = package["treeIncludeFromCurrentNumber"].name;
const treeIncludeFromCurrentString = package["treeIncludeFromCurrentString"].name;
const treeIncludeFromCurrentBoolean = package["treeIncludeFromCurrentBoolean"].name;
const parseItInsertHandler = package["parseItInsertHandler"].name;
const handleParseItInsert = package["handleParseItInsert"].name;
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
      #### Use id method to get the id of the dependency@freephoenix888/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@freephoenix888/booleanLinkId = await package["dependency@freephoenix888/boolean"].id();
      ```
      #### Use localId method to get the local id of the dependency@freephoenix888/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@freephoenix888/booleanLinkId = await package["dependency@freephoenix888/boolean"].localId();
      ```
      #### Use name field to get the name of the dependency@freephoenix888/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@freephoenix888/boolean = await package["dependency@freephoenix888/boolean"].name;
      ```
      */
  public "dependency@freephoenix888/boolean" = this.createEntity(
    "dependency@freephoenix888/boolean",
  );
  /**
      @example
      #### Use id method to get the id of the Boolean link
      ```ts
      const package = new Package({deep});
      const booleanTypeLinkId = await package["Boolean"].id();
      ```
      #### Use localId method to get the local id of the Boolean link
      ```ts
      const package = new Package({deep});
      const booleanTypeLinkId = await package["Boolean"].localId();
      ```
      #### Use name field to get the name of the Boolean link
      ```ts
      const package = new Package({deep});
      const boolean = await package["Boolean"].name;
      ```
      */
  public "Boolean" = this.createEntity("Boolean");
  /**
      @example
      #### Use id method to get the id of the Object link
      ```ts
      const package = new Package({deep});
      const objectTypeLinkId = await package["Object"].id();
      ```
      #### Use localId method to get the local id of the Object link
      ```ts
      const package = new Package({deep});
      const objectTypeLinkId = await package["Object"].localId();
      ```
      #### Use name field to get the name of the Object link
      ```ts
      const package = new Package({deep});
      const object = await package["Object"].name;
      ```
      */
  public "Object" = this.createEntity("Object");
  /**
      @example
      #### Use id method to get the id of the Number link
      ```ts
      const package = new Package({deep});
      const numberTypeLinkId = await package["Number"].id();
      ```
      #### Use localId method to get the local id of the Number link
      ```ts
      const package = new Package({deep});
      const numberTypeLinkId = await package["Number"].localId();
      ```
      #### Use name field to get the name of the Number link
      ```ts
      const package = new Package({deep});
      const number = await package["Number"].name;
      ```
      */
  public "Number" = this.createEntity("Number");
  /**
      @example
      #### Use id method to get the id of the String link
      ```ts
      const package = new Package({deep});
      const stringTypeLinkId = await package["String"].id();
      ```
      #### Use localId method to get the local id of the String link
      ```ts
      const package = new Package({deep});
      const stringTypeLinkId = await package["String"].localId();
      ```
      #### Use name field to get the name of the String link
      ```ts
      const package = new Package({deep});
      const string = await package["String"].name;
      ```
      */
  public "String" = this.createEntity("String");
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
      #### Use id method to get the id of the parseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCodeLinkId = await package["parseItInsertHandlerCode"].id();
      ```
      #### Use localId method to get the local id of the parseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCodeLinkId = await package["parseItInsertHandlerCode"].localId();
      ```
      #### Use name field to get the name of the parseItInsertHandlerCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerCode = await package["parseItInsertHandlerCode"].name;
      ```
      */
  public "parseItInsertHandlerCode" = this.createEntity(
    "parseItInsertHandlerCode",
  );
  /**
      @example
      #### Use id method to get the id of the propertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTreeLinkId = await package["propertiesTree"].id();
      ```
      #### Use localId method to get the local id of the propertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTreeLinkId = await package["propertiesTree"].localId();
      ```
      #### Use name field to get the name of the propertiesTree link
      ```ts
      const package = new Package({deep});
      const propertiesTree = await package["propertiesTree"].name;
      ```
      */
  public "propertiesTree" = this.createEntity("propertiesTree");
  /**
      @example
      #### Use id method to get the id of the treeIncludeFromCurrentObject link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentObjectLinkId = await package["treeIncludeFromCurrentObject"].id();
      ```
      #### Use localId method to get the local id of the treeIncludeFromCurrentObject link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentObjectLinkId = await package["treeIncludeFromCurrentObject"].localId();
      ```
      #### Use name field to get the name of the treeIncludeFromCurrentObject link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentObject = await package["treeIncludeFromCurrentObject"].name;
      ```
      */
  public "treeIncludeFromCurrentObject" = this.createEntity(
    "treeIncludeFromCurrentObject",
  );
  /**
      @example
      #### Use id method to get the id of the treeIncludeFromCurrentNumber link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentNumberLinkId = await package["treeIncludeFromCurrentNumber"].id();
      ```
      #### Use localId method to get the local id of the treeIncludeFromCurrentNumber link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentNumberLinkId = await package["treeIncludeFromCurrentNumber"].localId();
      ```
      #### Use name field to get the name of the treeIncludeFromCurrentNumber link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentNumber = await package["treeIncludeFromCurrentNumber"].name;
      ```
      */
  public "treeIncludeFromCurrentNumber" = this.createEntity(
    "treeIncludeFromCurrentNumber",
  );
  /**
      @example
      #### Use id method to get the id of the treeIncludeFromCurrentString link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentStringLinkId = await package["treeIncludeFromCurrentString"].id();
      ```
      #### Use localId method to get the local id of the treeIncludeFromCurrentString link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentStringLinkId = await package["treeIncludeFromCurrentString"].localId();
      ```
      #### Use name field to get the name of the treeIncludeFromCurrentString link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentString = await package["treeIncludeFromCurrentString"].name;
      ```
      */
  public "treeIncludeFromCurrentString" = this.createEntity(
    "treeIncludeFromCurrentString",
  );
  /**
      @example
      #### Use id method to get the id of the treeIncludeFromCurrentBoolean link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentBooleanLinkId = await package["treeIncludeFromCurrentBoolean"].id();
      ```
      #### Use localId method to get the local id of the treeIncludeFromCurrentBoolean link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentBooleanLinkId = await package["treeIncludeFromCurrentBoolean"].localId();
      ```
      #### Use name field to get the name of the treeIncludeFromCurrentBoolean link
      ```ts
      const package = new Package({deep});
      const treeIncludeFromCurrentBoolean = await package["treeIncludeFromCurrentBoolean"].name;
      ```
      */
  public "treeIncludeFromCurrentBoolean" = this.createEntity(
    "treeIncludeFromCurrentBoolean",
  );
  /**
      @example
      #### Use id method to get the id of the parseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerLinkId = await package["parseItInsertHandler"].id();
      ```
      #### Use localId method to get the local id of the parseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerLinkId = await package["parseItInsertHandler"].localId();
      ```
      #### Use name field to get the name of the parseItInsertHandler link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandler = await package["parseItInsertHandler"].name;
      ```
      */
  public "parseItInsertHandler" = this.createEntity("parseItInsertHandler");
  /**
      @example
      #### Use id method to get the id of the handleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsertLinkId = await package["handleParseItInsert"].id();
      ```
      #### Use localId method to get the local id of the handleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsertLinkId = await package["handleParseItInsert"].localId();
      ```
      #### Use name field to get the name of the handleParseItInsert link
      ```ts
      const package = new Package({deep});
      const handleParseItInsert = await package["handleParseItInsert"].name;
      ```
      */
  public "handleParseItInsert" = this.createEntity("handleParseItInsert");
}

export type PackageOptions = Omit<BasePackageOptions, "name">;
