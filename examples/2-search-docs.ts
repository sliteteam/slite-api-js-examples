import { config } from 'dotenv'
import client from '@api/slite'

async function main() {
  config()

  const apiKey = process.env.SLITE_API_KEY as string

  client.auth(apiKey)

  const response = await client.searchNotes({
    query: '2023 Meeting',
    hitsPerPage: 3,
  })

  console.log(response.data)
  // {
  //   hits: [
  //     {
  //       id: 'hqZpt8hFXc24Zl',
  //       title: 'Sales meeting - Sept 2023',
  //       type: 'rich_text',
  //       highlight: 'Revenue for September 2023 - 340k$ 104%\n' +
  //         '- Latest customers: Acme (3k$ MrRR), Fijo (5k$ MRR) - Goal for the month was: 332k$ - Growth: 8% MoM 1. Quick Recap of a Week Tasks Main Achievements 2. SDR Activities Number of meetings generated Number of SAOs converted Number of calls made Number of personalized emails sent Number of conversations 3.'
  //     },
  //     {
  //       id: 'hnYzKVyV4dy5Bw',
  //       title: '9/22/2023 Sales meeting report',
  //       type: 'rich_text',
  //       highlight: 'Weekly sales meeting report We had a great meeting today We discussed the new sales strategy We decided to hire a new sales rep'
  //     },
  //     {
  //       id: 'h_bM4aW9ez4ePZ',
  //       title: '9/22/2023 Sales meeting report',
  //       type: 'rich_text',
  //       highlight: '# Weekly sales meeting report\n' +
  //         '  \n' +
  //         '  - We had a great meeting today\n' +
  //         '  - We discussed the new sales strategy\n' +
  //         '  - We decided to hire a new sales rep'
  //     }
  //   ],
  //   page: 0,
  //   nbPages: 388
  // }
  // }
}

main()
