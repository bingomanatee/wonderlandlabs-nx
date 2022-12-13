import type { StopperObj } from '../types';
import { stopperEnum } from "../constants";

export default class Stopper implements StopperObj {
  public state = stopperEnum.continue;

  get isActive() {
    return this.state === stopperEnum.continue;
  }

  get isStopped() {
    return this.state === stopperEnum.stop;
  }

  get isComplete() {
    return this.state !== stopperEnum.continue;
  }

  get isLast() {
    return this.state === stopperEnum.last;
  }

  // change methods

  final() {
    this.state = stopperEnum.last;
  }

  stop() {
    // stop and DO NOT USE the last returned value
    this.state = stopperEnum.stop;
  }

  stopAfterThis() {
    this.final();
  }
}
