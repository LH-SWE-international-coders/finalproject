import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background border-t py-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:px-8 md:px-16 lg:px-24 md:flex-row">
                {/* Footer Text Section */}
                <div className="text-center md:text-left">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Built by SWE International Coders. The source code is available on{' '}
                        <Link
                            href="https://github.com/LH-SWE-international-coders/finalproject"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4 hover:text-primary"
                        >
                            GitHub
                        </Link>
                        .
                    </p>
                </div>

                {/* Optional Links Section */}
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <Link
                        href="/https://github.com/orgs/LH-SWE-international-coders/people"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Team Members
                    </Link>
                    <Link
                        href="/https://program-and-modules-handbook.bham.ac.uk/webhandbooks/WebHandbooks-control-servlet?Action=getModuleDetailsList&pgSubj=06&pgCrse=34257&searchTerm=002024"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Course Page
                    </Link>
                </div>
            </div>
        </footer>
    );
}
