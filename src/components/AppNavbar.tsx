'use client';
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import NextLink from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

type Props = {
    onOpenModal?: () => void;
};

export default function AppNavbar({ onOpenModal }: Props) {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const menuItems = [
        { name: "Destinations", href: "/destinations" },
        { name: "Services", href: "/#services" },
        { name: "About", href: "/#about" },
        { name: "Contact", href: "/#contact" },
    ];

    return (
        <Navbar
            onMenuOpenChange={setIsMenuOpen}
            isMenuOpen={isMenuOpen}
            isBordered
            classNames={{
                wrapper: "max-w-6xl mx-auto",
                base: "bg-background/70 dark:bg-zinc-900/70 backdrop-saturate-150 backdrop-blur-lg shadow-lg",
            }}
        >
            <NavbarContent justify="start">
                <NavbarBrand>
                    <NextLink href="/" passHref onClick={() => isMenuOpen && setIsMenuOpen(false)}>
                        <p className="font-bold text-inherit font-serif text-xl">
                            Dreamscape <span className="text-primary">Travels</span>
                        </p>
                    </NextLink>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden md:flex gap-4" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item.name}-${index}`}>
                        <Link as={NextLink} color="foreground" href={item.href}>
                            {item.name}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                {onOpenModal && (
                    <NavbarItem className="hidden md:flex">
                        <Button onPress={onOpenModal} color="primary" variant="ghost" className="font-semibold">Get a Free Quote</Button>
                    </NavbarItem>
                )}
                <NavbarItem className="hidden md:flex">
                    <ThemeSwitcher />
                </NavbarItem>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                />
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item.name}-${index}`}>
                        <Link as={NextLink} color="foreground" className="w-full" href={item.href} size="lg" onClick={() => setIsMenuOpen(false)}>
                            {item.name}
                        </Link>
                    </NavbarMenuItem>
                ))}
                {onOpenModal && (
                    <NavbarMenuItem>
                        <Button onPress={() => { onOpenModal(); setIsMenuOpen(false); }} color="primary" variant="flat" className="w-full font-semibold">Get a Free Quote</Button>
                    </NavbarMenuItem>
                )}
                <NavbarMenuItem className="flex justify-start">
                    <ThemeSwitcher />
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
}
