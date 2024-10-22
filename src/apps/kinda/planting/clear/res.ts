import { DB, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const txt = useParse(e.Megs, 'Text')

    const userfarm = await DB.user_farmland
      .findOne({
        where: { uid: UID, id: Number(txt.replace(/(#|\/)?铲除/, '')) }
      })
      .then(data => data.dataValues)

    if (!userfarm) return

    await DB.user_farmland.update(
      { tid: 1, startAt: 0, endAt: 0, time: 0, state: 1 },
      { where: { uid: UID, id: Number(txt.replace(/(#|\/)?铲除/, '')) } }
    )

    const Send = useSend(e)

    Send(Text('成功铲除'))

    return
  },
  'message.create',
  /^(#|\/)?铲除\d+$/
)
