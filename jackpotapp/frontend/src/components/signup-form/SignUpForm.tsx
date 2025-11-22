import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import Button from "../button/Button";
import Input from "../input/Input";
import logo from "./../../assets/logo.svg";
import './styles.css'

const userSchema = Yup.object().shape({
        name: Yup.string().required("Por favor, informe seu nome completo."),
        email: Yup.string().email("Formato de e-mail inválido.").required("Por favor, informe seu e-mail."),
        password: Yup.string().required("Por favor, informe uma senha."),
        confirmPassword: 
            Yup.string()
            .required("Por favor, confirme sua nova senha.")
            .oneOf([Yup.ref('password')], "O valor informado não corresponde com a senha.")
});


function SignUpForm(){
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema),
    });

    return (
        <div className="main-container">
            <header>
                <div className="d-flex justify-content-center">
                    <img src={logo} alt="Logo" className="img-fluid px-5 py-4" />
                </div>
                <h1 className="px-3 py-2">Criar conta</h1>
            </header>
            <main>
                <form onSubmit={handleSubmit((d) => console.log(d))}>
                    <div className="px-3 py-2">
                        <Input {...register("name")} type="text" placeholder="Nome Completo" className="w-100"/>
                        {errors.name && <span>{errors.name.message}</span>}    
                    </div>
                    <div className="px-3 py-2">
                        <Input {...register("email")} type="text" placeholder="E-mail" className="w-100"/>
                        {errors.email && <span>{errors.email.message}</span>}
                    </div>
                    <div className="px-3 py-2">
                        <Input {...register("password")} type="password" placeholder="Senha" className="w-100"/>
                        {errors.password && <span>{errors.password.message}</span>}    
                    </div>    
                    <div className="px-3 py-2">
                        <Input {...register("confirmPassword")} type="password" placeholder="Repetir Senha" className="w-100"/>
                        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </div>
                    <div className="px-3 py-4">
                        <Button type="submit" className="w-100 btn-sm">
                            Criar Conta
                        </Button>
                    </div>
                </form>
                <div className="d-flex justify-content-center">
                    <p>Este jogo é apenas recreativo e não envolve apostas reais.</p>
                </div>
            </main>
        </div>
    );
}

export default SignUpForm;