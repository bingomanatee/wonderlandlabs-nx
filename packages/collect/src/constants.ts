export enum booleanMode {
  byValue = 'value',
  byKey = 'key',
  byBoth = 'both',
}

export enum stopperEnum {
  continue,
  last, // process the return value, but stop iteration
  stop, // do not process the return value - stop immediately
}
