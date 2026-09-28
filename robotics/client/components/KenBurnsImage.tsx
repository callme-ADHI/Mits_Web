'use client'

import { motion } from 'framer-motion'

interface KenBurnsImageProps {
  src: string
  alt: string
  style?: React.CSSProperties
  className?: string
}

export function KenBurnsImage({ src, alt, style, className }: KenBurnsImageProps) {
  return (
    <div className={`overflow-hidden relative ${className ?? ''}`} style={{ ...style }}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.06 }}
        viewport={{ once: true }}
        transition={{ duration: 6, ease: 'easeOut' }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
