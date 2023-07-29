"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockLevelOkSubscriber = exports.LowStockWarningSubscriber = exports.MachineRefillSubscriber = exports.MachineSaleSubscriber = void 0;
const event_1 = require("./event");
const helper_1 = require("./helper");
class Subscriber {
    constructor(machines) {
        this._id = (0, helper_1.uuidv4)();
        this.machines = machines;
    }
    subscriberId() {
        return this._id;
    }
}
class MachineSaleSubscriber extends Subscriber {
    constructor(machines, pubSubService) {
        super(machines);
        this.pubSubService = pubSubService;
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        const oldStockLevel = this.machines[machineIndex].stockLevel;
        const newStockLevel = oldStockLevel - event.getSoldQuantity();
        this.machines[machineIndex].stockLevel = newStockLevel;
        console.log("MachineSaleEvent - Subscriber ID:", this._id, ", Machine ID:", machineId, ", sold quantity:", event.getSoldQuantity(), ", old stock level:", oldStockLevel, ", new stock level:", newStockLevel);
        if (newStockLevel < 3) {
            this.pubSubService.publish(new event_1.LowStockWarningEvent(machineId));
        }
    }
}
exports.MachineSaleSubscriber = MachineSaleSubscriber;
class MachineRefillSubscriber extends Subscriber {
    constructor(machines, pubSubService) {
        super(machines);
        this.pubSubService = pubSubService;
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        const oldStockLevel = this.machines[machineIndex].stockLevel;
        const newStockLevel = oldStockLevel + event.getRefillQuantity();
        this.machines[machineIndex].stockLevel = newStockLevel;
        console.log("MachineRefillEvent - Subscriber ID:", this._id, ", Machine ID:", machineId, ", refill quantity:", event.getRefillQuantity(), ", old stock level:", oldStockLevel, ", new stock level:", newStockLevel);
        if (newStockLevel >= 3) {
            this.pubSubService.publish(new event_1.StockLevelOkEvent(machineId));
        }
    }
}
exports.MachineRefillSubscriber = MachineRefillSubscriber;
class LowStockWarningSubscriber extends Subscriber {
    constructor(machines) {
        super(machines);
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        const stockLevel = this.machines[machineIndex].stockLevel;
        console.log("LowStockWarningEvent - Subscriber ID:", this._id, ", Machine ID:", machineId, ", stock level:", stockLevel);
    }
}
exports.LowStockWarningSubscriber = LowStockWarningSubscriber;
class StockLevelOkSubscriber extends Subscriber {
    constructor(machines) {
        super(machines);
    }
    subscriberId() {
        return this._id;
    }
    handle(event) {
        const machineId = event.machineId();
        const machineIndex = this.machines.findIndex(machine => machine.id === machineId);
        const stockLevel = this.machines[machineIndex].stockLevel;
        console.log("StockLevelOkEvent - Subscriber ID:", this._id, ", Machine ID:", machineId, ", stock level:", stockLevel);
    }
}
exports.StockLevelOkSubscriber = StockLevelOkSubscriber;
