"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PublishSubscribeService_instances, _PublishSubscribeService_execute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishSubscribeService = void 0;
class PublishSubscribeService {
    constructor() {
        _PublishSubscribeService_instances.add(this);
        this.eventQueue = [];
        this.eventSubscriberMap = new Map();
        // start eventQueue dispatcher - processing 1 event per second
        setInterval(() => __classPrivateFieldGet(this, _PublishSubscribeService_instances, "m", _PublishSubscribeService_execute).call(this), 1000);
    }
    publish(event) {
        this.eventQueue.push(event);
    }
    subscribe(type, handler) {
        var _a;
        const handlers = (_a = this.eventSubscriberMap.get(type)) !== null && _a !== void 0 ? _a : [];
        this.eventSubscriberMap.set(type, handlers.concat(handler));
    }
    unsubscribe(type, handler) {
        var _a;
        let handlers = (_a = this.eventSubscriberMap.get(type)) !== null && _a !== void 0 ? _a : [];
        const handlerIndex = handlers.findIndex(activeHandler => activeHandler.subscriberId() === handler.subscriberId());
        handlers.splice(handlerIndex, 1);
        this.eventSubscriberMap.set(type, handlers);
    }
}
exports.PublishSubscribeService = PublishSubscribeService;
_PublishSubscribeService_instances = new WeakSet(), _PublishSubscribeService_execute = function _PublishSubscribeService_execute() {
    var _a;
    console.log(this);
    const event = this.eventQueue.shift();
    if (event) {
        const handlers = (_a = this.eventSubscriberMap.get(event.type())) !== null && _a !== void 0 ? _a : [];
        handlers.forEach(handler => handler.handle(event));
    }
};
