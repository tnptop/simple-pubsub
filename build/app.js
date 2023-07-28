"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// implementations
class MachineSaleEvent {
    constructor(_sold, _machineId) {
        this._sold = _sold;
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    getSoldQuantity() {
        return this._sold;
    }
    type() {
        return 'sale';
    }
}
class MachineRefillEvent {
    constructor(_refill, _machineId) {
        this._refill = _refill;
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    getRefillQuantity() {
        return this._refill;
    }
    type() {
        return 'refill';
    }
}
class MachineSaleSubscriber {
    constructor(machines) {
        this.machines = machines;
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        this.machines[machineIndex].stockLevel -= event.getSoldQuantity();
        console.log('sale', this.machines);
    }
}
class MachineRefillSubscriber {
    constructor(machines) {
        this.machines = machines;
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        this.machines[machineIndex].stockLevel += event.getRefillQuantity();
        console.log('refill', this.machines);
    }
}
class MachinePublishSubscribeService {
    constructor() {
        this.eventSubscriberMap = new Map();
    }
    publish(event) {
        var _a;
        const eventType = event.type();
        const handlers = (_a = this.eventSubscriberMap.get(eventType)) !== null && _a !== void 0 ? _a : [];
        handlers.forEach(handler => handler.handle(event));
    }
    subscribe(type, handler) {
        var _a;
        const handlers = (_a = this.eventSubscriberMap.get(type)) !== null && _a !== void 0 ? _a : [];
        this.eventSubscriberMap.set(type, handlers.concat(handler));
    }
}
// objects
class Machine {
    constructor(id) {
        this.stockLevel = 10;
        this.id = id;
    }
}
// helpers
const randomMachine = () => {
    const random = Math.random() * 3;
    if (random < 1) {
        return '001';
    }
    else if (random < 2) {
        return '002';
    }
    return '003';
};
const eventGenerator = () => {
    const random = Math.random();
    if (random < 0.5) {
        const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
        return new MachineSaleEvent(saleQty, randomMachine());
    }
    const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new MachineRefillEvent(refillQty, randomMachine());
};
// program
(() => __awaiter(void 0, void 0, void 0, function* () {
    // create 3 machines with a quantity of 10 stock
    const machines = [new Machine('001'), new Machine('002'), new Machine('003')];
    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new MachineSaleSubscriber(machines);
    const refillSubscriber = new MachineRefillSubscriber(machines);
    // create the PubSub service
    const pubSubService = new MachinePublishSubscribeService();
    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber);
    // create 5 random events
    const events = [1, 2, 3, 4, 5].map(i => eventGenerator());
    // publish the events
    events.map(event => pubSubService.publish(event));
}))();
