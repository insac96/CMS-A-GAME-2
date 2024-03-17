import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBUser, IDBUserLogin, IDBUserStore } from './user'
export { IDBLevel } from './level'
export { IDBGate } from './gate'
export { IDBPaymentConfig, IDBPayment } from './payment'
export { IDBItem, IDBItemBox } from './item'
export { IDBShopConfig, IDBShop, IDBShopHistory, IDBShopPack, IDBShopPackHistory } from './shop'
export { IDBEventConfig, IDBEvent, IDBEventHistory } from './event'
export { IDBGiftcode, IDBGiftcodeHistory } from './giftcode'
export { IDBWheel, IDBWheelHistory, IDBWheelLuckyUser } from './wheel'
export { IDBGameServerLogin, IDBGameRankGift, IDBGameRankGiftHistory } from './game'
export { IDBLogAdmin, IDBLogAdminSendItem, IDBLogUser, IDBLogUserIP, IDBLogBlockIP } from './log'
export { IDBAdsLanding, IDBAdsFrom } from './ads'

export { IDBSocketOnline, IDBSocketChat } from './socket'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  User: Model<IDBUser>
  UserLogin: Model<IDBUserLogin>
  Level: Model<IDBLevel>

  Gate: Model<IDBGate>

  PaymentConfig: Model<IDBPaymentConfig>
  Payment: Model<IDBPayment>

  Item: Model<IDBItem>
  ItemBox: Model<IDBItemBox>

  ShopConfig: Model<IDBShopConfig>
  Shop: Model<IDBShop>
  ShopHistory: Model<IDBShopHistory>
  ShopPack: Model<IDBShopPack>
  ShopPackHistory: Model<IDBShopPackHistory>

  EventConfig: Model<IDBEventConfig>
  Event: Model<IDBEvent>
  EventHistory: Model<IDBEventHistory>

  Giftcode: Model<IDBGiftcode>
  GiftcodeHistory: Model<IDBGiftcodeHistory>

  Wheel: Model<IDBWheel>
  WheelHistory: Model<IDBWheelHistory>
  WheelLuckyUser: Model<IDBWheelLuckyUser>

  GameServerLogin: Model<IDBGameServerLogin>
  GameRankGift: Model<IDBGameRankGift>
  GameRankGiftHistory: Model<IDBGameRankGiftHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogAdminSendItem: Model<IDBLogAdminSendItem>

  LogBlockIP: Model<IDBLogBlockIP>
  LogUser: Model<IDBLogUser>
  LogUserIP: Model<IDBLogUserIP>

  SocketOnline: Model<IDBSocketOnline>
  SocketChat: Model<IDBSocketChat>

  AdsLanding: Model<IDBAdsLanding>
  AdsFrom: Model<IDBAdsFrom>
}