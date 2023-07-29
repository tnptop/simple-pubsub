import { Machine } from './entity';
import { MachineSaleSubscriber, MachineRefillSubscriber } from './subscriber'
import { PublishSubscribeService } from './pubsub';
import { eventGenerator } from './helper';

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [ new Machine('001'), new Machine('002'), new Machine('003') ];

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber: MachineSaleSubscriber = new MachineSaleSubscriber(machines);
  const refillSubscriber: MachineRefillSubscriber = new MachineRefillSubscriber(machines);

  // create the PubSub service
  const pubSubService: PublishSubscribeService = new PublishSubscribeService();
  pubSubService.subscribe('sale', saleSubscriber);
  pubSubService.subscribe('refill', refillSubscriber);

  // create 5 random events
  const events = [1,2,3,4,5].map(i => eventGenerator());

  // publish the events
  events.map(event => pubSubService.publish(event));
})();
