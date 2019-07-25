import express from 'express'
import bodyParser from 'body-parser'

import { CLERIC_DRUID_MONK_ATTACK_TABLE, FIGHTER_PALADIN_RANGER_ATTACK_TABLE } from './attackTables'
// typings are incorrect for package
const random = require('random')

const app = express()
const port = 5000

function validateEnvironment () {
  if (!process.env.SLACK_VERIFICATION_TOKEN) {
    throw new Error('SLACK_VERIFICATION_TOKEN is not set.')
  }
}

function validateToken ({ token }) {
  return (req, res, next) => {
    console.log(req.body)

    if (req.body.token === token) {
      next()
    } else {
      res.sendStatus(403)
    }
  }
}

validateEnvironment()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(validateToken({ token: process.env.SLACK_VERIFICATION_TOKEN }))

function parseInput (input) {
  // input format: [character-level] [bonus-to-hit]
  const splitValues = input.split(/\s/).filter(val => val)
  if (!splitValues[0]) {
    throw new Error('Invalid Input, level is required')
  }
  return { level: splitValues[0], bonus: splitValues[1] || 0 }
}

function calculateHitArmorClass ({ level, attackRoll }) {
  return {
    clericDruidMonkArmorClass: CLERIC_DRUID_MONK_ATTACK_TABLE[level][attackRoll] || 'Complete Miss',
    fighterPaladinRangerArmorClass: FIGHTER_PALADIN_RANGER_ATTACK_TABLE[level][attackRoll] || 'Complete Miss',
  }
}

function buildResultText ({ clericDruidMonkArmorClass, fighterPaladinRangerArmorClass }) {
  return `
Cleric, Druid, Monk - You hit armor class: ${ clericDruidMonkArmorClass }
Fighter, Paladin, Ranger - You hit armor class: ${ fighterPaladinRangerArmorClass }
`
}

app.post('/v1/attack', (req, res) => {
  let level
  let bonus

  try {
    ({ level, bonus } = parseInput(req.body.text))
  } catch ({ message }) {
    res.json({ text: message })
  }

  const attackRoll = random.int(1, 20)
  const finalAttackRoll = Number(attackRoll) + Number(bonus)
  const {
    clericDruidMonkArmorClass,
    fighterPaladinRangerArmorClass
  } = calculateHitArmorClass({
    level,
    attackRoll: finalAttackRoll
  })

  res.json({
    response_type: 'in_channel',
    text: buildResultText({ clericDruidMonkArmorClass, fighterPaladinRangerArmorClass }),
    attachments: [
      {
        text: `1d20: ${ attackRoll }`,
      },
      {
        text: `Final attack roll: ${ Number(attackRoll) + Number(bonus) }`,
      }
    ]
  })
})

app.listen(port, () => console.log(`App listening on port ${ port }!`))
