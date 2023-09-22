import client from '@api/slite'

client.auth()
client.createNote({
  title: 'Sales meeting report',
  content: 'We had a great meeting today',
})
