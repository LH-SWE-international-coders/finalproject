import Link from 'next/link'

export function Footer() {
    return (
        <footer className="flex">
            <div className="container flex flex-col items-center justify-between gap-4 px-14 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by SWE International Coders. The source code is available on {" "}
                        <Link
                            href="https://github.com/LH-SWE-international-coders/finalproject"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>
                {/* <div className="flex gap-4">
                    <Link
                        href="/terms"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/privacy"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/support"
                        className="text-sm font-medium underline underline-offset-4"
                    >
                        Support
                    </Link>
                </div> */}
            </div>
        </footer>
    )
}

