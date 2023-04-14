const nulloSubstrings = [
  'modification, and he recently agreed to answer our questions',
  'legal efforts to overturn the 2020 election; and three offenses relating to Trump’s unlawful possession of government records at Mar-a-Lago',
]

function isAllWhitespace(text) {
  return /^\s*$/.test(text)
}

function extractText(input) {
  const regex =
    /\(http:\/\/www\.autoadmit\.com\/thread\.php\?thread_id=\d+&forum_id=\d+#\d+\)$/
  if (regex.test(input)) {
    return input.replace(regex, '').trim()
  }
  if (input.startsWith(')')) {
    input = input.substring(1)
  }
  return input
}

function filterPosts() {
  const messageTables = document.querySelectorAll("table[width='700']")
  
  for (const table of messageTables) {
    const cellspacing = table.getAttribute('cellspacing') ? 'cellspacing' : null
    if (cellspacing) {
      continue
    }
    const authorElement = Array.from(table.querySelectorAll('b')).find(
      (b) => b.textContent.trim() === 'Author:'
    )
    const author = authorElement
      ? authorElement.nextSibling?.textContent?.trim()
      : null
    const dateElement = Array.from(table.querySelectorAll('b')).find(
      (b) => b.textContent.trim() === 'Date:'
    )
    const dateStr = dateElement
      ? dateElement.nextSibling?.textContent?.trim()
      : null
    const bodyElement = table.querySelector('table font')
    var i = 0
    var authorDetected = false
    const bodyStrings = []
    if (!bodyElement) {
      continue
    }
    for (const child of bodyElement.childNodes) {
      if (i < 2) {
        i++
        continue
      }
      if (child.textContent && !isAllWhitespace(child.textContent)) {
        const textContent = child.textContent
        if (!authorDetected) {
          if (textContent.startsWith('Author:')) {
            authorDetected = true
            i = 0
          }
          continue
        }
        bodyStrings.push(extractText(child.textContent))
      }
      i++
    }
    const joinedString = bodyStrings.join('')
    // for substring in nulloSubstrings
    var containsSubstring = false
    for (const substring of nulloSubstrings) {
      if (joinedString.includes(substring)) {
        table.style.visibility = 'hidden'
        table.style.display = 'none'
        containsSubstring = true
        continue
      }
    }
    if (containsSubstring) {
      continue
    }
  }
}

const result = filterPosts()