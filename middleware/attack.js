const random = require('random')

const {
  CLERIC_DRUID_MONK_ATTACK_TABLE,
  FIGHTER_PALADIN_RANGER_ATTACK_TABLE,
  MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE
} = require('./../static/attackTables')

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
    magicUserThiefAssassinArmorClass: String(MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE[level][attackRoll]) || 'Complete Miss'
  }
}

function buildResultText ({
                            clericDruidMonkArmorClass,
                            fighterPaladinRangerArmorClass,
                            magicUserThiefAssassinArmorClass
                          }) {
  return `
Cleric, Druid, Monk - You hit armor class: ${clericDruidMonkArmorClass}
Fighter, Paladin, Ranger - You hit armor class: ${fighterPaladinRangerArmorClass}
Magic-User, Thief, Assassin - You hit armor class: ${magicUserThiefAssassinArmorClass}
`
}

function attack (req, res) {
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
        text: `Level: ${level} Attack Bonus: ${bonus}`
      },
      {
        text: `1d20: ${attackRoll}`
      },
      {
        text: `Final attack roll: ${Number(attackRoll) + Number(bonus)}`
      }
    ]
  })
}

module.exports = attack;
