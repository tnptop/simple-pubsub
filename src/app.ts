// interfaces
interface IEvent {
  type(): string;
  machineId(): string;
}

interface ISubscriber {
  handle(event: IEvent): void;
  subscriberId(): string;
}

interface IPublishSubscribeService {
  publish (event: IEvent): void;
  subscribe (type: string, handler: ISubscriber): void;
  unsubscribe (type: string, handler: ISubscriber): void;
}


// implementations
class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): string {
    return 'sale';
  }
}

class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId;
  }

  getRefillQuantity(): number {
    return this._refill;
  }

  type(): string {
    return 'refill';
  }
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

class MachinePublishSubscribeService implements IPublishSubscribeService {
  private eventSubscriberMap: Map<string, ISubscriber[]>;

  constructor () {
    this.eventSubscriberMap = new Map<string, ISubscriber[]>();
  }

  publish(event: IEvent): void {
    const eventType = event.type();
    const handlers: ISubscriber[] = this.eventSubscriberMap.get(eventType) ?? [];

    handlers.forEach(handler => handler.handle(event));
  }

  subscribe(type: string, handler: ISubscriber): void {
    const handlers: ISubscriber[] = this.eventSubscriberMap.get(type) ?? [];
    this.eventSubscriberMap.set(type, handlers.concat(handler));
  }

  unsubscribe(type: string, handler: ISubscriber): void {
    let handlers: ISubscriber[] = this.eventSubscriberMap.get(type) ?? [];
    const handlerIndex = handlers.findIndex(
      activeHandler => activeHandler.subscriberId() === handler.subscriberId()
    );
    handlers.splice(handlerIndex, 1);

    this.eventSubscriberMap.set(type, handlers);
  }
}


// objects
class Machine {
  public stockLevel = 10;
  public id: string;

  constructor (id: string) {
    this.id = id;
  }
}


// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';

}

const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}

const uuidv4 = (): string => {
  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4;
  uuid[19] = uuid[19] &= ~(1 << 2);
  uuid[19] = uuid[19] |= (1 << 3);
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  return uuid.map((x) => x.toString(16)).join('');  
}


// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [ new Machine('001'), new Machine('002'), new Machine('003') ];

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber: MachineSaleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber: MachineRefillSubscriber = new MachineRefillSubscriber(machines);

  // create the PubSub service
  const pubSubService: MachinePublishSubscribeService = new MachinePublishSubscribeService();
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);

  // create 5 random events
  const events = [1,2,3,4,5].map(i => eventGenerator());

  // publish the events
  events.map(event => pubSubService.publish(event));
})();
