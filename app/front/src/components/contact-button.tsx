import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ContactInfo from "./contact-info";
import { LayoutContext } from "./default-layout/layout";
import { Modal } from "./modal";

function ContactButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const [ t ] = useTranslation();
    const layoutContext: any = useContext(LayoutContext);

    return (
        <>
        <button onClick={() => {setModalOpen(!modalOpen)}}>
            <h4>{t('Contact')}</h4>
        </button>
        <Modal open={modalOpen} setModalOpen={setModalOpen} overlayRef={layoutContext.overlayRef} className={`w-3/12`}>
            <ContactInfo className={`w-full text-slate-800`}/>
        </Modal>
        </>
    )
}

export {ContactButton}