import type { TexArticle } from '@/types/types'
import { Divider, Stack, Toolbar } from '@mui/material'
import { Link } from '@tanstack/react-router'
import _ from 'lodash'
import type { FC } from 'react'

type Props = {
  items: TexArticle[]
}
export const AppHeader: FC<Props> = ({ items }) => {
  return (
    <Toolbar disableGutters variant="dense">
      <Stack
        direction={'row'}
        spacing={2}
        useFlexGap
        flexWrap={'nowrap'}
        divider={<Divider flexItem orientation="vertical" />}
      >
        <Link to="/">Home</Link>
        {_.uniq(
          items
            .filter(
              ({ path }) => path.length === 1 && path.at(0) !== 'index.html',
            )
            .map(({ path }) => path.at(0)!),
        ).map((p, i) => (
          <Link
            to="/$"
            params={{ _splat: p }}
            style={{ textTransform: 'capitalize' }}
            key={i}
          >
            {p.replace(/.html$/, '')}
          </Link>
        ))}
      </Stack>
    </Toolbar>
  )
}
