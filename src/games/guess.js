import readline from 'readline/promises'
import fs from 'fs'
import path from 'path'
const RECORDS_FILE = path.resolve(import.meta.dirname, '../../records.json')
const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

const getRecords = () => {
  try {
    return JSON.parse(fs.readFileSync(RECORDS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

const showRecords = () => {
  console.log('\n🏆 HIGH SCORES (TOP-5):\n-----------------------------------------\nPlace | Name           | Attempts | Time \n-----------------------------------------');
  
  const records = getRecords()
  if (!records.length) console.log('  No records yet. Be the first!')
  
  records.forEach(({ name, attempts, timeStr }, i) => {
    console.log(` ${(i + 1).toString().padEnd(5)} | ${name.substring(0, 14).padEnd(14)} | ${attempts.toString().padEnd(8)} | ${timeStr} `);
  });
  console.log('-----------------------------------------\n')
}

const saveRecord = (name, attempts, timeSec) => {
  const records = [...getRecords(), { name, attempts, timeSec, timeStr: formatTime(timeSec) }]
  records.sort((a, b) => a.attempts - b.attempts || a.timeSec - b.timeSec)
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records.slice(0, 5), null, 2))
}

export const runGuessGame = async (playerName) => {
  console.log('I am thinking of a number between 1 and 100.\nTry to guess it!\n')

  const secretNumber = Math.floor(Math.random() * 100) + 1
  const startTime = Date.now()
  let attempts = 0

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  while (true) {
    const answer = await rl.question('Your guess: ')
    const userNumber = Number(answer.trim())

    if (!Number.isInteger(userNumber) || userNumber < 1 || userNumber > 100) {
      console.log('❌ Invalid input. Enter an integer from 1 to 100.\n')
      continue
    }

    attempts += 1

    if (userNumber === secretNumber) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      console.log(`\n🎉 Correct, ${playerName}! You won!\nSecret number: ${secretNumber}\nAttempts: ${attempts}\nTime: ${formatTime(timeSpent)}`);
      
      rl.close()
      saveRecord(playerName, attempts, timeSpent)
      showRecords()
      break
    }
    
    console.log(userNumber < secretNumber ? '📈 Too LOW!\n' : '📉 Too HIGH!\n')
  }
}