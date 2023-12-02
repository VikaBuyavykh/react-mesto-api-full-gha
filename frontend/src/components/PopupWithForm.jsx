import React from "react";
import { AppContext } from "../contexts/AppContext";
import { usePopupClose } from "../hooks/usePopupClose";

export default function PopupWithForm({ name, title, buttonText, isOpen, children, onSubmit }) {
  const {closeAllPopups} = React.useContext(AppContext);
  usePopupClose(isOpen, closeAllPopups);
    return (
        <aside 
            className={`popup popup_type_${name} ${(isOpen ? 'popup_opened' : '')}`}
        >
          <div className="popup__container">
            <button aria-label="Закрыть" type="button" className="popup__close-button" onClick={closeAllPopups} />
            <h2 className="popup__title">{title}</h2>
            <form name={`${name}Form`} className="popup__form" onSubmit={onSubmit}>
              {children}
              <button aria-label={buttonText} type="submit" className="popup__submit-button">{buttonText}</button>
            </form>
          </div>
        </aside>
    );
}