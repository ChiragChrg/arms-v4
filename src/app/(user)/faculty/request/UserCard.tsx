import { Button } from '@/components/ui/button'
import { CheckIcon, Loader, User2, X } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useApproveFacultyMutation } from '@/store'
import { UserTypes } from '@/store/types'

type Props = {
    user: UserTypes
}
type MutationType = {
    facultyId: string,
    approval: "approve" | "reject"
}

const UserCard = ({ user }: Props) => {
    // Mutation to handle faculty approval/rejection
    const [approveFaculty, { isLoading }] = useApproveFacultyMutation()

    const handleApproval = async ({ facultyId, approval }: MutationType) => {
        try {
            await approveFaculty({ facultyId, approval }).unwrap();
            toast.success(`Faculty ${approval}ed successfully!`);
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="flex_center flex-col gap-1 rounded-md py-4 radialGradientDark radialGradientDark">
            {user.image ?
                <Image
                    src={user.image}
                    alt='User_Avatar'
                    width={80}
                    height={80}
                    loading='eager'
                    className='rounded-full'
                />
                :
                <div className="bg-slate-400 w-fit max-w-[80px] p-3 rounded-full text-white">
                    <User2 size={56} />
                </div>
            }

            <h3 className='mt-2'>{user.name}</h3>
            <span className='text-[0.8em] opacity-80'>{user.email}</span>

            <div className="flex_center gap-4 mt-2 w-full px-8">
                <Button
                    onClick={() => handleApproval({ facultyId: user.id, approval: "approve" })}
                    className='flex items-center gap-1 p-2 min-w-[90px] w-1/2 h-fit text-[0.8em] bg-green-600 hover:bg-green-700 text-white drop-shadow cursor-pointer'>
                    {isLoading ?
                        <Loader size={20} className='animate-spin' />
                        :
                        <CheckIcon size={20} />}
                    <span>Approve</span>
                </Button>

                <Button
                    variant="destructive"
                    onClick={() => handleApproval({ facultyId: user.id, approval: "reject" })}
                    className='flex_center deleteBtnBg gap-1 p-2 min-w-[90px] w-1/2 h-fit text-[0.8em] text-white drop-shadow cursor-pointer'>
                    {isLoading ?
                        <Loader size={20} className='animate-spin' />
                        :
                        <X size={20} />
                    }
                    <span>Reject</span>
                </Button>
            </div>
        </div>
    )
}

export default UserCard