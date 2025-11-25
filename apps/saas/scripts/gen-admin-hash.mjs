import bcrypt from 'bcryptjs'
import fs from 'fs'
const pwd = process.argv[2] || 'admin'
const envPath = process.argv[3]
const cost = Number(process.argv[4] || 10)
const run = async () => {
  const hash = await bcrypt.hash(pwd, cost)
  console.log(hash)
  if (envPath && fs.existsSync(envPath)) {
    const s = fs.readFileSync(envPath, 'utf8')
    const r = s.replace(/^(ADMIN_PASSWORD_HASH=).*$/m, `$1${hash}`)
    fs.writeFileSync(envPath, r)
  }
}
run()
