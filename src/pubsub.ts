import { IEvent } from "./event";
import { ISubscriber } from "./subscriber";

interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  unsubscribe(type: string, handler: ISubscriber): void;
}

class PublishSubscribeService implements IPublishSubscribeService {
  private eventQueues: Map<string, IEvent[]>;
  private eventSubscriberMap: Map<string, ISubscriber[]>;

  constructor() {
    this.eventQueues = new Map<string, IEvent[]>();
    this.eventSubscriberMap = new Map<string, ISubscriber[]>();

    // start eventQueue dispatcher - processing 1 event per second
    // setInterval(() => this.#execute(), 1000);
  }

  /*
  #execute(): void {
    this.eventQueues.forEach(this.#executeEventInEventQueue, this);
  }

  #executeEventInEventQueue(eventQueue: IEvent[]): void {
    const event: IEvent | undefined = eventQueue.shift();

    if (event) {
      const handlers: ISubscriber[] = this.eventSubscriberMap.get(event.type()) ?? [];
      handlers.forEach(handler => handler.handle(event));
    }
  }

  publish(event: IEvent): void {
    const eventType = event.type();
    const eventQueue: IEvent[] = this.eventQueues.get(eventType) ?? [];
    this.eventQueues.set(eventType, eventQueue.concat(event));
  }
  */

  // instant event execution
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
    handlers.splice(handlerIndex, 1);

    this.eventSubscriberMap.set(type, handlers);
  }
}

export {
  PublishSubscribeService,
}