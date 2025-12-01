import { useState, useEffect } from "react";
import "./NavBar.css";
import Logo from "../assets/JackloopLogo.png";
import ModalLogin from "./ModalLogin";
import Modal from "./Modal";
import SignUpForm from './SignUpForm';
import api from "../services/api";

export default function NavBar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [canClaimDaily, setCanClaimDaily] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const closeSignUpModal = () => {
    setOpenSignUpModal(false);
  }

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (user && user.id) {
      api.get(`/coins/balance/${user.id}/`)
        .then(response => {
          setBalance(response.data.balance);
        })
        .catch(error => {
          console.error("Erro ao buscar saldo:", error);
        });
    } else {
      setBalance(null);
    }
  }, [user]);

  useEffect(() => {
    const handleBalanceUpdate = () => {
      if (user && user.id) {
        api.get(`/coins/balance/${user.id}/`)
          .then((response: any) => {
            setBalance(response.data.balance);
          })
          .catch((error: any) => {
            console.error("Erro ao buscar saldo:", error);
          });
      }
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
    };
  }, [user]);

  useEffect(() => {
    const fetchDailyStatus = () => {
      if (user && user.id) {
        api.get(`/coins/daily/${user.id}/`)
          .then((response: any) => {
            setCanClaimDaily(response.data.can_claim_now);
          })
          .catch((error: any) => {
            console.error("Erro ao buscar status diário:", error);
          });
      }
    };

    fetchDailyStatus();
    window.addEventListener('balanceUpdated', fetchDailyStatus);
    return () => {
      window.removeEventListener('balanceUpdated', fetchDailyStatus);
    };
  }, [user]);

  function handleLoginSuccess(userData: any) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoginOpen(false);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  function handleDailyCoins() {
    if (user && user.id && canClaimDaily) {
      api.post('/coins/daily/claim/', {
        user: user.id
      })
        .then(() => {
          setShowSuccessModal(true);
          window.dispatchEvent(new Event('balanceUpdated'));
        })
        .catch((error: any) => {
          console.error("Erro ao coletar moedas diárias:", error);
        });
    }
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <img src={Logo} className="navbar-logo" alt="Jackloop Logo" />
          {user && (
            <>
              <button
                className="button-daily"
                onClick={handleDailyCoins}
                disabled={!canClaimDaily}
              >
                Moedas Diárias
              </button>
              {balance !== null && (
                <span className="user-balance" style={{ marginLeft: '20px', color: '#FFD700', fontWeight: 'bold' }}>
                  Moedas: {balance}
                </span>
              )}
            </>
          )}
        </div>
        <div className="navbar-buttons">
          {user ? (
            <>
              <span className="user-badge">{user.email}</span>
              <button className="button-logout" onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                className="button-login"
                onClick={() => setIsLoginOpen(true)}
              >
                Login
              </button>
              <button
                className="button-registrer"
                onClick={() => setOpenSignUpModal(true)}> Registre-se
              </button>
            </>
          )}
        </div>
      </div>

      {openSignUpModal && (
        <Modal isOpen={openSignUpModal} closeModal={closeSignUpModal}>
          <SignUpForm />
        </Modal>
      )}

      {showSuccessModal && (
        <div className="fundoEscurecido">
          <div className="janelaAviso">
            <h1 style={{ marginTop: "0px", fontSize: "22px", color: "#FFAB4C" }}>Moedas Coletadas!</h1>
            <p>
              Você recebeu 100 moedas diárias!<br /><br />
              Volte em 24 horas para coletar novamente.
            </p>
            <button onClick={() => setShowSuccessModal(false)}>Fechar</button>
          </div>
        </div>
      )}

      <ModalLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onShowSignUp={() => {
          setIsLoginOpen(false);
          setOpenSignUpModal(true);
        }}

      />
    </>
  );
}