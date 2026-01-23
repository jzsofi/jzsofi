import { Box } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
  loader: async ({ context: { getBodyContent } }) => {
    const doc = await fetch(`${import.meta.env.BASE_URL}content/index.html`)
    return {
      body: doc.ok ? getBodyContent(await doc.text()) : '',
    }
  },
  head: () => ({
    meta: [{ title: `Home | ${__APP_NAME__}` }],
  }),
})

function App() {
  const { body } = Route.useLoaderData()

  useEffect(() => {
    ;(async () => {
      await window.MathJax.typesetPromise().catch(() => {})
    })()
  }, [body])

  return (
    <Box component={'div'} dangerouslySetInnerHTML={{ __html: body }}></Box>
  )
}
