// Простой мидлвар авторизации через заголовок Authorization

const USERS = {
  'user-1-token': { id: 1, name: 'Alice' },
  'user-2-token': { id: 2, name: 'Bob' }
}

exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization']
  const user = USERS[token]

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  req.user = user
  next()
}
