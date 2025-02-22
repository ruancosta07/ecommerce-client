import React from 'react'
import {motion, MotionProps} from "framer-motion"
import { twMerge } from 'tw-merge'
const Popup = ({key, className, motionOptions, children,}: {key?:string, className?:string, motionOptions?:MotionProps, children:React.ReactNode}) => {
  return (
    <motion.div className={twMerge(className as string)} {...motionOptions} key={key} initial={motionOptions?.initial ? motionOptions.initial :{scale: .9, opacity:0}} animate={motionOptions?.animate ? motionOptions.animate:{opacity:1, scale:1}}>
      {children}
    </motion.div>
  )
}

export default Popup
