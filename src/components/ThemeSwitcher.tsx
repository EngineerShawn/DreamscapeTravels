'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

// Icons for the switcher
const SunIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const SystemIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);


export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="ghost"
                    isIconOnly
                >
                    {theme === 'light' ? <SunIcon /> : (theme === 'dark' ? <MoonIcon /> : <SystemIcon />)}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Theme Switcher">
                <DropdownItem key="light" startContent={<SunIcon />} onClick={() => setTheme('light')}>
                    Light
                </DropdownItem>
                <DropdownItem key="dark" startContent={<MoonIcon />} onClick={() => setTheme('dark')}>
                    Dark
                </DropdownItem>
                <DropdownItem key="system" startContent={<SystemIcon />} onClick={() => setTheme('system')}>
                    System
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
