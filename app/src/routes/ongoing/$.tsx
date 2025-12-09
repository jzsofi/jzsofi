import { useTypesetOnLoad } from '@/hooks/useTypesetOnLoad'
import { Box } from '@mui/material'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/ongoing/$')({
  component: RouteComponent,
  loader: async ({
    context: { getBodyContent, siteMap },
    params: { _splat },
  }) => {
    const doc = await fetch(
      `${import.meta.env.BASE_URL}content/ongoing/${_splat}`,
    )
    if (!doc.ok) {
      throw notFound()
    }
    return {
      body: getBodyContent(await doc.text()),
      title: siteMap[`/ongoing/${_splat}`],
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title.title} | Ongoing Research | ${__APP_NAME__}`,
      },
    ],
  }),
})

function RouteComponent() {
  const { body } = Route.useLoaderData()
  useTypesetOnLoad()

  return <Box component="div" dangerouslySetInnerHTML={{ __html: body }}></Box>
}
