import { useForm } from "../hooks/useForm";
import { Link } from "react-router-dom";

export default function Register({ onRegister }) {
    const {values, handleChange} = useForm({ email: '', password: '' });
    
    function handleSubmit(evt) {
        evt.preventDefault();
        const {email, password} = values;
        onRegister({ email, password });
    }

    return (
        <div className="popup__container popup__container_dark-theme">
            <h2 className="popup__title popup__title_dark-theme">Регистрация</h2>
            <form name="registerForm" className="popup__form" onSubmit={handleSubmit}>
                <div className="popup__input-contaner">
                    <input className="popup__form-item popup__form-item_dark-theme" type="email" id="email" name="email" value={values.email || ''}
                    placeholder="Email" onChange={handleChange} minLength="2" maxLength="200" required />
                    <span className="popup__error-message" id="error-email"></span>
                </div>
                <div className="popup__input-contaner">
                    <input className="popup__form-item popup__form-item_dark-theme" type="password" id="password" name="password" value={values.password || ''} 
                    placeholder="Пароль" onChange={handleChange} minLength="2" maxLength="200" required />
                    <span className="popup__error-message" id="error-password"></span>
                </div>
                <button aria-label="Зарегистрироваться" type="submit" className="popup__submit-button popup__submit-button_dark-theme">Зарегистрироваться</button>
                <Link to="/sign-in" className="popup__link">Уже зарегистрированы? Войти</Link>
            </form>
          </div>
    )
}