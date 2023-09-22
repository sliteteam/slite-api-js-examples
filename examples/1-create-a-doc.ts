import { config } from 'dotenv'
import client from '@api/slite'

async function main() {
  config()

  const apiKey = process.env.SLITE_API_KEY as string
  
  client.auth(apiKey)
  
  const response = await client.createNote({
    title: `${new Date().toLocaleDateString()} Sales meeting report`,
    markdown: `
# Weekly sales meeting report

- We had a great meeting today
- We discussed the new sales strategy
- We decided to hire a new sales rep
    `,
  })
  
  console.log(response.data)
  // {
  //   id: 'NOTE_ID',
  //   parentNoteId: 'PRIVATE_CHANNEL_ID',
  //   title: '22/09/2023 - Sales meeting report',
  //   url: 'https://xxx.slite.com/api/s/NOTE_ID/Sales-meeting-report'
  // }
}

main()