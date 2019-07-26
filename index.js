const express = require('express')
const serverlessExpress = require('aws-serverless-express')
const bodyParser = require('body-parser')
const random = require('random')

const {
  CLERIC_DRUID_MONK_ATTACK_TABLE,
  FIGHTER_PALADIN_RANGER_ATTACK_TABLE,
  MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE
} = require('./attackTables')

const app = express()
const port = 5000

function validateEnvironment () {
  if (!process.env.SLACK_VERIFICATION_TOKEN) {
    throw new Error('SLACK_VERIFICATION_TOKEN is not set.')
  }
}

function validateToken ({ token }) {
  return (req, res, next) => {
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
    clericDruidMonkArmorClass: String(CLERIC_DRUID_MONK_ATTACK_TABLE[level][attackRoll]) || 'Complete Miss',
    fighterPaladinRangerArmorClass: String(FIGHTER_PALADIN_RANGER_ATTACK_TABLE[level][attackRoll]) || 'Complete Miss',
    magicUserThiefAssassinArmorClass: String(MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE[level][attackRoll]) || 'Complete Miss',
  }
}

function buildResultText ({
  clericDruidMonkArmorClass,
  fighterPaladinRangerArmorClass,
  magicUserThiefAssassinArmorClass
}) {
  return `
Cleric, Druid, Monk - You hit armor class: ${ clericDruidMonkArmorClass }
Fighter, Paladin, Ranger - You hit armor class: ${ fighterPaladinRangerArmorClass }
Magic-User, Thief, Assassin - You hit armor class: ${ magicUserThiefAssassinArmorClass }
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
    fighterPaladinRangerArmorClass,
    magicUserThiefAssassinArmorClass
  } = calculateHitArmorClass({
    level,
    attackRoll: finalAttackRoll
  })

  res.json({
    response_type: 'in_channel',
    text: buildResultText({
      clericDruidMonkArmorClass,
      fighterPaladinRangerArmorClass,
      magicUserThiefAssassinArmorClass
    }),
    attachments: [
      {
        text: `Level: ${ level } Attack Bonus: ${ bonus }`
      },
      {
        text: `1d20: ${ attackRoll }`,
      },
      {
        text: `Final attack roll: ${ Number(attackRoll) + Number(bonus) }`,
      }
    ]
  })
})

const server = serverlessExpress.createServer(app)
exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)

const isDev = process.env.NODE_ENV === 'dev'
if (isDev) {
  app.listen(port, () => console.log(
    `App listening on port ${ port }!`
  ))
}
