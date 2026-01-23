import { AppHeader } from '@/components/app-header'
import { router } from '@/router'
import { MainTheme } from '@/theme'
import type { TexArticle } from '@/types/types'
import { Container, CssBaseline, Stack, ThemeProvider } from '@mui/material'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

const getBodyContent = (html?: string) => {
  if (!html) {
    return ''
  }
  const parser = new DOMParser()
  const dom = parser.parseFromString(html, 'text/html')

  const body = dom.querySelector('body')
  if (!body) {
    return ''
  }
  body.querySelectorAll('a > img').forEach((el) => {
    const e = el as HTMLImageElement
    if (!e.src) {
      return
    }
    const url = new URL(e.src)
    const src = url.pathname.split('/').slice(2).join('/')
    e.src = `${import.meta.env.BASE_URL}content/${src}`
  })

  body.querySelectorAll('a').forEach((el) => {
    if (!el.href) {
      return
    }

    if (el.matches('a:has(> img)')) {
      const url = new URL(el.href)
      const href = url.pathname.split('/').slice(2).join('/')
      el.href = `${import.meta.env.BASE_URL}content/${href}`
    } else {
      const url = new URL(el.href)
      const loc = router.buildLocation({
        hash: `/${url.hash}`,
      })
      el.href = `${import.meta.env.BASE_URL}#${loc.pathname.length === 1 ? loc.pathname.slice(1) : loc.pathname}${loc.hash}`
    }
  })
  return body.innerHTML
}

export const Route = createRootRoute({
  beforeLoad: async () => {
    const siteBlogs: TexArticle[] = await fetch(
      `${import.meta.env.BASE_URL}sitemap.json`,
    )
      .then((resp) => resp.json())
      .catch(() => [])

    const siteMap = Object.fromEntries(
      siteBlogs.map((v) => {
        return ['/' + v.path.join('/'), v]
      }),
    )
    return {
      siteMap,
      siteBlogs,
      getBodyContent,
    }
  },
  component: Root,
})

function Root() {
  const { siteBlogs } = Route.useRouteContext()
  return (
    <>
      <HeadContent />
      <ThemeProvider theme={MainTheme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Stack spacing={2} paddingY={2}>
            <AppHeader items={siteBlogs} />
            <Outlet />
          </Stack>
        </Container>
      </ThemeProvider>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
