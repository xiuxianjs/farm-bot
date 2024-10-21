import { DB, isThereAUserPresent, GameApi } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const txt = useParse(e.Megs, 'Text')
    let dogname = txt.match(/(#|\/)?升级(狗狗)? ?(.*犬)/)
    let dog: DB.UserDogType
    if (dogname && dogname[3]) {
      let data: DB.UserDogType[] = (await DB.user_dog.findAll({
        where: { uid: UID },
        raw: true,
        include: [{ model: DB.goods }]
      })) as any
      for (const item of data) {
        if (new RegExp(dogname[3]).test(item['good.name'])) {
          dog = item
          break
        }
      }
    } else {
      dog = (await DB.user_dog.findOne({
        where: { uid: UID },
        raw: true,
        include: [{ model: DB.goods }]
      })) as any as DB.UserDogType
    }
    const Send = useSend(e)
    const msg = await GameApi.Leve.Up(UID, 3, 1, dog.id)
    Send(Text(msg))
    return
  },
  'message.create',
  /^(#|\/)?升级(狗狗)? ?(.*犬)?/
)
