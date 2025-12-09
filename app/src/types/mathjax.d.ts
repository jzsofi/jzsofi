export {}

declare global {
  namespace MathJax {
    function typesetPromise(elements?: (string | HTMLElement)[]): Promise<void>
  }

  interface Window {
    MathJax: typeof MathJax
  }
}
