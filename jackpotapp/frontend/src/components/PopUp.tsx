import "./PopUp.css";

interface PopUpProps {
    isOpen: boolean;
    type: "sucess" | "error";
    message: string;
}

function PopUp({isOpen, type, message}: PopUpProps) {
    const className = "popup-content " + type;

    if(isOpen){
        return (
            <div className={className}>
                {message}
            </div>
        )
    }
    
    return null;
}

export default PopUp;