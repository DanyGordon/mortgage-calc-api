export default () => ({
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRATION,
})