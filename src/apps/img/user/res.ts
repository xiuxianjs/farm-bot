import { pictureRender } from '@src/image'
import { Image, useSend } from 'alemonjs'
export default OnResponse(
  async e => {
    const Send = useSend(e)
    const img = await pictureRender('admin', {})
    if (typeof img !== 'boolean') {
      Send(Image(img))
      return
    }
  },
  'message.create',
  /^(#|\/)?(农场|家园|农田)?帮助/
)
