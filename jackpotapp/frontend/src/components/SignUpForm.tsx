import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';

import logo from "./../assets/logo.svg";

import api from "../services/api";

import Button from "./Button";
import Input from "./Input";
import './SignUpForm.css'
import PopUp from "./PopUp";
import { useState } from "react";

const userSchema = Yup.object().shape({
        name: Yup.string().required("Por favor, informe seu nome completo."),
        email: Yup.string().email("Formato de e-mail inválido.").required("Por favor, informe seu e-mail."),
        password: Yup.string().required("Por favor, informe uma senha."),
        confirmPassword: 
            Yup.string()
            .required("Por favor, confirme sua nova senha.")
            .oneOf([Yup.ref('password')], "O valor informado não corresponde com a senha.")
});

interface createUserDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Payload {
    name: string;
    email: string;
    password: string;
}


function SignUpForm(){
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(userSchema),
    });

    const [openPopUpSucess, setOpenPopUpSucess] = useState(false);
    const [openPopUpError, setOpenPopUpError] = useState(false);

    const closePopUpSucess = () => {
        setOpenPopUpSucess(false);    
    }

    const closePopUpError = () => {
        setOpenPopUpError(false);    
    }

    async function createUser(data:createUserDTO): Promise<void> {
    
        const payload: Payload = {
            name: data.name,
            email: data.email,
            password: data.password
        }

        const response = await api.post("/users", payload)
            
        if(response.status === 201 || response.status == 200) {
            setOpenPopUpSucess(true); 
            setTimeout(closePopUpSucess, 3000);
            return;
        } 
        
        setOpenPopUpError(true);
        setTimeout(closePopUpError, 4000);
    }
        
    return (
        <>
            <div className="main-container">
                <header>
                    <div className="align-img">
                        <img src={logo} alt="Logo" className="img-fluid" />
                    </div>
                    <h1 className="title">Criar conta</h1>
                </header>
                <main>
                    <form onSubmit={handleSubmit((data) => createUser(data))}>
                        <div className="input-spacing">
                            <Input {...register("name")} type="text" placeholder="Nome Completo" className="form-input"/>
                            {errors.name && <span>{errors.name.message}</span>}    
                        </div>
                        <div className="input-spacing">
                            <Input {...register("email")} type="text" placeholder="E-mail" className="form-input"/>
                            {errors.email && <span>{errors.email.message}</span>}
                        </div>
                        <div className="input-spacing">
                            <Input {...register("password")} type="password" placeholder="Senha" className="form-input"/>
                            {errors.password && <span>{errors.password.message}</span>}    
                        </div>    
                        <div className="input-spacing">
                            <Input {...register("confirmPassword")} type="password" placeholder="Repetir Senha" className="form-input"/>
                            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                        </div>
                        <div className="button-spacing">
                            <Button type="submit" className="form-button">
                                Criar Conta
                            </Button>
                        </div>
                    </form>
                    <div className="info-spacing">
                        <p>Este jogo é apenas recreativo e não envolve apostas reais.</p>
                    </div>
                </main>
            </div>
            { openPopUpSucess &&
                <PopUp isOpen={openPopUpSucess} message="Cadastro concluído com sucesso!" type="sucess" />
            }

            { openPopUpError &&
                <PopUp isOpen={openPopUpError} message="Não foi possível concluir seu cadastro. Tente novamente." type="error" />
            }
        </>
    );
}

export default SignUpForm;