"use client"
import Modal from './Modal'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOutIcon, X } from 'lucide-react'
import { loaderActions } from '@/store/loaderSlice/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions, sidebarActions, userActions } from '@/store'
import { SEL_showModal } from '@/store'

const LogoutModal = () => {
    const { showModal } = useSelector(SEL_showModal)
    const router = useRouter()
    const dispatch = useDispatch();

    const HandleLogout = async () => {
        dispatch(loaderActions.setShowLoader(true));

        try {
            signOut({
                callbackUrl: "/",
                redirect: false
            })
            dispatch(userActions.clearUser())
            dispatch(modalActions.close())
            dispatch(sidebarActions.setShowSidebar(false))

            localStorage.removeItem("arms-anonymous-user")
            router.push("/")
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <Modal
            title='Confirm Logout'
            description='Confirm to Logout of ARMS?'
            isOpen={showModal === "LogoutModal"}
        >
            <div className="flex justify-between items-end gap-8 w-[20em] h-[5em]">
                <Button variant="secondary" onClick={() => dispatch(modalActions.close())} className='flex_center gap-2 w-full'>
                    <X size={20} />
                    <span>Cancel</span>
                </Button>

                <Button variant="destructive" onClick={HandleLogout} className='flex_center gap-2 w-full text-white'>
                    <LogOutIcon size={20} />
                    <span>Logout</span>
                </Button>
            </div>
        </Modal>
    )
}

export default LogoutModal