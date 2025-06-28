'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
<<<<<<< HEAD
import { useEffect, useState, memo } from 'react'

const ScrollBackground = memo(() => {
=======
import { useEffect, useState } from 'react'

export default function ScrollBackground() {
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
  const { scrollYProgress } = useScroll()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

<<<<<<< HEAD
  // Simplified color transitions for better performance
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#000000', '#000000'] // Static black background for optimal performance
=======
  // Smooth color transitions matching section backgrounds
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.08, 0.12, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1],
    [
      '#000000', // Landing start (matches original gradient start)
      '#000000', // Landing end (matches original gradient end)
      '#000000', // Bio start (seamless transition)
      '#000000', // Bio end
      '#000000', // Music (white section)
      '#000000', // Stats
      '#000000', // Labels
      '#000000', // Clubs
      '#000000', // Gallery
      '#000000', // Video
      '#000000', // Contact
      '#000000'  // Contact end
    ]
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
  )

  if (!mounted) {
    return null
  }

  return (
    <motion.div
      className="fixed inset-0 -z-50"
      style={{
        background: backgroundColor,
<<<<<<< HEAD
        willChange: 'background-color', // Performance hint
      }}
    />
  )
})

ScrollBackground.displayName = 'ScrollBackground'

export default ScrollBackground
=======
      }}
    />
  )
}
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
