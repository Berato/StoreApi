import jwt from 'jsonwebtoken'

const verifyJWT = async (req, res, next) => {
  const authToken = req.headers['auth-token']

  try {
    if (!authToken) throw new Error('This api uses JWT authentication. Please provide a JWT to contine operation.')

    const verified = jwt.verify(authToken, process.env.JWT_SECRET)

    if (verified) return next()
  } catch (error) {
    return res.status(401).send({ error: error.message })
  }
}

export default verifyJWT
