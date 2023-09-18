export type AllowedPrimitive = string | number | boolean;

export interface AllowedObject {
  [key: string]: AllowedValue;
}

export type AllowedArray = Array<AllowedValue>;

export type AllowedValue = AllowedPrimitive | AllowedObject | AllowedArray;
