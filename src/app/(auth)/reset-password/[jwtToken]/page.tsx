"use client";

import { FormEvent, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from "next/image"
import * as jose from "jose"
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import Input from '@/components/CustomUI/Input'
import { KeyRoundIcon, Loader2Icon } from 'lucide-react'
import { ResetPasswordVector } from '@/assets/SVGs'
import { useResetPasswordMutation } from '@/store'

type TokenType = {
    jwtToken: string;
}

type DecodedToken = {
    id: string,
    name: string,
    exp: number,
}

const ResetPassword = () => {
    const [password, setPassword] = useState<string>("")
    const [confirmpassword, setConfirmPassword] = useState<string>("")
    const router = useRouter()

    // Get JWT Token from URL
    const { jwtToken }: TokenType = useParams()

    // Reset Password Mutation Handler
    const [resetPassword, { isLoading }] = useResetPasswordMutation()

    // Decode JWT Token to get User ID and Name
    const decodedToken = jose.decodeJwt(jwtToken);
    const { id, name, exp } = decodedToken as DecodedToken;

    // Check if the token is valid
    if (!id || !name || !exp) {
        toast.error("Invalid Reset URL!")
        router.push("/")
    }

    // Check if the token is expired
    const isExpired = exp ? (exp * 1000) < Date.now() : true;
    if (isExpired) {
        toast.error("Token Expired!")
        router.push("/login")
    }

    const HandleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        // Exit function if passwords do not match
        if (password !== confirmpassword) {
            toast.error("Passwords do not match")
            return
        }

        const ResetToastID = toast.loading("Resetting Password...")

        try {
            const res = await resetPassword({ id, password }).unwrap();

            if (res?.status === 201) {
                toast.success("Password reset successful!", {
                    id: ResetToastID
                })

                router.push("../login")
            }
        } catch (err) {
            toast.error("Something went wrong!", {
                id: ResetToastID
            })
            console.log(err)
        }
    }

    return (
        <main className='relative flex flex-col px-4 py-3 w-full h-full min-h-screen overflow-hidden'>
            <Header disableAuthRedirect={true} />

            <section className='w-full h-full flex justify-between items-center flex-col px-3 2xl:px-4 my-auto sm:my-0 gap-12 pb-20 sm:pb-4'>
                <div className=" flex_center flex-col gap-8 mb-6 sm:mb-0 mt-4 sm:mt-0">
                    <h1 className='text-[1.6em] sm:text-[2.2em] font-bold text-center'>
                        Welcome
                        <span className="text-primary">&nbsp;{name}</span>
                    </h1>
                    <Image src={ResetPasswordVector} alt='ResetPasswordVector' className='w-[80%] sm:w-[280px] 2xl:w-[350px]' priority={true} />
                </div>

                <form onSubmit={HandleResetPassword} className='flex flex-col gap-3 2xl:gap-4 md:max-w-min mx-auto'>
                    <Input
                        type='password'
                        label='New password'
                        placeholder='Enter new password'
                        className='2xl:w-[500px]'
                        onChange={(e) => setPassword(e.target.value)} />
                    <Input
                        type='password'
                        label='Confirm new password'
                        placeholder='Retype new password'
                        className='2xl:w-[500px]'
                        onChange={(e) => setConfirmPassword(e.target.value)} />

                    <Button type='submit' className='flex_center gap-4 text-white' disabled={isLoading}>
                        {isLoading ?
                            <Loader2Icon className='animate-spin' />
                            : <KeyRoundIcon />
                        }
                        RESET PASSWORD
                    </Button>
                </form>
            </section>
        </main>
    )
}

export default ResetPassword