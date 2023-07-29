"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockLevelOkEvent = exports.LowStockWarningEvent = exports.MachineRefillEvent = exports.MachineSaleEvent = void 0;
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
exports.MachineSaleEvent = MachineSaleEvent;
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
exports.MachineRefillEvent = MachineRefillEvent;
class LowStockWarningEvent {
    constructor(_machineId) {
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    type() {
        return 'low_stock';
    }
}
exports.LowStockWarningEvent = LowStockWarningEvent;
class StockLevelOkEvent {
    constructor(_machineId) {
        this._machineId = _machineId;
    }
    machineId() {
        return this._machineId;
    }
    type() {
        return 'stock_ok';
    }
}
exports.StockLevelOkEvent = StockLevelOkEvent;
