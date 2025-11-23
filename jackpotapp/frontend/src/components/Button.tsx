import "./Button.css"

interface ButtonProps {
    type: "button" | "submit";
    className: string;
    children: React.ReactNode;    
}

function Button({children, ...props}: ButtonProps) {
    return (
        <button {...props}>{children}</button>
    )
}

export default Button