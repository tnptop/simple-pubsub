import { IEvent } from './event';
import { ISubscriber } from './subscriber';

interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
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

export {
  MachinePublishSubscribeService,
}