import "./styles.css"

interface ModalProps {
    children: React.ReactNode;
}

function Modal({children}: ModalProps) {
    
    return (
        <div className="background-style container-fluid min-vh-100">
            <div className="main-content w-25 position-absolute top-50 start-50 translate-middle">
                <div className="d-flex justify-content-end">
                    <i className="bi bi-x-circle-fill p-2"></i>
                </div>
                { children }
            </div>
        </div>
    ) 
}

export default Modal;