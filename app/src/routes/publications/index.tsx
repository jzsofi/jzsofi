import { useTypesetOnLoad } from '@/hooks/useTypesetOnLoad'
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/publications/')({
  component: RouteComponent,
  loader: async ({ context: { getBodyContent } }) => {
    const doc = await fetch(
      `${import.meta.env.BASE_URL}content/publications/index.html`,
    )
    return {
      body: doc.ok ? getBodyContent(await doc.text()) : undefined,
    }
  },
  head: () => ({
    meta: [{ title: `Publications | ${__APP_NAME__}` }],
  }),
})

function RouteComponent() {
  const { siteBlogs } = Route.useRouteContext()
  const { body } = Route.useLoaderData()
  const nav = Route.useNavigate()
  useTypesetOnLoad()
  return (
    <Stack spacing={2} divider={<Divider flexItem />}>
      {!!body && (
        <Box component="div" dangerouslySetInnerHTML={{ __html: body }}></Box>
      )}
      <ImageList variant="masonry">
        {siteBlogs
          .filter(
            (p) =>
              p.path.length === 2 &&
              p.path[0] === 'publications' &&
              p.path.at(-1) !== 'index.html',
          )
          .map((to, i) => {
            return (
              <ImageListItem key={i}>
                <Card variant="outlined">
                  <CardActionArea
                    disableRipple
                    onClick={() =>
                      nav({
                        to: '/publications/$',
                        params: { _splat: to.path.slice(1).join('/') },
                      })
                    }
                  >
                    <CardHeader title={to.title} />
                    {to.abstract && (
                      <CardContent component={'div'}>
                        <Typography fontWeight={800}>Abstract</Typography>
                        <Typography
                          variant="body2"
                          sx={(t) => ({
                            maxHeight: 250,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              inset: 'auto 0 0',
                              height: 32,
                              pointerEvents: 'none',
                              background: `linear-gradient(to bottom, transparent, ${t.palette.background.default})`,
                            },
                          })}
                        >
                          {to.abstract}
                        </Typography>
                      </CardContent>
                    )}

                    <CardActions>More &raquo;</CardActions>
                  </CardActionArea>
                </Card>
              </ImageListItem>
            )
          })}
      </ImageList>
    </Stack>
  )
}
