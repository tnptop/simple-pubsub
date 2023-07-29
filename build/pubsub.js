"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublishSubscribeService = void 0;
class PublishSubscribeService {
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
    unsubscribe(type, handler) {
        var _a;
        let handlers = (_a = this.eventSubscriberMap.get(type)) !== null && _a !== void 0 ? _a : [];
        const handlerIndex = handlers.findIndex(activeHandler => activeHandler.subscriberId() === handler.subscriberId());
        handlers.splice(handlerIndex, 1);
        this.eventSubscriberMap.set(type, handlers);
    }
}
exports.PublishSubscribeService = PublishSubscribeService;
