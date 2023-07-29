import { IEvent, MachineSaleEvent, MachineRefillEvent } from './event';

export const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';

}

export const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}

export const uuidv4 = (): string => {
  const uuid = new Array(36);
  for (let i = 0; i < 36; i++) {
    uuid[i] = Math.floor(Math.random() * 16);
  }
  uuid[14] = 4;
  uuid[19] = uuid[19] &= ~(1 << 2);
  uuid[19] = uuid[19] |= (1 << 3);
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  return uuid.map((x) => x.toString(16)).join('');  
}