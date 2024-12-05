import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const parkinsans = localFont({
    src: [
        {
            path: "./fonts/Parkinsans-Light.ttf",
            weight: "200",
            style: "normal"
        },
        {
            path: "./fonts/Parkinsans-Regular.ttf",
            weight: "400",
            style: "normal"
        },
        {
            path: "./fonts/Parkinsans-Medium.ttf",
            weight: "500",
            style: "normal"
        },
        {
            path: "./fonts/Parkinsans-SemiBold.ttf",
            weight: "600",
            style: "normal"
        },
        {
            path: "./fonts/Parkinsans-Bold.ttf",
            weight: "700",
            style: "normal"
        },
        {
            path: "./fonts/Parkinsans-ExtraBold.ttf",
            weight: "800",
            style: "normal"
        },
    ],
    variable: '--font-parkinsans'
})

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${parkinsans.variable} antialiased`}
            >
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
