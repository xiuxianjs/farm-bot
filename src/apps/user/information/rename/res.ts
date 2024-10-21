import { DB, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const txt = useParse(e.Megs, 'Text')
    const name = txt.replace(/(#|\/)?(改名|修复昵称)/, '')

    await DB.user.update({ name: name }, { where: { uid: UID } })

    const Send = useSend(e)

    Send(Text('改名成功\n————————————\n[@机器人 /我的信息]'))

    return
  },
  'message.create',
  /^(#|\/)?(改名|(修改|更改)昵称)[\u4e00-\u9fa5]+$/
)
