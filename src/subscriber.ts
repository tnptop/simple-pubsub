import { IEvent, MachineSaleEvent, MachineRefillEvent, LowStockWarningEvent } from './event';
import { Machine } from './entity';
import { uuidv4 } from './helper';

interface ISubscriber {
  handle(event: IEvent): void;
  subscriberId(): string;
}

class MachineSaleSubscriber implements ISubscriber {
  public machines: Machine[];
  private readonly _id: string;

  constructor (machines: Machine[]) {
    this._id = uuidv4();
    this.machines = machines; 
  }

  subscriberId(): string {
    return this._id;
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

class MachineRefillSubscriber implements ISubscriber {
  public machines: Machine[];
  private readonly _id: string;

  constructor (machines: Machine[]) {
    this._id = uuidv4();
    this.machines = machines;
  }

  subscriberId(): string {
    return this._id;
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

class LowStockWarningSubscriber implements ISubscriber {
  public machines: Machine[];
  private readonly _id: string;

  constructor (machines: Machine[]) {
    this._id = uuidv4();
    this.machines = machines;
  }

  subscriberId(): string {
    return this._id;
  }

  handler(event: LowStockWarningEvent): void {

  }
}

export {
  ISubscriber,
  MachineSaleSubscriber,
  MachineRefillSubscriber,
  LowStockWarningSubscriber,
}