import { GameApi, isThereAUserPresent, sendReply } from '@src/api'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const { shop, dog, dogfoot, farmland } = await GameApi.Shop.isbuy(UID)
    const findgooods = shop
      .concat(dog, dogfoot, farmland)
      .filter(item => item.id != 1)
    sendReply(e, '[商店]', GameApi.good.getListMsg(findgooods))
    return
  },
  'message.create',
  /^(#|\/)?(商店|超市)$/
)
