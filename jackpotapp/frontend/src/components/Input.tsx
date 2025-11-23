import './Input.css'

interface InputProps {
    type: string;
    placeholder: string;
    className: string;
}

function Input({...props}: InputProps) {
    return (
        <input {...props} />
    )
}

export default Input