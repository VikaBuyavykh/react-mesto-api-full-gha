import React from "react";
import { AppContext } from "../contexts/AppContext";
import { usePopupClose } from "../hooks/usePopupClose";
import { useNavigate } from "react-router-dom";

export default function InfoTooltip({ isOpen, isRegisterSuccessful, messageText }) {
    const {closeAllPopups} = React.useContext(AppContext);
    usePopupClose(isOpen, closeAllPopups);
    const navigate = useNavigate();
    return (
        <aside 
            className={`popup ${(isOpen ? 'popup_opened' : '')}`}
        >
          <div className="popup__container">
            <button aria-label="Закрыть" type="button" className="popup__close-button" 
                onClick={() => {
                    closeAllPopups();
                    if (isRegisterSuccessful) navigate('/sign-in');
                }} 
            />
            <div className={`popup__mark ${(isRegisterSuccessful ? 'popup__mark_type_successful' : 'popup__mark_type_unsuccessful')}`}></div>
            <p className="popup__message">{messageText}</p>
          </div>
        </aside>
    )
}