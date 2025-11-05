import { config } from 'dotenv'

async function listNotes(apiKey: string, cursor: string | null) {
  let url = 'https://api.slite.com/v1/notes'
  if (cursor) {
    url += `?cursor=${encodeURIComponent(cursor)}`
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-slite-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API request failed ${url}: ${response.status} ${response.statusText}\n${errorText}`)
  }

  return await response.json()
}

async function main() {
  config()

  const apiKey = process.env.SLITE_API_KEY as string

  // Fetch 3 pages of notes
  let cursor = null
  let successfulPages = 0

  for (let page = 0; page < 3; page++) {
    try {
      console.log(`\n=== Fetching page ${page} ===`)
      const response = await listNotes(apiKey, cursor)

      console.log(`Total notes on page ${page}:`, response.notes.length)
      console.log(`Has next page: ${response.hasNextPage}`)
      console.log(`Total notes in workspace: ${response.total}`)

      // Display each note's basic info
      response.notes.forEach((note: any, index: number) => {
        console.log(`${index + 1}. ${note.title} (ID: ${note.id})`)
      })

      successfulPages++

      // Update cursor for next page
      cursor = response.nextCursor

      // If there's no next page, we've reached the end
      if (!response.hasNextPage) {
        console.log('\nReached the last page of notes.')
        break
      }

      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`\n❌ Error fetching page ${page}:`, error.message)
      console.log(`\nSuccessfully fetched ${successfulPages} page(s) before encountering an error.`)
      break
    }
  }

  console.log(`\n✅ Summary: Successfully fetched ${successfulPages} page(s) of notes.`)
}

main()
