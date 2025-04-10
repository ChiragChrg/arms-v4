"use client"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useSession } from 'next-auth/react'

import { CircleLoader } from './CustomUI/Skeletons'
import { Button } from "./ui/button"
import HamMenuSVG from '@/assets/Icons/HamMenuSVG'
import { ArrowLeftIcon, User2 } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import { SEL_User, sidebarActions } from "@/store"

const MobileHeader = () => {
    const { user } = useSelector(SEL_User);
    const { status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()

    return (
        <div className="flex lg:hidden justify-between items-center mb-4">
            <div className="flex_center gap-4">
                <div onClick={() => dispatch(sidebarActions.setShowSidebar(true))} >
                    <HamMenuSVG size="40" className='lg:hidden text-logoClr dark:text-white' />
                </div>

                {pathname !== "/dashboard" &&
                    <Button
                        variant="secondary"
                        onClick={() => router.back()}
                        className="text-slate-700 dark:text-white px-3 bg-primary/30">
                        <ArrowLeftIcon />
                        <span>Back</span>
                    </Button>}
            </div>

            <Link href="/settings" className="flex_center w-fit aspect-square rounded-full overflow-hidden">
                <CircleLoader size='40px' className={status == "loading" ? 'block' : "hidden"} />
                {user.image ?
                    <Image
                        src={user.image}
                        alt='User_Avatar'
                        width={40}
                        height={40}
                        loading='eager'
                        className={status == "loading" ? 'hidden' : "block object-cover"}
                    />
                    :
                    <div className={status == "loading" ? 'hidden' : "block bg-slate-400 text-white w-fit p-1.5"}>
                        <User2 size={30} />
                    </div>
                }
            </Link>
        </div>
    )
}

export default MobileHeader