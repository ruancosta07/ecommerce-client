import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { twMerge } from 'tw-merge'

interface PopupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  motionOptions?: MotionProps
}

const Popup: React.FC<PopupProps> = ({ className, motionOptions, children, ...props }) => {
  return (
    <motion.div
      {...props}
      className={twMerge(className || "")}
      {...motionOptions}
      initial={motionOptions?.initial ?? { scale: 0.9, opacity: 0 }}
      animate={motionOptions?.animate ?? { opacity: 1, scale: 1 }}
    >
      {children}
    </motion.div>
  )
}

export default Popup
