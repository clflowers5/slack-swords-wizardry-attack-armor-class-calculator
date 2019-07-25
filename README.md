# Slack Swords & Wizardry Attack AC Calculator

Slack app `/slash` command to make a `1d20` attack roll
and determine what armor class the attack hits.

### Usage
Within Slack:
```
/attack [character-level] [to-hit-bonus]
/attack 2 1
```

### Example Output
```
/attack 2 3
Cleric, Druid, Monk - You hit armor class: 7
Fighter, Paladin, Ranger - You hit armor class: 7
Magic-User, Thief, Assassin - You hit armor class: 7
- Level: 2 Attack Bonus: 3
- 1d20: 9
- Final attack roll: 12
```
