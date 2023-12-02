import { useEffect, useState } from 'react';
import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { AppContext } from '../contexts/AppContext';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRouteElement from './ProtectedRoute';
import * as Auth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isOpen = isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isCardPopupOpen || isInfoTooltipOpen;
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRegisterSuccessful, setIsRegisterSuccessful] = useState(false);
  
  function handleInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setIsCardPopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsCardPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleCardLike({ likes, _id } ) {
    const isLiked = likes.some(i => i._id === currentUser._id);
    if (isLiked) {
      api.dislikeCard(_id).then((newCard) => {
        setCards((state) => state.map((c) => c._id === _id ? newCard : c));
      }).catch(console.error);
    } else {
      api.likeCard(_id).then((newCard) => {
          setCards((state) => state.map((c) => c._id === _id ? newCard : c));
      }).catch(console.error);
    }
  }

  function handleCardDelete(_id) {
    api.deleteCard(_id).then(() => {
      setCards((state) => state.filter((c) => c._id !== _id && c));
    }).catch(console.error);
  }

  function handleUpdateUser({name, about}) {
    function makeRequest() {
      return api.editProfileInfo({name, about}).then(setCurrentUser);
    }
    handleSubmit(makeRequest);
  }

  function handleUpdateAvatar({ avatar }) {
    function makeRequest() {
      return api.updateAvatar({ avatar }).then(setCurrentUser);
    }
    handleSubmit(makeRequest);
  }

  function handleAddPlaceSubmit({ name, link }) {
    function makeRequest() {
      return api.addCard({ name, link }).then(newCard => setCards([newCard, ...cards]));
    }
    handleSubmit(makeRequest);
  }

  function handleSubmit(request) {
    setIsLoading(true);
    request()
    .then(closeAllPopups)
    .catch(console.error)
    .finally(() => setIsLoading(false));
  }

  function auth(token) {
    Auth.tokenCheck(token).then((res) => {
      if (res) {
        setUserEmail(res.data.email);
        setLoggedIn(true);
        navigate('/');
      }
    }).catch(() => {
      console.error;
      navigate('/sign-in');
    })
  }

  function handleRegister({ email, password }) {
    Auth.register(email, password).then((response) => {
      if (response.status === 201) {
        setMessage('Вы успешно зарегистрировались!');
        setIsRegisterSuccessful(true);
        return response.json();
      } else {
        setMessage('Что-то пошло не так! Попробуйте  ещё раз.');
        setIsRegisterSuccessful(false);
        return Promise.reject(`Ошибка: ${response.status}`);
      }
    }).catch(console.error)
    .finally(handleInfoTooltip);
  }

  function handleLogin({ email, password }) {
    Auth.authorize(email, password).then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        setLoggedIn(true);
        navigate('/');
      }
    }).catch(console.error);
  }

  function handleSignOut() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/sign-in');
  }

  useEffect(() => {
    api.getProfile().then(setCurrentUser).catch(console.error);
  }, [])

  useEffect(() => {
    api.getCards().then(setCards).catch(console.error);
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth(token);
    }
  }, [loggedIn])

  return (
    <AppContext.Provider value={{closeAllPopups, isLoading}}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">        
          <Header loggedIn={loggedIn} onSignOut={handleSignOut} email={userEmail} />
          <Routes>
            <Route path="/sign-up" element={
              <>
                <Register onRegister={handleRegister}/>
                <InfoTooltip isOpen={isInfoTooltipOpen} isRegisterSuccessful={isRegisterSuccessful} messageText={message} />
              </>
            } />
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={
              <>
                <ProtectedRouteElement loggedIn={loggedIn} component={Main} cards={cards} onCardDelete={handleCardDelete} onCardLike={handleCardLike} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick} />
                <ProtectedRouteElement loggedIn={loggedIn} component={Footer} />
                <ProtectedRouteElement loggedIn={loggedIn} component={EditProfilePopup} onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} />
                <ProtectedRouteElement loggedIn={loggedIn} component={AddPlacePopup} onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} />
                <ProtectedRouteElement loggedIn={loggedIn} component={ImagePopup} card={selectedCard} isOpen={isCardPopupOpen} />
                <ProtectedRouteElement loggedIn={loggedIn} component={PopupWithForm} name="delete" title="Вы уверены?" buttonText="Да" />
                <ProtectedRouteElement loggedIn={loggedIn} component={EditAvatarPopup} onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} />
              </>
            }/>
          </Routes>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  )
}

export default App;