import { Client, Message } from 'discord.js'

const greetings = [
  'Hi',
  'Hey',
  'Hello',
  'Good Morning',
  'Good Day',
  'Good Evening',
  'Hallo', // german for hello
  'Moin', // northern german for hello
  'Moinsen', // northern german for hello
  'Servus', // austrian/bavarian for hello
  'Grüß Gott', // bavarian for hello
  'Grüß dich', // bavarian for hello
  'Grüß di', // bavarian for hello
  'Guten Morgen',
  'Guten Tag',
  'Guten Abend',
  'Wuhu',
  'Nabend',
  'Gumo', // Short for Guten Morgen
  'Tach',
  'Aloha', // hawaiian for hello
  'Hola', // spanish for hello
  'Ciao',
  'Hej',
  'Hei',
  'Konichiwa', // japanese for good afternoon
  'Konnichiwa', // japanese for good afternoon (alternative spelling)
  'Annyeong', // korean for hello
  'Annyeonghaseyo', // korean for hello
  'Bonjour', // french for good morning
  'Salut', // french for hi
  'Salve' // latin for hello
]

const sleepings = ['gute nacht', 'nachti', 'schlaft gut', 'gn8']

function containsKeywordFromArray(msg: string, keywords: string[]): boolean {
  const msgLower = msg.toLowerCase()
  for (let keyword of keywords) {
    // check if the msg includes the keyword
    keyword = keyword.toLowerCase()
    if (msgLower.includes(keyword)) {
      if (msgLower.startsWith(keyword) && msgLower.endsWith(keyword)) {
        return true
      }
      // check if the keyword is at the beginning of the msg and the next char is a space, ! or ? or . or ,
      if (msgLower.startsWith(keyword) && [' ', '!', '?', '.', ','].includes(msgLower.charAt(keyword.length))) {
        return true
      }
      // check if the keyword is at the end of the msg and the previous char is a space, ! or ? or . or ,
      if (
        msgLower.endsWith(keyword) &&
        [' ', '!', '?', '.', ','].includes(msgLower.charAt(msgLower.length - keyword.length - 1))
      ) {
        return true
      }
      // previous and next char is a space, ! or ? or . or ,
      if (
        [' ', '!', '?', '.', ','].includes(msgLower.charAt(msgLower.indexOf(keyword) - 1)) &&
        [' ', '!', '?', '.', ','].includes(msgLower.charAt(msgLower.indexOf(keyword) + keyword.length))
      ) {
        return true
      }
    }
  }
  return false
}

function mentionsBot(client: Client, msg: Message<boolean>): boolean {
  return (
    msg.mentions.users.has(client.user?.id as string) &&
    !msg.mentions.everyone &&
    msg.channelId === '1185324347934658593'
  )
}

export { containsKeywordFromArray, greetings, sleepings, mentionsBot }
