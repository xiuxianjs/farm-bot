import { DB, isThereAUserPresent } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return

    const txt = useParse(e.Megs, 'Text')
    const name = txt.replace(/(#|\/)?更改(签名|个性签名)/, '')

    await DB.user.update({ autograph: name }, { where: { uid: UID } })

    const Send = useSend(e)

    Send(Text('更改成功\n————————————\n[@机器人 /我的信息]'))

    return
  },
  'message.create',
  /^(#|\/)?(更改|修改)(签名|个性签名)[\u4e00-\u9fa5]+$/
)
