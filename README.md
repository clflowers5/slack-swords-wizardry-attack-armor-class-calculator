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

### Development
Easiest way to develop is to use `ngrok` as a tunnel, start the app with `yarn dev`, and point the slash command url
to your `ngrok` domain. Changes will reflect in real time.

### Deployment
Uses `claudia.js` as a global install (`npm install -g claudia`) to deploy to aws / lambda / api-gateway.
The less I have to think about the better :thumbsup:

The `deploy:create` and `deploy:update` scripts expect an environment variable set for `SLACK_VERIFICATION_TOKEN` 
