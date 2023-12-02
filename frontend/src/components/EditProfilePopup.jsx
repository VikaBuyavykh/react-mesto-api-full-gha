import PopupWithForm from "./PopupWithForm";
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";
import { useForm } from "../hooks/useForm";

export default function EditProfilePopup({ onUpdateUser, isOpen }) {
    const currentUser = React.useContext(CurrentUserContext);
    const {isLoading} = React.useContext(AppContext);
    const {values, handleChange, setValues} = useForm({ name: '', occupation: '' });
    
    React.useEffect(() => {
      setValues({ name: currentUser.name, occupation: currentUser.about })
    }, [currentUser, isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateUser({
            name: values.name,
            about: values.occupation
        });
    }

    return (
        <PopupWithForm name="edit" title="Редактировать профиль" buttonText={isLoading? 'Сохранение...' : 'Сохранить'} isOpen={isOpen} onSubmit={handleSubmit}>
          <div className="popup__input-contaner">
            <input className="popup__form-item" type="text" id="name" name="name" value={values.name || ''} onChange={handleChange}
              minLength="2" maxLength="40" required />
            <span className="popup__error-message" id="error-name"></span>
          </div>
          <div className="popup__input-contaner">
            <input className="popup__form-item" type="text" id="occupation" name="occupation" value={values.occupation || ''} onChange={handleChange}
              minLength="2" maxLength="200" required />
            <span className="popup__error-message" id="error-occupation"></span>
          </div>
        </PopupWithForm>
    )
}