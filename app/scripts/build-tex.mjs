import { globbySync } from 'globby'
import { JSDOM } from 'jsdom'
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path, { basename, join, relative } from 'node:path'

cpSync(join(process.cwd(), '..', 'content'), join(process.cwd(), 'content'), {
  recursive: true,
})

const contentDir = join(process.cwd(), 'content')
const tempDir = join(process.cwd(), 'temp')
const assetDir = join(process.cwd(), 'public')

if (existsSync(tempDir)) {
  rmSync(tempDir, { force: true, recursive: true })
}

mkdirSync(tempDir)

cpSync(join(contentDir, 'figures'), join(tempDir, 'figures'), {
  recursive: true,
})

if (existsSync(join(assetDir, 'content'))) {
  rmSync(join(assetDir, 'content'), { recursive: true })
}

for (const blog of globbySync(['./content/**/*.tex'], {
  ignore: ['**/__*/**', '__*.tex'],
})) {
  const segments = relative(process.cwd(), blog).split(path.sep).slice(1, -1)
  const name = basename(blog)
  const stem = basename(name, '.tex')

  const workingDir = join(tempDir, ...segments)

  cpSync(blog, join(workingDir, name), { recursive: true })

  console.debug(`(!!!) ${blog}`)
  console.debug('Working pdflatex')
  spawnSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', name], {
    cwd: workingDir,
  })
  console.debug('Working LWARPMK')
  spawnSync('lwarpmk', ['html', '-p', stem], {
    cwd: workingDir,
  })

  const htmlPath = join(workingDir, `${stem}.html`)
  if (!existsSync(htmlPath)) {
    console.debug('(!!!) No html generated')
    continue
  }

  mkdirSync(join(assetDir, 'content', ...segments), { recursive: true })
  cpSync(htmlPath, join(assetDir, 'content', ...segments, `${stem}.html`))
  spawnSync('lwarpmk', ['cleanall', '-p', stem], { cwd: workingDir })
}

cpSync(join(contentDir, 'figures'), join(assetDir, 'content', 'figures'), {
  recursive: true,
})

writeFileSync(
  join(assetDir, 'sitemap.json'),
  JSON.stringify(
    globbySync(['./public/content/**/*.html']).map((p) => {
      const dom = new JSDOM(readFileSync(p))
      const abstract = dom.window.document.body.querySelector('.abstract > p')
      return {
        path: relative(join(assetDir, 'content'), p).split(path.sep),
        title: dom.window.document.title,
        abstract: abstract === null ? undefined : abstract.textContent,
      }
    }),
  ),
  { flag: 'w+' },
)

rmSync(contentDir, { recursive: true })
rmSync(tempDir, { recursive: true })
