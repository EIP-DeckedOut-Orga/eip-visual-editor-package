import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * React hook to detect if the viewport is mobile-sized.
 * 
 * Uses a media query to detect if the window width is below 768px.
 * Returns undefined on first render (SSR safe), then updates to the actual value.
 * 
 * @returns Boolean indicating if the viewport is mobile-sized (< 768px)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *   
 *   return (
 *     <div>
 *       {isMobile ? <MobileView /> : <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
