export const BASE_URL = 'https://auth.nomoreparties.co';

function getResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Ошибка: ${response.status}`);
  }
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password, email})
    })
};
  
export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({password, email})
    })
    .then(getResponse);
};
  
export const tokenCheck = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(getResponse);
}