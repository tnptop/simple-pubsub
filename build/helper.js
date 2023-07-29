"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidv4 = exports.eventGenerator = exports.randomMachine = void 0;
const event_1 = require("./event");
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
exports.randomMachine = randomMachine;
const eventGenerator = () => {
    const random = Math.random();
    if (random < 0.5) {
        const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
        return new event_1.MachineSaleEvent(saleQty, (0, exports.randomMachine)());
    }
    const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
    return new event_1.MachineRefillEvent(refillQty, (0, exports.randomMachine)());
};
exports.eventGenerator = eventGenerator;
const uuidv4 = () => {
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4;
    uuid[19] = uuid[19] &= ~(1 << 2);
    uuid[19] = uuid[19] |= (1 << 3);
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    return uuid.map((x) => x.toString(16)).join('');
};
exports.uuidv4 = uuidv4;
