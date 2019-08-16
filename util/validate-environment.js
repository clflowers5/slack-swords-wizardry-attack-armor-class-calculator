function validateEnvironment () {
  if (process.env.NODE_ENV !== 'dev' && !process.env.SLACK_VERIFICATION_TOKEN) {
    throw new Error('SLACK_VERIFICATION_TOKEN is not set.')
  }
}

module.exports = validateEnvironment
