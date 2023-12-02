import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card({ likes, link, name, onCardClick, onCardLike, owner, _id, onCardDelete }) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = owner._id === currentUser._id;
    const isLiked = likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = (`element__like-button ${isLiked && 'element__like-button_active'}`);
    
    function handleClick() {
        onCardClick({ name, link });
    }

    function handleLikeClick() {
        onCardLike({ likes, _id });
    }

    function handleDeleteClick() {
        onCardDelete(_id);
    }

    return (
        <div className="element">
            <button aria-label="Открыть" type="button" className="element__open-button" onClick={handleClick}>
                <img alt={name} src={link} className="element__img" />
            </button>
            <div className="element__text-section">
                <h2 className="element__text">{name}</h2>
                <div className="element__like-section">
                    <button aria-label="Нравится" type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <p className="element__number-of-likes">{likes.length}</p>
                </div>
            </div>
            {isOwn && <button aria-label="Удалить" type="button" className="element__delete-button" onClick={handleDeleteClick} />}
        </div>
    );
}