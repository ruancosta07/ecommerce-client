"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export const useSlider = () => {
  const [slider, setSlider] = React.useState<number[]>([0,0])
  const [max, setMax] = React.useState<number | undefined>()
  return { slider, setSlider, max,setMax }
}



const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>,React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {max:number; slider:number[]; setSlider:React.Dispatch<React.SetStateAction<number[]>>}>(({ className, max ,slider, setSlider, ...props }, ref) => {
  return(
  <SliderPrimitive.Root
    ref={ref}
    value={slider}
    step={1}
    max={max}
    onValueChange={setSlider}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
      <SliderPrimitive.Range   className="absolute h-full bg-zinc-900 dark:bg-zinc-100" />
    </SliderPrimitive.Track>
    {slider.map((_, i)=> <SliderPrimitive.Thumb key={i} className="block cursor-pointer size-[1.6rem] active:size-[1.8rem] duration-200 rounded-full border-2 border-zinc-900 bg-white ring-offset-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 " />)}
  </SliderPrimitive.Root>
)})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
