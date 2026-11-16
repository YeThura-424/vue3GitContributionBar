import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'contribution-package-'))

try {
  // Inspect the same tarball npm publishes, without recursively running lifecycle scripts.
  const [packed] = JSON.parse(
    execFileSync(
      'npm',
      [
        'pack',
        '--json',
        '--ignore-scripts',
        '--pack-destination',
        temporary,
        '--cache',
        join(temporary, 'cache'),
      ],
      { cwd: root, encoding: 'utf8' },
    ),
  )
  const paths = new Set(packed.files.map(({ path }) => path))
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  const checkTarget = (target) => {
    assert(paths.has(target.replace(/^\.\//, '')), `Missing published file: ${target}`)
  }
  for (const field of ['main', 'module', 'types']) checkTarget(manifest[field])
  for (const target of Object.values(manifest.exports)) {
    for (const file of typeof target === 'string' ? [target] : Object.values(target))
      checkTarget(file)
  }
  for (const file of ['README.md', 'LICENSE']) assert(paths.has(file), `Missing ${file}`)
  assert(
    [...paths].every(
      (path) => ['README.md', 'LICENSE', 'package.json'].includes(path) || path.startsWith('dist/'),
    ),
    'The tarball includes unexpected files',
  )

  const modules = join(temporary, 'node_modules')
  const packageRoot = join(modules, manifest.name)
  await mkdir(packageRoot, { recursive: true })
  execFileSync('tar', [
    '-xzf',
    join(temporary, packed.filename),
    '-C',
    packageRoot,
    '--strip-components=1',
  ])
  for (const peer of Object.keys(manifest.peerDependencies)) {
    await symlink(await realpath(join(root, 'node_modules', peer)), join(modules, peer), 'dir')
  }

  // Resolve public entry points from a separate consumer, outside the repository.
  const consumer = join(temporary, 'consumer.mjs')
  await writeFile(
    consumer,
    `import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import * as library from '${manifest.name}'
const require = createRequire(import.meta.url)
const commonjs = require('${manifest.name}')
for (const entry of [library, commonjs]) {
  assert.equal(typeof entry.ContributionGraph3D, 'object')
  assert.equal(typeof entry.default.install, 'function')
  assert.equal(typeof entry.computeStats, 'function')
}
assert.deepEqual(Object.keys(library).sort(), Object.keys(commonjs).sort())
assert(readFileSync(require.resolve('${manifest.name}/style.css'), 'utf8').length > 0)
`,
  )
  execFileSync(process.execPath, [consumer], { cwd: temporary, stdio: 'inherit' })

  await writeFile(
    join(temporary, 'consumer.ts'),
    `import { ContributionGraph3D, computeStats, type ContributionSceneOptions } from '${manifest.name}'
const options: Partial<ContributionSceneOptions> = {}
void [ContributionGraph3D, computeStats, options]
`,
  )
  await writeFile(
    join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      },
      files: ['consumer.ts'],
    }),
  )
  const require = createRequire(import.meta.url)
  execFileSync(
    process.execPath,
    [
      join(dirname(require.resolve('typescript/package.json')), 'bin/tsc'),
      '-p',
      join(temporary, 'tsconfig.json'),
    ],
    { stdio: 'inherit' },
  )
  console.log(
    `Verified ${packed.filename}: ${paths.size} files, ESM, CommonJS, CSS, and TypeScript consumer.`,
  )
} finally {
  await rm(temporary, { recursive: true, force: true })
}
