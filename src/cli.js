import readline from 'readline/promises'

export const greetPlayer = async () => {
    console.log('Welcome to the Guess the number!')

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    const name = await rl.question('May i have your name? ')
    console.log(`Hello, ${name || 'Anonymous'}!\n`)

    rl.close()
    return name || 'Anonymous'
}