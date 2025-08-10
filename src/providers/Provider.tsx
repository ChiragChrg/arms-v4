"use client";

import { useEffect, useState } from "react"
import { SessionProvider } from "next-auth/react"
import { useSelector } from "react-redux"
import { SEL_ShowLoader } from "@/store"

import { ThemeProvider, ThemeProviderProps } from "next-themes"
import { EdgeStoreProvider } from "@/lib/edgestore"
import ModalProvider from "./ModalProvider"
import LoaderUI from "@/components/LoaderUI"
import { Toaster } from "react-hot-toast"

const Provider = ({ children, ...props }: ThemeProviderProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const { showLoader } = useSelector(SEL_ShowLoader);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])

    // Prevents hydration error in Next.js
    if (!isMounted) {
        return null
    }

    return (
        <ThemeProvider {...props}>
            <SessionProvider refetchOnWindowFocus={true}>
                <EdgeStoreProvider>
                    {children}
                </EdgeStoreProvider>
            </SessionProvider>

            {/* Loader Overlay while User is fetched */}
            {showLoader && <LoaderUI />}

            <ModalProvider />
            <Toaster position="bottom-right" />
        </ThemeProvider>
    )
}

export default Provider