import LZUTF8 from 'lzutf8'

export default (url) => {

  const ws = new WebSocket(url)

  ws.addEventListener('message', function ({ data }) {

    if (process.env.NODE_ENV === 'production') data = LZUTF8.decompress(data, {
      inputEncoding: 'StorageBinaryString'
    })

    const { event, msg, user } = JSON.parse(data)

    if (!event || ['open', 'close', 'error', 'message'].includes(event)) return

    ws.dispatchEvent(new CustomEvent(event, { detail: { msg, user } }))

  })

  ws.sendMsg = (event, msg) => {

    let data = JSON.stringify({
      event,
      msg
    })

    if (process.env.NODE_ENV === 'production') data = LZUTF8.compress(data, {
      outputEncoding: 'StorageBinaryString'
    })

    ws.send(data)

  }

  return ws

}
