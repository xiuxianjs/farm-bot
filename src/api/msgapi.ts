import { user } from '@src/db/index.js'
import * as Burial from '@src/model/wrap/burial.js'
import { Text, useSend } from 'alemonjs'

/**
 * 消息分发
 * @param e
 * @param msg
 * @returns
 */
export async function sendReply(e: any, title: string, msg: string[] = []) {
  const Send = useSend(e)
  // 按每7条消息分组并发送
  for (let i = 0; i < msg.length; i += 8) {
    const slicedMsg = msg.slice(i, i + 8)
    slicedMsg.unshift(title)
    // 间隔500毫秒发送一组消息
    setTimeout(async () => {
      Send(Text(slicedMsg.join('\n')))
    }, i * 300)
  }
  return
}

/**
 * 是否存在用户
 * @param e
 * @param UID
 * @returns
 */
export async function isThereAUserPresent(e: any, UID: string) {
  const UserData = await user
    .findOne({
      attributes: ['uid'],
      where: {
        uid: UID
      }
    })
    .then(data => data.dataValues)
  if (UserData) return true
  e.reply(
    [
      `尚未注册存档`,
      `————————————`,
      `[@机器人 /建立农场]`,
      `[@机器人 /帮助]`
    ].join('\n'),
    {
      quote: e.MsgId
    }
  )
  return false
}

/**
 * 冷却校验
 * @param e
 * @param UID
 * @param CDID
 * @returns
 */
export async function victoryCooling(e: any, UID: string, CDID: number) {
  const { state, msg } = await Burial.cooling(UID, CDID)
  if (state == 4001) {
    e.reply(msg, {
      quote: e.MsgId
    })
    return false
  }
  return true
}
