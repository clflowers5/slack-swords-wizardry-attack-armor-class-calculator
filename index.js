import express from 'express'
import bodyParser from 'body-parser'

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
  const splitValues = input.split(/\s/)
  if (!splitValues[0]) {
    throw new Error('Invalid Input, level is required')
  }
  return { level: splitValues[0], bonus: splitValues[1] || 0 }
}

app.post('/v1/attack', (req, res) => {
  let level
  let bonus

  try {
    ({ level, bonus } = parseInput(req.body.text))
  } catch ({ message }) {
    res.json({ text: message })
  }

  const hitArmorClass = 0
  const attackRoll = 0
  res.json({
    response_type: 'in_channel',
    text: `You hit armor class: ${ hitArmorClass }`,
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
