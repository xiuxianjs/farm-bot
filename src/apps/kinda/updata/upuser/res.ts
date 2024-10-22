import { isThereAUserPresent, GameApi } from '@src/api'
import { Text, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const UID = e.UserId
    if (!(await isThereAUserPresent(e, UID))) return
    const Send = useSend(e)
    const msg = await GameApi.Leve.Up(UID, 0, 1, 1)
    Send(Text(msg))
    return
  },
  'message.create',
  /^(#|\/)?升级$/
)
