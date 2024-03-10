import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser, DBUserLogin } from './user'
import { DBLevel } from './level'
import { DBGate } from './gate'
import { DBPaymentConfig, DBPayment } from './payment'
import { DBWithdraw } from './withdraw'
import { DBNotifyUser, DBNotifyAdmin } from './notify'
import { DBItem, DBItemBox } from './item'
import { DBShopConfig, DBShop, DBShopHistory, DBShopPack, DBShopPackHistory } from './shop'
import { DBEvent, DBEventConfig, DBEventHistory } from './event'
import { DBGiftcode, DBGiftcodeHistory } from './giftcode'
import { DBDice, DBDiceHistory, DBDiceLuckyUser } from './dice'
import { DBWheel, DBWheelHistory, DBWheelLuckyUser } from './wheel'
import { DBGameRankGift, DBGameRankGiftHistory, DBGameServerLogin } from './game'
import { DBLogAdmin, DBLogAdminSendItem, DBLogUser, DBLogUserIP, DBLogBlockIP } from './log'
import { DBAdsFrom, DBAdsLanding, DBAdsTeaser } from './ads'
import { DBLimitedEventEgg, DBLimitedEventLuckyMoney, DBLimitedEventPayment, DBLimitedEventPayMission } from './limitedevent'

import { DBSocketChat, DBSocketOnline } from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    UserLogin: DBUserLogin(mongoose),
    Level: DBLevel(mongoose),

    Gate: DBGate(mongoose),

    PaymentConfig: DBPaymentConfig(mongoose),
    Payment: DBPayment(mongoose),

    Withdraw: DBWithdraw(mongoose),

    NotifyUser: DBNotifyUser(mongoose),
    NotifyAdmin: DBNotifyAdmin(mongoose),

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

    Dice: DBDice(mongoose),
    DiceHistory: DBDiceHistory(mongoose),
    DiceLuckyUser: DBDiceLuckyUser(mongoose),

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

    AdsTeaser: DBAdsTeaser(mongoose),
    AdsLanding: DBAdsLanding(mongoose),
    AdsFrom: DBAdsFrom(mongoose),

    SocketOnline: DBSocketOnline(mongoose),
    SocketChat: DBSocketChat(mongoose),

    LimitedEventLuckyMoney: DBLimitedEventLuckyMoney(mongoose),
    LimitedEventPayment: DBLimitedEventPayment(mongoose),
    LimitedEventPayMission: DBLimitedEventPayMission(mongoose),
    LimitedEventEgg: DBLimitedEventEgg(mongoose)
  }
}