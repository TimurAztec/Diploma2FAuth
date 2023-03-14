function Footer(props: any) {
    return (
        <footer>
            <section className={`w-full p-2 bg-primary flex flex-col md:flex-row items-center justify-between`}>
                <span className={`text-white w-full md:w-1/6 md:pr-2 text-sm text-right`}>
                    <div>
                        Developed by:
                    </div>
                    <a href="https://github.com/TimurAztec">TimurAztec</a>
                </span>
            </section>
        </footer>
    )
}

export {Footer};