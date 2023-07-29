import { MACHINE_SALE_EVENT, MACHINE_REFILL_EVENT } from "./constant";
import { Machine } from "./entity";
import { MachineSaleSubscriber, MachineRefillSubscriber } from "./subscriber"
import { PublishSubscribeService } from "./pubsub";
import { eventGenerator } from "./helper";

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [new Machine("001"), new Machine("002"), new Machine("003")];

  // create the PubSub service
  const pubSubService: PublishSubscribeService = new PublishSubscribeService();

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber: MachineSaleSubscriber = new MachineSaleSubscriber(machines, pubSubService);
  const refillSubscriber: MachineRefillSubscriber = new MachineRefillSubscriber(machines, pubSubService);

  // subscribe to events
  pubSubService.subscribe(MACHINE_SALE_EVENT, saleSubscriber);
  pubSubService.subscribe(MACHINE_REFILL_EVENT, refillSubscriber);

  // create 5 random events
  const events = [1, 2, 3, 4, 5].map(i => eventGenerator());

  // publish the events
  events.map(event => pubSubService.publish(event));
})();
