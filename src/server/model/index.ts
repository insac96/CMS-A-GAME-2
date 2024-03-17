import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBUser, DBUserLogin } from './user'
import { DBLevel } from './level'
import { DBGate } from './gate'
import { DBPaymentConfig, DBPayment } from './payment'
import { DBItem, DBItemBox } from './item'
import { DBShopConfig, DBShop, DBShopHistory, DBShopPack, DBShopPackHistory } from './shop'
import { DBEvent, DBEventConfig, DBEventHistory } from './event'
import { DBGiftcode, DBGiftcodeHistory } from './giftcode'
import { DBWheel, DBWheelHistory, DBWheelLuckyUser } from './wheel'
import { DBGameRankGift, DBGameRankGiftHistory, DBGameServerLogin } from './game'
import { DBLogAdmin, DBLogAdminSendItem, DBLogUser, DBLogUserIP, DBLogBlockIP } from './log'
import { DBAdsFrom, DBAdsLanding } from './ads'

import { DBSocketChat, DBSocketOnline } from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    User: DBUser(mongoose),
    UserLogin: DBUserLogin(mongoose),
    Level: DBLevel(mongoose),

    Gate: DBGate(mongoose),

    PaymentConfig: DBPaymentConfig(mongoose),
    Payment: DBPayment(mongoose),

    Item: DBItem(mongoose),
    ItemBox: DBItemBox(mongoose),
    
    ShopConfig: DBShopConfig(mongoose),
    Shop: DBShop(mongoose),
    ShopHistory: DBShopHistory(mongoose),
    ShopPack: DBShopPack(mongoose),
    ShopPackHistory: DBShopPackHistory(mongoose),

    EventConfig: DBEventConfig(mongoose),
    Event: DBEvent(mongoose),
    EventHistory: DBEventHistory(mongoose),

    Giftcode: DBGiftcode(mongoose),
    GiftcodeHistory: DBGiftcodeHistory(mongoose),

    Wheel: DBWheel(mongoose),
    WheelHistory: DBWheelHistory(mongoose),
    WheelLuckyUser: DBWheelLuckyUser(mongoose),

    GameServerLogin: DBGameServerLogin(mongoose),
    GameRankGift: DBGameRankGift(mongoose),
    GameRankGiftHistory: DBGameRankGiftHistory(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogAdminSendItem: DBLogAdminSendItem(mongoose),

    LogBlockIP: DBLogBlockIP(mongoose),
    LogUser: DBLogUser(mongoose),
    LogUserIP: DBLogUserIP(mongoose),

    AdsLanding: DBAdsLanding(mongoose),
    AdsFrom: DBAdsFrom(mongoose),

    SocketOnline: DBSocketOnline(mongoose),
    SocketChat: DBSocketChat(mongoose)
  }
}