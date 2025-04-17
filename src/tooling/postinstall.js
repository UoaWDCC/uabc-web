if (process.env.NODE_ENV === 'production') {
  console.log(`Skipping postinstall script in production environment.`)
  process.exit(0)
}

console.log('Running yamada-cli for local development...')

const { execSync } = await import('child_process')

try {
  execSync('yamada-cli tokens ./src/theme', { stdio: 'inherit' })
} catch (err) {
  console.error('Failed to run yamada-cli:', err)
  process.exit(1)
}
