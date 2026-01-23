import { ArticleCard } from '@/components/article-card'
import { Box, ImageList, ImageListItem, Stack, Typography } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/$')({
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
  loader: async ({
    context: { getBodyContent, siteMap },
    params: { _splat },
  }) => {
    const uri = `/${_splat}`
    if (siteMap[uri] === undefined) {
      throw notFound()
    }

    const resp = await fetch(`${import.meta.env.BASE_URL}content/${_splat}`)
      .then((resp) => resp.text())
      .catch(() => '')

    return {
      body: getBodyContent(resp),
      title: siteMap[uri],
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title.title ?? 'Page not found'} | ${__APP_NAME__}`,
      },
    ],
  }),
})

function RouteComponent() {
  const { body } = Route.useLoaderData()
  const { siteBlogs } = Route.useRouteContext()
  const { _splat } = Route.useParams()

  useEffect(() => {
    ;(async () => {
      await window.MathJax.typesetPromise().catch(() => {})
    })()
  }, [body])

  const items = useMemo(() => {
    const base = (_splat ?? '')
      .replace(/.html$/, '')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`^${base}/[^/]+\\.html$`)

    return siteBlogs.filter(({ path }) => re.test(path.join('/')))
  }, [_splat, siteBlogs])

  return (
    <Stack spacing={2}>
      {!!body && (
        <Box component="div" dangerouslySetInnerHTML={{ __html: body }}></Box>
      )}
      <ImageList variant="masonry">
        {items.map((item, i) => {
          return (
            <ImageListItem key={i}>
              <ArticleCard article={item} />
            </ImageListItem>
          )
        })}
      </ImageList>
    </Stack>
  )
}

function NotFoundComponent() {
  return (
    <Box>
      <Stack>
        <Typography
          fontStyle={'italic'}
          color="textPrimary"
          fontWeight={'bold'}
        >
          Page not found.
        </Typography>
        <Typography fontStyle={'italic'} variant="body2">
          We could not find the document you requested.
        </Typography>
      </Stack>
    </Box>
  )
}
