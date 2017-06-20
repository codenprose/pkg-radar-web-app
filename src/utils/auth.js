import auth0 from 'auth0-js'

import history from './history'


export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  auth0 = new auth0.WebAuth({
    domain: 'dkh215.auth0.com',
    clientID: '3EcDQT2bQj5591sVy1UZ9Ahc4CEirOuT',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://dkh215.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  })
  
  // Looks for an authentication result in the URL hash and processes it with the 
  // parseHash method from auth0.js
  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        // history.replace('/callback');
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        console.log(err);
      }
    });
  }

  // Sets the user's access_token, id_token, and a time at which the access_token 
  // will expire
  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('auth0IdToken', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('authResult', authResult)
    // navigate to the home route
    history.replace('/callback');
  }

  // Authorizes the user
  login() {
    this.auth0.authorize()
  }

  // Removes the user's tokens from browser storage
  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth0IdToken');
    localStorage.removeItem('expires_at');
    // navigate to the home route
    history.replace('/');
  }

  // Checks whether the expiry time for the access_token has passed
  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}