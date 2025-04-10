"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Button } from './ui/button'
import { RectLoader } from "./CustomUI/Skeletons"
import AvatarImage from './CustomUI/AvatarImage'
import { LogOutIcon } from 'lucide-react'

import { useDispatch, useSelector } from 'react-redux'
import { modalActions, SEL_User, userActions } from '@/store'
import { loaderActions } from '@/store/loaderSlice/loaderSlice'
import { UserTypes } from '@/store/types'

const UserAvatar = () => {
    const { user } = useSelector(SEL_User);
    const { data: session, status } = useSession()
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        // console.log(session, status)
        const isAnonymousUser = JSON.parse(localStorage.getItem('arms-anonymous-user') as string)

        if (isAnonymousUser) {
            // Set a dummy Anonymous user info
            const formattedUser = {
                id: "anonymous",
                name: "Student",
                email: "Anomymous User",
                image: "",
                emailVerified: false,
                isApproved: false,
                createdAt: null,
                updatedAt: null,
                accessToken: "",
            }

            dispatch(userActions.setUser(formattedUser))
            dispatch(userActions.setIsLoading(false))

            setTimeout(() => {
                dispatch(loaderActions.setShowLoader(false));

            }, 2500)
        } else if (status == "authenticated" && session.user) {
            const formattedUser = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                image: session.user.image,
                emailVerified: session.user.emailVerified,
                isApproved: session.user.isApproved,
                createdAt: session.user.createdAt,
                updatedAt: session.user.updatedAt,
                accessToken: session.user.accessToken,
            } as UserTypes

            dispatch(userActions.setUser(formattedUser))
            dispatch(userActions.setIsLoading(false))

            setTimeout(() => {
                dispatch(loaderActions.setShowLoader(false));
            }, 2500)
        } else if (status === "unauthenticated") {
            router.push('/')
        }
    }, [session, status, router, dispatch])

    return (
        <div className="flex justify-between items-center gap-2 w-full rounded text-white">
            <AvatarImage url={user.image} />

            <div className="flex_center flex-col w-full max-w-[9.5em]">
                {status == "loading" ?
                    <>
                        <RectLoader height='22px' className='mb-1' />
                        <RectLoader height='14px' />
                    </>
                    :
                    <>
                        <h2 className="text-[0.95em]">{user.name}</h2>
                        <span className='opacity-80 text-[0.6em] tracking-wider'>{user.email}</span>
                    </>
                }
            </div>

            <Button
                size="icon"
                onClick={() => dispatch(modalActions.show("LogoutModal"))}
                className='deleteBtnBg'
                name='Logout'
                title='Logout'
                disabled={status == "loading"}>
                <LogOutIcon color='white' className='size-5' />
            </Button>
        </div>
    )
}


export default UserAvatar