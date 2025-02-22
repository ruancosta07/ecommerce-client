import { Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { twMerge } from 'tw-merge';

interface UseLoader {
    isLoading:boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>
}


export const useLoader = ():UseLoader=> {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    return {isLoading, setIsLoading}
}

const Loader = ({className}: {className?:string}) => {
  return (
    <div>
      <Loader2  className={twMerge(`animate-spin size-[1.6rem] ${className}`)}/>
    </div>
  )
}

export default Loader
