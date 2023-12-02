import { useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm";
import React from "react";
import { AppContext } from "../contexts/AppContext";
import { useForm } from "../hooks/useForm";

export default function AddPlacePopup({ onAddPlace, isOpen }) {
    const {isLoading} = React.useContext(AppContext);
    const {values, handleChange, setValues} = useForm({ cardName: '', cardLink: '' });

    function handleSubmit(e) {
        e.preventDefault();

        onAddPlace({
            name: values.cardName,
            link: values.cardLink
        });
    }

    useEffect(() => {
        setValues({ cardName: '', cardLink: '' });
    }, [isOpen]);

    return (
        <PopupWithForm name="add" title="Новое место" buttonText={isLoading ? 'Сохранение...' : 'Создать'} isOpen={isOpen} onSubmit={handleSubmit}>
          <div className="popup__input-contaner">
            <input className="popup__form-item" type="text" id="cardName" name="cardName" placeholder="Название" 
              minLength="2" maxLength="30" onChange={handleChange} value={values.cardName} required />
            <span className="popup__error-message" id="error-cardName"></span>
          </div>
          <div className="popup__input-contaner">
            <input className="popup__form-item" type="url" id="cardLink" name="cardLink" 
              placeholder="Ссылка на картинку" onChange={handleChange} value={values.cardLink} required />
            <span className="popup__error-message" id="error-cardLink"></span>
          </div>
        </PopupWithForm>
    )
}