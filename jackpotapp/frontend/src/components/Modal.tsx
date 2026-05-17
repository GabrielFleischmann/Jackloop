import "./Modal.css";
import { IoIosCloseCircle } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    closeModal: () => void;
}

function Modal({isOpen, children, closeModal}: ModalProps) {
    
    if(isOpen){
        return (
            <div className="background-style">
                <div className="modal-content">
                    <IoIosCloseCircle className="close-icon" onClick={closeModal} />
                    { children }
                </div>
            </div>
        )
    }
    
    return null;
}

export default Modal;