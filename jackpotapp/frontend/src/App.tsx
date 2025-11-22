import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SignUpForm from './components/signup-form/SignUpForm';
import Modal from './components/modal/Modal';
import './App.css'

function App() {
  
  return (
    <>
      <Modal>
        <SignUpForm />
      </Modal>
    </>
  )
}

export default App
