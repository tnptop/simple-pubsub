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
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const subscriber_1 = require("./subscriber");
const pubsub_1 = require("./pubsub");
const helper_1 = require("./helper");
// program
(() => __awaiter(void 0, void 0, void 0, function* () {
    // create 3 machines with a quantity of 10 stock
    const machines = [new entity_1.Machine('001'), new entity_1.Machine('002'), new entity_1.Machine('003')];
    // create a machine sale event subscriber. inject the machines (all subscribers should do this)
    const saleSubscriber = new subscriber_1.MachineSaleSubscriber(machines);
    const refillSubscriber = new subscriber_1.MachineRefillSubscriber(machines);
    // create the PubSub service
    const pubSubService = new pubsub_1.PublishSubscribeService();
    pubSubService.subscribe('sale', saleSubscriber);
    pubSubService.subscribe('refill', refillSubscriber);
    // create 5 random events
    const events = [1, 2, 3, 4, 5].map(i => (0, helper_1.eventGenerator)());
    // publish the events
    events.map(event => pubSubService.publish(event));
}))();
