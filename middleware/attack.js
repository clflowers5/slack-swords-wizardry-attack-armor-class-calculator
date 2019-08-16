const random = require('random')

const {
  CLERIC_DRUID_MONK_ATTACK_TABLE,
  FIGHTER_PALADIN_RANGER_ATTACK_TABLE,
  MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE
} = require('../static/attack-tables')

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
    clericDruidMonkArmorClass: CLERIC_DRUID_MONK_ATTACK_TABLE[level][attackRoll],
    fighterPaladinRangerArmorClass: FIGHTER_PALADIN_RANGER_ATTACK_TABLE[level][attackRoll],
    magicUserThiefAssassinArmorClass: MAGICUSER_THIEF_ASSASSIN_ATTACK_TABLE[level][attackRoll],
  }
}

function buildResultText ({
  clericDruidMonkArmorClass,
  fighterPaladinRangerArmorClass,
  magicUserThiefAssassinArmorClass
}) {
  const buildHitString = (armorClass) => {
    return armorClass
      ? `You hit armor class: ${ armorClass }`
      : `Complete miss...`
  }
  return `
Cleric, Druid, Monk - ${ buildHitString(clericDruidMonkArmorClass) }
Fighter, Paladin, Ranger - ${ buildHitString(fighterPaladinRangerArmorClass) }
Magic-User, Thief, Assassin - ${ buildHitString(magicUserThiefAssassinArmorClass) }
`
}

function attack (req, res) {
  let level
  let bonus

  try {
    ({ level, bonus } = parseInput(req.body.text))
  } catch ({ message }) {
    return res.status(400).json({ text: message })
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
        text: `1d20: ${ attackRoll }`
      },
      {
        text: `Final attack roll: ${ Number(attackRoll) + Number(bonus) }`
      }
    ]
  })
}

module.exports = attack
