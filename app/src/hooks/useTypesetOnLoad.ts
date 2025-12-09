import { useEffect } from 'react'

export const useTypesetOnLoad = () => {
  useEffect(() => {
    ;(async () => {
      await window.MathJax.typesetPromise().catch(() => {})
    })()
  }, [])
}
