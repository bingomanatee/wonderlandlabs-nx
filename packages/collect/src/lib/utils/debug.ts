export abstract class Debug {
  static create = false;
  static icReducer = true;
  static init() {
    Debug.create = false;
    Debug.icReducer = false;
  }
}
