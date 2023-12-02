import { useState } from 'react';
import logoPath from '../images/logo.png';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ loggedIn, onSignOut, email }) {
    const location = useLocation();
    const [isContentVisible, setIsContentVisible] = useState(false);
    function handleContent() {
        if (isContentVisible) {
            setIsContentVisible(false);
        } else {
            setIsContentVisible(true);
        }
    }

    return (
        <header className={`header ${!loggedIn ? 'header_public' : ''}`}>
            {!loggedIn 
            ? (
                <img src={logoPath} alt="Изображение логотипа 
                с надписью Mesto и подписью Russia в верхнем регистре" 
                className="header__logo" />
            ) : (
                <div className='header__main'>
                    <img src={logoPath} alt="Изображение логотипа 
                    с надписью Mesto и подписью Russia в верхнем регистре" 
                    className="header__logo" />
                    <div className={`header__button ${isContentVisible ? 'header__button_type_cross' : 'header__button_type_list'}`} onClick={handleContent}/>
                </div>
            )}

            {!loggedIn 
            ? (
                (location.pathname === '/sign-in') ? 
                (<Link to="/sign-up" className="header__link">Регистрация</Link>) : 
                (<Link to="/sign-in" className="header__link">Войти</Link>)
            ) : (
                <div className={`header__content ${isContentVisible ? 'header__content_visible' : ''}`}>
                    <p className='header__email'>{email}</p>
                    <p onClick={onSignOut} className="header__sign-out">Выйти</p>
                </div>
            )}
        </header>
    );
}