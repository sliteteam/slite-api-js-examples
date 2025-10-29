/**
 * Example 4: Daily Crawl Updated Docs
 *
 * This script demonstrates how to:
 * 1. Search for notes edited in the last 24 hours using the Slite API
 * 2. Crawl through all pages of results
 * 3. Fetch the full content of each note
 * 4. Display note metadata and content previews
 *
 * Usage: npx ts-node examples/4-daily-crawl-updated-docs.ts
 *
 * The script uses the `lastEditedAfter` parameter to filter notes that were
 * modified since yesterday, making it perfect for daily crawling workflows.
 */

import { config } from 'dotenv'

async function searchNotes(apiKey: string, page: number, lastEditedAfter: string) {
  const searchUrl = new URL('https://api.slite.com/v1/search-notes')
  searchUrl.searchParams.append('query', '')
  searchUrl.searchParams.append('hitsPerPage', '100')
  searchUrl.searchParams.append('page', page.toString())
  searchUrl.searchParams.append('lastEditedAfter', lastEditedAfter)

  const searchResponse = await fetch(searchUrl.toString(), {
    method: 'GET',
    headers: {
      'x-slite-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })

  if (!searchResponse.ok) {
    throw new Error(`API request failed: ${searchResponse.status} ${searchResponse.statusText}`)
  }

  return await searchResponse.json()
}

async function fetchNoteContent(apiKey: string, noteId: string) {
  const noteResponse = await fetch(`https://api.slite.com/v1/notes/${noteId}`, {
    method: 'GET',
    headers: {
      'x-slite-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  })

  if (!noteResponse.ok) {
    throw new Error(`Failed to fetch note: ${noteResponse.status}`)
  }

  return await noteResponse.json()
}

async function main() {
  config()

  const apiKey = process.env.SLITE_API_KEY as string

  // Calculate yesterday's date (24 hours ago)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const lastEditedAfter = yesterday.toISOString()

  console.log(`Fetching docs edited after ${yesterday.toLocaleDateString()} ${yesterday.toLocaleTimeString()}...\n`)

  // Fetch first page to determine total number of pages
  console.log('Fetching page 1...')
  const firstPageData = await searchNotes(apiKey, 0, lastEditedAfter)
  const nbPages = firstPageData.nbPages as number
  const totalNotes = (firstPageData.hits as any[]).length

  if (totalNotes === 0) {
    console.log('No documents were updated in the last 24 hours.')
    return
  }

  console.log(`Found ${nbPages} page(s) of results\n`)

  let totalProcessed = 0

  // Crawl through all pages
  for (let currentPage = 0; currentPage < nbPages; currentPage++) {
    // Fetch page data (reuse first page data if on page 0)
    const pageData = currentPage === 0 ? firstPageData : await searchNotes(apiKey, currentPage, lastEditedAfter)
    const hits = pageData.hits as any[]

    if (currentPage > 0) {
      console.log(`\nFetching page ${currentPage + 1}/${nbPages}...`)
      // Add a small delay between page fetches
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log(`Processing ${hits.length} note(s) from page ${currentPage + 1}/${nbPages}\n`)

    // Fetch full content for each note on this page
    for (const hit of hits) {
      console.log('-'.repeat(80))
      console.log(`Title: ${hit.title}`)
      console.log(`ID: ${hit.id}`)
      console.log(`Type: ${hit.type}`)

      try {
        const note = await fetchNoteContent(apiKey, hit.id)

        console.log(`URL: ${note.url}`)

        if (note.content) {
          console.log('\nContent preview:')
          // Show first 200 characters of content
          const content = note.content as string
          const preview = content.length > 200
            ? content.substring(0, 200) + '...'
            : content
          // Indent the preview
          const indentedPreview = preview.split('\n').map(line => `  ${line}`).join('\n')
          console.log(indentedPreview)
        } else {
          console.log('(No content)')
        }

        console.log('')
        totalProcessed++
      } catch (error: any) {
        console.log(`Error fetching content: ${error.message}`)
        console.log('')
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log('-'.repeat(80))
  console.log(`\nCrawl complete! Processed ${totalProcessed} note(s) across ${nbPages} page(s).`)
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
