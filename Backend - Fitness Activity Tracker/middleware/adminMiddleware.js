const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403)
    throw new Error('ไม่มีสิทธิ์ เฉพาะ Admin เท่านั้น')
  }
}

export default adminOnly