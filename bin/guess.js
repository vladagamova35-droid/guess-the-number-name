#!/usr/bin/env node
import { greetPlayer } from '../src/cli.js'
import { runGuessGame } from '../src/games/guess.js'

const name = await greetPlayer()
await runGuessGame(name)