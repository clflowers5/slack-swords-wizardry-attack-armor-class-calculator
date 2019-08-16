const { createCanvas, loadImage } = require('canvas')

const {
  CLERIC_DRUID_MONK_ATTACK_TABLE,
  FIGHTER_PALADIN_RANGER_ATTACK_TABLE,
  MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE
} = require('../static/attack-tables')

const CHARACTER_CLASSES = ['cleric', 'druid', 'monk', 'fighter', 'paladin', 'ranger', 'magic-user', 'mu', 'thief', 'assassin', 'ass']

function validateInput (input) {
  // input format: [character-class]
  const normalizedInput = input.toLowerCase()
  if (!CHARACTER_CLASSES.includes(normalizedInput)) {
    throw new Error('Invalid Input, must be a valid character class')
  }
  return normalizedInput
}

function lookupAttackTableByClass (characterClass) {
  switch (characterClass) {
    case 'cleric':
    case 'druid':
    case 'monk':
      return CLERIC_DRUID_MONK_ATTACK_TABLE
    case 'fighter':
    case 'paladin':
    case 'ranger':
      return FIGHTER_PALADIN_RANGER_ATTACK_TABLE
    case 'mu':
    case 'magic-user':
    case 'thief':
    case 'assassin':
    case 'ass':
      return MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE
    default:
      console.error('We shouldn\'t have gotten here...')
      return {}
  }
}

function formatAttackTable (attackTable) {
  // test with canvas and table
  const canvas = createCanvas(1000, 800)
  const context = canvas.getContext('2d')
  // todo: put in image

  return new Promise((resolve) => {
    loadImage('static/cleric_druid_monk_table.png')
      .then((image) => {
        context.drawImage(image, 0, 0, 1000, 400)
        resolve(`<img alt="attack table" src="${ canvas.toDataURL() }" />`)
      })
      .catch((err) => {
        console.error('woops', err)
      })
  })
}

function attackTable (req, res) {
  let characterClass

  try {
    characterClass = validateInput(req.body.text)
  } catch ({ message }) {
    return res.status(400).json({ text: message })
  }

  const attackTable = lookupAttackTableByClass(characterClass)

  formatAttackTable(attackTable)
    .then((formattedAttackTable) => {
      // res.send(formattedAttackTable)
      res.json({
        response_type: 'in_channel',
        attachments: [
          {
            blocks: [
              {
                type: 'section',
                text: {
                  text: formattedAttackTable,
                }
              }
            ]
          }
        ],
      })
    })
}

module.exports = attackTable
