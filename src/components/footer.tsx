export function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:px-8 md:px-16 lg:px-24 md:flex-row">
        {/* Footer Text Section */}
        <div className="text-center md:text-left">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Built by SWE International Coders. The source code is available on{" "}
            <a
              href="https://github.com/LH-SWE-international-coders/finalproject"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </div>

        {/* Optional Links Section */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="https://github.com/orgs/LH-SWE-international-coders/people"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Team Members
          </a>
          <a
            href="https://program-and-modules-handbook.bham.ac.uk/webhandbooks/WebHandbooks-control-servlet?Action=getModuleDetailsList&pgSubj=06&pgCrse=40098&searchTerm=002025"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Course Page
          </a>
        </div>
      </div>
    </footer>
  );
}
