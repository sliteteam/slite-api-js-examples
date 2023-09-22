import { config } from 'dotenv'
import client from '@api/slite'

async function main() {
  config()

  const apiKey = process.env.SLITE_API_KEY as string
  const noteId = process.env.SLITE_DOC_ID as string
  const blockId = process.env.SLITE_BLOCK_ID as string

  client.auth(apiKey)

  const response = await client.updateTile({
    status: {
      "label": "103%",
      "colorHex": "#7FFF00"
    },
    title: "Revenue for September 2023 - 340k$",
    content: "- Latest customers: Acme (3k$ MrRR), Fijo (5k$ MRR) - Goal for the month was: 332k$ - Growth: 8% MoM",
    url: "https://dashboard.revenu"
  },
  {
    noteId,
    tileId: blockId,
  })

  console.log(response.data)
  // {
  //   url: 'https://xxx.slite.com/api/s/<NOTE_ID>/<NOTE_TITLE>#<BLOCK_ID>'
  // }
}

main()
