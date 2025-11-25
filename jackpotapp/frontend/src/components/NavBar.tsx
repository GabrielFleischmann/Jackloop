import { useState } from 'react';

import "./NavBar.css";
import Logo from "../assets/JackloopLogo.png";

import Modal from "./Modal";
import SignUpForm from './SignUpForm';

export default function NavBar() {   
  
  // const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);

  const closeModal = () => {
    setOpenSignUpModal(false);
  }
 
  return (
    <>
      <div className="navbar">
        <img src={Logo} className="navbar-logo" />
        <div className="navbar-buttons">
          <button className="button-login">Login</button>
          <button className="button-registrer" onClick={() => setOpenSignUpModal(true)}>Registre-se</button>
        </div>
      </div>

      {openSignUpModal && (
        <Modal isOpen={openSignUpModal} closeModal={closeModal}>
          <SignUpForm />
        </Modal>
      )}
    </> 
  );
}
