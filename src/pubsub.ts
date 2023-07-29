import { IEvent } from "./event";
import { ISubscriber } from "./subscriber";

interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
}

class PublishSubscribeService implements IPublishSubscribeService {
  private eventSubscriberMap: Map<string, ISubscriber[]>;

  constructor() {
    this.eventSubscriberMap = new Map<string, ISubscriber[]>();
  }

  publish(event: IEvent): void {
    const handlers: ISubscriber[] = this.eventSubscriberMap.get(event.type()) ?? [];
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

    this.eventSubscriberMap.set(
      type,
      handlers.slice(0, handlerIndex).concat(handlers.slice(handlerIndex + 1))
    );
  }
}

export {
  PublishSubscribeService,
}