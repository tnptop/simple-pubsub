import * as constant from "./constant"

interface IEvent {
  machineId(): string;
  type(): string;
  timestamp: number;
}

class MachineSaleEvent implements IEvent {
  public timestamp: number;

  constructor(private readonly _sold: number, private readonly _machineId: string) {
    this.timestamp = Date.now().valueOf();
  }

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): string {
    return constant.MACHINE_SALE_EVENT;
  }
}

class MachineRefillEvent implements IEvent {
  public timestamp: number;

  constructor(private readonly _refill: number, private readonly _machineId: string) {
    this.timestamp = Date.now().valueOf()
  }

  machineId(): string {
    return this._machineId;
  }

  getRefillQuantity(): number {
    return this._refill;
  }

  type(): string {
    return constant.MACHINE_REFILL_EVENT;
  }
}

class LowStockWarningEvent implements IEvent {
  public timestamp: number;

  constructor(private readonly _machineId: string) {
    this.timestamp = Date.now().valueOf();
  }

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return constant.LOW_STOCK_WARNING_EVENT;
  }
}

class StockLevelOkEvent implements IEvent {
  public timestamp: number;

  constructor(private readonly _machineId: string) {
    this.timestamp = Date.now().valueOf();
  }

  machineId(): string {
    return this._machineId;
  }

  type(): string {
    return constant.STOCK_LEVEL_OK_EVENT;
  }
}

export {
  IEvent,
  MachineSaleEvent,
  MachineRefillEvent,
  LowStockWarningEvent,
  StockLevelOkEvent,
}