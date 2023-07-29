import { IEvent, MachineSaleEvent, MachineRefillEvent, LowStockWarningEvent } from './event';
import { Machine } from './entity';
import { uuidv4 } from './helper';

interface ISubscriber {
  subscriberId(): string;
  handle(event: IEvent): void;
}

abstract class Subscriber implements ISubscriber {
  public machines: Machine[];
  protected readonly _id: string;

  constructor (machines: Machine[]) {
    this._id = uuidv4();
    this.machines = machines;
  }

  subscriberId(): string {
    return this._id;
  }

  abstract handle(event: IEvent): void;
}

class MachineSaleSubscriber extends Subscriber {
  constructor (machines: Machine[]) {
    super(machines);
  }

  handle(event: MachineSaleEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
    const oldStockLevel = this.machines[machineIndex].stockLevel;
    const newStockLevel = oldStockLevel - event.getSoldQuantity();

    this.machines[machineIndex].stockLevel = newStockLevel;

    console.log('MachineSaleEvent - Subscriber ID:', this._id, ', Machine ID:', machineId, ', sold quantity:', event.getSoldQuantity(), ', old stock level:', oldStockLevel, ', new stock level:', newStockLevel);
  }
}

class MachineRefillSubscriber extends Subscriber {
  constructor (machines: Machine[]) {
    super(machines);
  }

  handle(event: MachineRefillEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
    const oldStockLevel = this.machines[machineIndex].stockLevel;
    const newStockLevel = oldStockLevel + event.getRefillQuantity();

    this.machines[machineIndex].stockLevel = newStockLevel;

    console.log('MachineRefillEvent - Subscriber ID:', this._id, ', Machine ID:', machineId, ', refill quantity:', event.getRefillQuantity(), ', old stock level:', oldStockLevel, ', new stock level:', newStockLevel);
  }
}

class LowStockWarningSubscriber extends Subscriber {
  constructor (machines: Machine[]) {
    super(machines);
  }

  handle(event: LowStockWarningEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
    const stockLevel = this.machines[machineIndex].stockLevel;

    console.log('LowStockWarningEvent - Subscriber ID:', this._id, ', Machine ID:', machineId, ', stock level:', stockLevel);
  }
}

class StockLevelOkSubscriber extends Subscriber {
  constructor (machines: Machine[]) {
    super(machines);
  }

  subscriberId(): string {
    return this._id;
  }

  handle(event: LowStockWarningEvent): void {
    const machineId = event.machineId();
    const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
    const stockLevel = this.machines[machineIndex].stockLevel;

    console.log('StockLevelOkEvent - Subscriber ID:', this._id, ', Machine ID:', machineId, ', stock level:', stockLevel);
  }
}

export {
  ISubscriber,
  MachineSaleSubscriber,
  MachineRefillSubscriber,
  LowStockWarningSubscriber,
  StockLevelOkSubscriber,
}