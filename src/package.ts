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
const propertiesTreeLinkId = await package["propertiesTree"].id();
const hasResultTypeLinkId = await package["HasResult"].id();
const treeIncludeDownHasResultLinkId = await package["treeIncludeDownHasResult"].id();
const rootTypeLinkId = await package["Root"].id();
const rootValueLinkId = await package["rootValue"].id();
const parseItInsertHandlerTranspiledCodeLinkId = await package["parseItInsertHandlerTranspiledCode"].id();
const dependency@deep-foundation/booleanLinkId = await package["dependency@deep-foundation/boolean"].id();
const booleanTypeLinkId = await package["Boolean"].id();
const objectTypeLinkId = await package["Object"].id();
const treeIncludeFromCurrentObjectLinkId = await package["treeIncludeFromCurrentObject"].id();
const numberTypeLinkId = await package["Number"].id();
const treeIncludeFromCurrentNumberLinkId = await package["treeIncludeFromCurrentNumber"].id();
const stringTypeLinkId = await package["String"].id();
const treeIncludeFromCurrentStringLinkId = await package["treeIncludeFromCurrentString"].id();
const parseItTypeLinkId = await package["ParseIt"].id();
const treeIncludeFromCurrentBooleanLinkId = await package["treeIncludeFromCurrentBoolean"].id();
const clientHandlerCodeLinkId = await package["clientHandlerCode"].id();
const clientHandlerLinkId = await package["clientHandler"].id();
const parseItInsertHandlerLinkId = await package["parseItInsertHandler"].id();
const handleParseItInsertLinkId = await package["handleParseItInsert"].id();
const parseItInsertHandlerCodeLinkId = await package["parseItInsertHandlerCode"].id();
const parseItInsertHandlerTranspiledCodeGeneratedFromLinkId = await package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].id();
```

#### Use idLocal method to get the local id of the link
```ts
const package = new Package({deep});
await package.applyMinilinks();
const propertiesTreeLinkId = package["propertiesTree"].idLocal();
const hasResultTypeLinkId = package["HasResult"].idLocal();
const treeIncludeDownHasResultLinkId = package["treeIncludeDownHasResult"].idLocal();
const rootTypeLinkId = package["Root"].idLocal();
const rootValueLinkId = package["rootValue"].idLocal();
const parseItInsertHandlerTranspiledCodeLinkId = package["parseItInsertHandlerTranspiledCode"].idLocal();
const dependency@deep-foundation/booleanLinkId = package["dependency@deep-foundation/boolean"].idLocal();
const booleanTypeLinkId = package["Boolean"].idLocal();
const objectTypeLinkId = package["Object"].idLocal();
const treeIncludeFromCurrentObjectLinkId = package["treeIncludeFromCurrentObject"].idLocal();
const numberTypeLinkId = package["Number"].idLocal();
const treeIncludeFromCurrentNumberLinkId = package["treeIncludeFromCurrentNumber"].idLocal();
const stringTypeLinkId = package["String"].idLocal();
const treeIncludeFromCurrentStringLinkId = package["treeIncludeFromCurrentString"].idLocal();
const parseItTypeLinkId = package["ParseIt"].idLocal();
const treeIncludeFromCurrentBooleanLinkId = package["treeIncludeFromCurrentBoolean"].idLocal();
const clientHandlerCodeLinkId = package["clientHandlerCode"].idLocal();
const clientHandlerLinkId = package["clientHandler"].idLocal();
const parseItInsertHandlerLinkId = package["parseItInsertHandler"].idLocal();
const handleParseItInsertLinkId = package["handleParseItInsert"].idLocal();
const parseItInsertHandlerCodeLinkId = package["parseItInsertHandlerCode"].idLocal();
const parseItInsertHandlerTranspiledCodeGeneratedFromLinkId = package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].idLocal();
```
#### Use name field to get the name of the link
```ts
const package = new Package({deep});
const propertiesTree = package["propertiesTree"].name;
const hasResult = package["HasResult"].name;
const treeIncludeDownHasResult = package["treeIncludeDownHasResult"].name;
const root = package["Root"].name;
const rootValue = package["rootValue"].name;
const parseItInsertHandlerTranspiledCode = package["parseItInsertHandlerTranspiledCode"].name;
const dependency@deep-foundation/boolean = package["dependency@deep-foundation/boolean"].name;
const boolean = package["Boolean"].name;
const object = package["Object"].name;
const treeIncludeFromCurrentObject = package["treeIncludeFromCurrentObject"].name;
const number = package["Number"].name;
const treeIncludeFromCurrentNumber = package["treeIncludeFromCurrentNumber"].name;
const string = package["String"].name;
const treeIncludeFromCurrentString = package["treeIncludeFromCurrentString"].name;
const parseIt = package["ParseIt"].name;
const treeIncludeFromCurrentBoolean = package["treeIncludeFromCurrentBoolean"].name;
const clientHandlerCode = package["clientHandlerCode"].name;
const clientHandler = package["clientHandler"].name;
const parseItInsertHandler = package["parseItInsertHandler"].name;
const handleParseItInsert = package["handleParseItInsert"].name;
const parseItInsertHandlerCode = package["parseItInsertHandlerCode"].name;
const parseItInsertHandlerTranspiledCodeGeneratedFrom = package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].name;
```
*/
export class Package extends BasePackage {
  constructor(param: PackageOptions) {
    super({
      ...param,
      name: "@deep-foundation/object-to-links-async-converter",
    });
  }

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
      #### Use id method to get the id of the HasResult link
      ```ts
      const package = new Package({deep});
      const hasResultTypeLinkId = await package["HasResult"].id();
      ```
      #### Use localId method to get the local id of the HasResult link
      ```ts
      const package = new Package({deep});
      const hasResultTypeLinkId = await package["HasResult"].localId();
      ```
      #### Use name field to get the name of the HasResult link
      ```ts
      const package = new Package({deep});
      const hasResult = await package["HasResult"].name;
      ```
      */
  public "HasResult" = this.createEntity("HasResult");
  /**
      @example
      #### Use id method to get the id of the treeIncludeDownHasResult link
      ```ts
      const package = new Package({deep});
      const treeIncludeDownHasResultLinkId = await package["treeIncludeDownHasResult"].id();
      ```
      #### Use localId method to get the local id of the treeIncludeDownHasResult link
      ```ts
      const package = new Package({deep});
      const treeIncludeDownHasResultLinkId = await package["treeIncludeDownHasResult"].localId();
      ```
      #### Use name field to get the name of the treeIncludeDownHasResult link
      ```ts
      const package = new Package({deep});
      const treeIncludeDownHasResult = await package["treeIncludeDownHasResult"].name;
      ```
      */
  public "treeIncludeDownHasResult" = this.createEntity(
    "treeIncludeDownHasResult",
  );
  /**
      @example
      #### Use id method to get the id of the Root link
      ```ts
      const package = new Package({deep});
      const rootTypeLinkId = await package["Root"].id();
      ```
      #### Use localId method to get the local id of the Root link
      ```ts
      const package = new Package({deep});
      const rootTypeLinkId = await package["Root"].localId();
      ```
      #### Use name field to get the name of the Root link
      ```ts
      const package = new Package({deep});
      const root = await package["Root"].name;
      ```
      */
  public "Root" = this.createEntity("Root");
  /**
      @example
      #### Use id method to get the id of the rootValue link
      ```ts
      const package = new Package({deep});
      const rootValueLinkId = await package["rootValue"].id();
      ```
      #### Use localId method to get the local id of the rootValue link
      ```ts
      const package = new Package({deep});
      const rootValueLinkId = await package["rootValue"].localId();
      ```
      #### Use name field to get the name of the rootValue link
      ```ts
      const package = new Package({deep});
      const rootValue = await package["rootValue"].name;
      ```
      */
  public "rootValue" = this.createEntity("rootValue");
  /**
      @example
      #### Use id method to get the id of the parseItInsertHandlerTranspiledCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCodeLinkId = await package["parseItInsertHandlerTranspiledCode"].id();
      ```
      #### Use localId method to get the local id of the parseItInsertHandlerTranspiledCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCodeLinkId = await package["parseItInsertHandlerTranspiledCode"].localId();
      ```
      #### Use name field to get the name of the parseItInsertHandlerTranspiledCode link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCode = await package["parseItInsertHandlerTranspiledCode"].name;
      ```
      */
  public "parseItInsertHandlerTranspiledCode" = this.createEntity(
    "parseItInsertHandlerTranspiledCode",
  );
  /**
      @example
      #### Use id method to get the id of the dependency@deep-foundation/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@deep-foundation/booleanLinkId = await package["dependency@deep-foundation/boolean"].id();
      ```
      #### Use localId method to get the local id of the dependency@deep-foundation/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@deep-foundation/booleanLinkId = await package["dependency@deep-foundation/boolean"].localId();
      ```
      #### Use name field to get the name of the dependency@deep-foundation/boolean link
      ```ts
      const package = new Package({deep});
      const dependency@deep-foundation/boolean = await package["dependency@deep-foundation/boolean"].name;
      ```
      */
  public "dependency@deep-foundation/boolean" = this.createEntity(
    "dependency@deep-foundation/boolean",
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
      #### Use id method to get the id of the clientHandlerCode link
      ```ts
      const package = new Package({deep});
      const clientHandlerCodeLinkId = await package["clientHandlerCode"].id();
      ```
      #### Use localId method to get the local id of the clientHandlerCode link
      ```ts
      const package = new Package({deep});
      const clientHandlerCodeLinkId = await package["clientHandlerCode"].localId();
      ```
      #### Use name field to get the name of the clientHandlerCode link
      ```ts
      const package = new Package({deep});
      const clientHandlerCode = await package["clientHandlerCode"].name;
      ```
      */
  public "clientHandlerCode" = this.createEntity("clientHandlerCode");
  /**
      @example
      #### Use id method to get the id of the clientHandler link
      ```ts
      const package = new Package({deep});
      const clientHandlerLinkId = await package["clientHandler"].id();
      ```
      #### Use localId method to get the local id of the clientHandler link
      ```ts
      const package = new Package({deep});
      const clientHandlerLinkId = await package["clientHandler"].localId();
      ```
      #### Use name field to get the name of the clientHandler link
      ```ts
      const package = new Package({deep});
      const clientHandler = await package["clientHandler"].name;
      ```
      */
  public "clientHandler" = this.createEntity("clientHandler");
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
      #### Use id method to get the id of the parseItInsertHandlerTranspiledCodeGeneratedFrom link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCodeGeneratedFromLinkId = await package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].id();
      ```
      #### Use localId method to get the local id of the parseItInsertHandlerTranspiledCodeGeneratedFrom link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCodeGeneratedFromLinkId = await package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].localId();
      ```
      #### Use name field to get the name of the parseItInsertHandlerTranspiledCodeGeneratedFrom link
      ```ts
      const package = new Package({deep});
      const parseItInsertHandlerTranspiledCodeGeneratedFrom = await package["parseItInsertHandlerTranspiledCodeGeneratedFrom"].name;
      ```
      */
  public "parseItInsertHandlerTranspiledCodeGeneratedFrom" = this.createEntity(
    "parseItInsertHandlerTranspiledCodeGeneratedFrom",
  );
}

export type PackageOptions = Omit<BasePackageOptions, "name">;
