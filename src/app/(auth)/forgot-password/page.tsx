"use client";

import { FormEvent, useState } from 'react'
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { send } from '@emailjs/browser'
import { ForgotPasswordVector } from '@/assets/SVGs'
import Header from '@/components/Header'
import Input from '@/components/CustomUI/Input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { KeyRoundIcon, Loader2Icon } from 'lucide-react'
import { useForgotPasswordMutation } from '@/store'

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("")
    const router = useRouter()

    // Forgot Password Mutation Handler
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const HandleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const res = await forgotPassword(email).unwrap();

            if (res.status === 200) {
                // Mail Template Parameters
                const templateParams = {
                    to_name: res.reset.name,
                    to_email: res.reset.email,
                    reset_link: res.reset.resetLink
                }

                //Sending Mail to User
                const mailRes = await send(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
                    process.env.NEXT_PUBLIC_EMAILJS_PASSWORD_RESET_TEMPLATE as string,
                    templateParams,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
                );

                if (mailRes.status == 200) {
                    toast.success("Reset Link has been sent to your Email ID.")
                    router.push("/login")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className='relative flex flex-col px-4 py-3 w-full h-full min-h-screen overflow-hidden'>
            <Header disableAuthRedirect={true} />

            <section className='w-full h-full flex justify-between items-center flex-col px-3 2xl:px-4 my-auto gap-12 pb-20'>
                <div className=" flex_center flex-col gap-8 mb-6 sm:mb-12 mt-4 sm:mt-0">
                    <p className="text-[2em] whitespace-nowrap sm:text-[2.5em] 2xl:text-[2.5em] font-medium">
                        Forgot <span className="text-primary">Password</span> ?
                    </p>
                    <Image src={ForgotPasswordVector} alt='ForgotPasswordVector' className='w-[280px] sm:w-[320px] 2xl:w-[400px]' priority={true} />
                </div>

                <form onSubmit={HandleSubmit} className='flex flex-col items-end gap-4'>
                    <Input
                        type='email'
                        label='Email'
                        placeholder='example@gmail.com'
                        className='block w-full 2xl:w-[400px]'
                        onChange={(e) => setEmail(e.target.value)} />

                    <Button type='submit' className='w-full flex_center gap-4 text-white' disabled={isLoading}>
                        {isLoading ?
                            <Loader2Icon className='animate-spin' />
                            : <KeyRoundIcon />
                        }
                        <span>GET RESET LINK</span>
                    </Button>
                </form>
            </section>
        </main>
    )
}

export default ForgotPassword