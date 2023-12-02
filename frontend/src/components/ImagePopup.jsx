import React from "react";
import { AppContext } from "../contexts/AppContext";
import { usePopupClose } from "../hooks/usePopupClose";

export default function ImagePopup({ card, isOpen }) {
const {closeAllPopups} = React.useContext(AppContext);
usePopupClose(isOpen, closeAllPopups);
    return (
        <aside 
            className={`popup popup_type_open-image ${isOpen ? 'popup_opened' : ''}`}
        >
          <div className="popup__content">
            <button aria-label="Закрыть" type="button" className="popup__close-button popup__close-button_open-image-element" onClick={closeAllPopups}></button>
            <img className="popup__img" alt={card.name} src={`${card.link}`} />
            <h2 className="popup__text">{card.name}</h2>
          </div>
        </aside>
    );
}