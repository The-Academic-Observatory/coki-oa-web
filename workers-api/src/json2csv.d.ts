// Need to include this module definition file as json2csv package is not yet optimisied for Typescript.
// It is an open issue:
// https://github.com/juanjoDiaz/json2csv/issues/1

declare module "@json2csv/plainjs" {
  interface Options<T> {
    fields?: Array<string | FieldInfo<T>> | undefined;
    ndjson?: boolean | undefined;
    defaultValue?: string | undefined;
    quote?: string | undefined;
    escapedQuote?: string | undefined;
    delimiter?: string | undefined;
    eol?: string | undefined;
    excelStrings?: boolean | undefined;
    header?: boolean | undefined;
    includeEmptyRows?: boolean | undefined;
    withBOM?: boolean | undefined;
    transforms?: Array<Json2CsvTransform<any, any>> | undefined;
  }

  export class Parser {
    parse: <T>(data: T[]) => BlobPart;
    constructor(transformOpts?: Options<T>);
  }
}

declare module "@json2csv/transforms" {
  interface UnwindOptions {
    paths: string[] | undefined;
    /** @default false */
    blankOut?: boolean | undefined;
  }

  interface FlattenOptions {
    /** @default true */
    objects?: boolean | undefined;
    /** @default false */
    arrays?: boolean | undefined;
    /** @default '.'' */
    separator?: string | undefined;
  }

  /**
   * Builds a unwinding transform
   *
   * @param options Options to use for unwinding
   * @returns Array of objects containing all rows after unwinding of chosen paths
   */
  export declare function unwind(options?: UnwindOptions): Json2CsvTransform<any, any[]>;

  /**
   * Builds a flattening transform
   *
   * @param options Options to use for flattening
   * @returns Flattening transform
   */
  export declare function flatten(options?: FlattenOptions): Json2CsvTransform<any, any>;
}
