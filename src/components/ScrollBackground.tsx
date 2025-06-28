'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, memo } from 'react'

const ScrollBackground = memo(() => {
  const { scrollYProgress } = useScroll()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simplified color transitions for better performance
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#000000', '#000000'] // Static black background for optimal performance
  )

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      className="fixed inset-0 -z-50"
      style={{
        background: backgroundColor,
        willChange: 'background-color', // Performance hint
      }}
    />
  )
})

ScrollBackground.displayName = 'ScrollBackground'

export default ScrollBackground
