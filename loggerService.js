// Простая система логирования действий

const logs = []

exports.log = (entry) => {
  logs.push({ ...entry, timestamp: Date.now() })
}

exports.getLogs = () => logs
exports.clearLogs = () => logs.length = 0
