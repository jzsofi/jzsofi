import { router } from '@/router'
import { MainTheme } from '@/theme'
import {
  AppBar,
  Container,
  CssBaseline,
  Divider,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  Link as MUILink,
} from '@mui/material'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Link,
  Outlet,
  createRootRoute,
} from '@tanstack/react-router'
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
    const siteBlogs: {
      title: string
      path: string[]
      abstract?: string
    }[] = await fetch(`${import.meta.env.BASE_URL}sitemap.json`)
      .then((resp) => resp.json())
      .catch(() => [])

    const siteMap = Object.fromEntries(
      siteBlogs.map((v) => {
        return ['/' + v.path.join('/'), v]
      }),
    )
    return {
      siteMap,
      siteBlogs: siteBlogs,
      getBodyContent,
    }
  },
  component: () => (
    <>
      <HeadContent />
      <ThemeProvider theme={MainTheme}>
        <CssBaseline />
        <AppBar
          position="relative"
          variant="outlined"
          color="default"
          sx={{ paddingY: 0 }}
        >
          <Toolbar disableGutters>
            <Stack
              direction={'row'}
              spacing={2}
              useFlexGap
              flexWrap={'nowrap'}
              divider={<Divider flexItem orientation="vertical" />}
            >
              <Link to="/">Home</Link>
              <Link to="/ongoing">Ongoing research</Link>
              <Link to="/publications">Publications</Link>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ paddingTop: 8, paddingBottom: 4 }}>
          <Outlet />
        </Container>
        <AppBar
          position="relative"
          variant="outlined"
          color="default"
          sx={{ paddingY: 0 }}
        >
          <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
            <Typography variant="subtitle2">
              Developed by{' '}
              <MUILink href="https://github.com/eurydia">
                Thanakorn Phuttharaksa
              </MUILink>
            </Typography>
          </Toolbar>
        </AppBar>
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
  ),
})
