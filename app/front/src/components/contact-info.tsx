function ContactInfo(props: any) {
    return (
        <span className={props.className}>
            <ul className={`w-full text-shadow`}>
                <li className={`flex justify-between items-center`}>
                    Phone: <a href="tel://+380509363884">+380509363884</a>
                </li>
                <li className={`flex justify-between items-center`}>
                    <span className={'flex items-center'}><img src="/icons/instagram-color.png" className={`w-4 h-4 mr-2`}></img>Instagram: </span> <a href="https://instagram.com/massagist_yuliia?igshid=YmMyMTA2M2Y=">@massagist_yuliia</a>
                </li>
            </ul>
        </span>
    )
}

export default ContactInfo;