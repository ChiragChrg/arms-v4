"use client"
import { useEffect, useRef } from 'react'
import { SunIcon, MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

type Props = {
    size?: string | number,
    className?: string,
}

const ThemeButton = ({ size = 24, className = "" }: Props) => {
    const { setTheme, resolvedTheme } = useTheme()
    const themeMetaTagRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (typeof window !== undefined)
            themeMetaTagRef.current = document?.querySelector('meta[name="theme-color"]');

        const localTheme = localStorage.getItem("arms-theme")
        if (localTheme === "dark") {
            themeMetaTagRef.current?.setAttribute('content', "hsl(222.2 84% 4.9%)");
        } else {
            themeMetaTagRef.current?.setAttribute('content', "hsl(0 0% 100%)");
        }
    }, [])

    const HandleThemeToggle = () => {
        if (resolvedTheme === "dark") {
            setTheme("light")
            themeMetaTagRef.current?.setAttribute('content', "hsl(0 0% 100%)");
        } else {
            setTheme("dark")
            themeMetaTagRef.current?.setAttribute('content', "hsl(222.2 84% 4.9%)");
        }
    }

    return (
        <Button size="icon"
            className={cn("size-10 rounded-full bg-transparent hover:!bg-transparent border border-white/30 sm:hover:bg-white text-white cursor-pointer", className)}
            title={resolvedTheme === "dark" ? "Toggle Light Mode" : "Toggle Dark Mode"}
            onClick={HandleThemeToggle}>
            <SunIcon className={`dark:hidden size-[${size}px]`} />
            <MoonIcon className={`hidden dark:block size-[${size}px]`} />
        </Button>
    )
}

export default ThemeButton
