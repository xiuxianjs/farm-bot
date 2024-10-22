import { isThereAUserPresent, GameApi } from '@src/api'
import { Text, useParse, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const Send = useSend(e)
    const txt = useParse(e.Megs, 'Text')
    const msg = await GameApi.Leve.Up(
      UID,
      2,
      1,
      Number(txt.replace(/(#|\/)?升级农田/, ''))
    )
    Send(Text(msg))
    return
  },
  'message.create',
  /^(#|\/)?升级农田\d+$/
)
