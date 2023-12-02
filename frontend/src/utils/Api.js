class Api {
    constructor({ url, headers }) {
        this._url = url;
        this._headers = headers;
    }

    _getResponse(response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(`Ошибка: ${response.status}`);
        };
    }

    getProfile() {
        return fetch(`${this._url}/users/me`, {
            headers: this._headers,
        }).then(this._getResponse);
    }

    getCards() {
        return fetch(`${this._url}/cards`, {
            headers: this._headers,
        }).then(this._getResponse);
    }

    editProfileInfo(data) {
        return fetch(`${this._url}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._getResponse);
    }

    updateAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._getResponse);
    }

    deleteCard(id) {
        return fetch(`${this._url}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
        }).then(this._getResponse);
    }

    addCard(data) {
        return fetch(`${this._url}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(data)
        }).then(this._getResponse);
    }

    likeCard(id) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: "PUT",
            headers: this._headers
        }).then(this._getResponse);
    }

    dislikeCard(id) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: "DELETE",
            headers: this._headers
        }).then(this._getResponse);
    }
}

const api = new Api({
    url: "https://mesto.nomoreparties.co/v1/cohort-74/",
    headers:{
      "authorization": "8ee087a1-574b-4653-9d38-cba130f24935",
      "Content-Type": "application/json"
    }
  });

export default api;