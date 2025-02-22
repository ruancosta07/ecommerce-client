import { LayoutGridIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment } from 'react'

const Categories = () => {


    const categories = [
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//67a0f868d7dadf7889502491-1738693565976-photo-1581655353564-df123a1eb820.webp",
            name: "Camisas"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//matthew-moloney-YeGao3uk8kI-unsplash%20(1).webp",
            name: "Calças"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//ali-saadat-ikLELWYbyxk-unsplash%20(1).jpg",
            name: "Moletoms"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//maksim-larin-NOpsC3nWTzY-unsplash.webp",
            name: "Sapatos"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//alex-azabache-fgCnYUwK_E8-unsplash.webp",
            name: "Relógios"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//claudio-schwarz-PH8GUKG-Do0-unsplash.webp",
            name: "Bonés"
        },
        {
            link: "https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/utilsBucket//irene-kredenets-tcVH_BwHtrc-unsplash.webp",
            name: "Bolsas"
        },
    ]

    return (
        <section className='bg-zinc-600/70 mt-[8vh]'>
            <div className="container-width grid grid-cols-3 place-items-center lg:grid-cols-8 gap-[2rem] xl:justify-between py-[2rem] text-zinc-100 font-medium">
                {categories.map((a, i) => {
                    return (
                        <Fragment key={i}>
                             <Link href={`/categorias?categoria=${a.name.toLowerCase().slice(0, -1)}&pagina=1&limite=6`} className='text-center w-fit text-[1.4rem] font-space flex flex-col gap-[1rem]' >
                                <Image src={a.link} alt={a.name} width={100} height={100} className='rounded-full size-[8rem] object-cover' />
                                {a.name.replace("Moletoms", "Moletons")}
                            </Link> 
                            {i === 6 && <Link href={"/categorias?categoria='todas'"} className='text-center w-fit text-[1.4rem] font-space flex flex-col gap-[1rem] items-center' >
                                    <div className='p-[1rem] bg-zinc-500/30 rounded-full w-fit'>
                                        <LayoutGridIcon className='size-[6rem] ' />
                                    </div>
                                    Mais categorias
                                </Link> }
                                
                        </Fragment>
                    )
                }
                )}
            </div>
        </section>
    )
}

export default Categories
