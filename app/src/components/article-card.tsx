import type { TexArticle } from '@/types/types'
import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { FC } from 'react'

type Props = {
  article: TexArticle
}

export const ArticleCard: FC<Props> = ({
  article: { path, title, abstract },
}) => {
  const nav = useNavigate()
  return (
    <Card variant="outlined">
      <CardActionArea
        disableRipple
        onClick={() =>
          nav({
            to: '/$',
            params: { _splat: path.join('/') },
          })
        }
      >
        <CardHeader title={title} />
        {abstract && (
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
              {abstract}
            </Typography>
          </CardContent>
        )}
        <CardActions>More &raquo;</CardActions>
      </CardActionArea>
    </Card>
  )
}
