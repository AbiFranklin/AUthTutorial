import auth0 from "auth0-js";

const REDIRECT = "redirect_on_login"

let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = "openid profile email read:courses";
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: "token id_token",
            scope: this.requestedScopes
        });
    }

    login = () => {
        localStorage.setItem(REDIRECT, JSON.stringify(this.history.location))
        this.auth0.authorize();
    };

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                const redirectLocation = localStorage.getItem(REDIRECT) === "undefined" ? "/" : JSON.parse(localStorage.getItem(REDIRECT));
                this.history.push(redirectLocation);
            } else if (err) {
                this.history.push("/");
                alert(`Error: ${err.error}`);
                console.log(err);
            }
            localStorage.removeItem(REDIRECT)
        });
    };

    setSession = authResult => {
        _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
        _scopes = authResult.scope || this.requestedScopes || "";
        _accessToken = authResult.accessToken;
        _idToken = authResult.idToken;
        this.scheduleRenewal()
    };

    isAuthenticated() {
        return new Date().getTime() < _expiresAt;
    }

    logout = () => {
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: "http://localhost:3000"
        });
    };

    getAccessToken = () => {
        if (!_accessToken) {
            throw new Error("No access token found.");
        }
        return _accessToken;
    };

    getProfile = cb => {
        if (this.userProfile) return cb(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            cb(profile, err);
        });
    };

    userHasScopes(scopes) {
        const grantedScopes = (_scopes || "").split(" ");
        return scopes.every(scope => grantedScopes.includes(scope));
    }

    renewToken(cb) {
        this.auth0.checkSession({}, (err, result) => {
            if (err) {
                console.log(`Error: ${err.error} - ${err.description}`);
            } else {
                this.setSession(result);
            }
            if (cb) cb(err, result);
        })
    }

    scheduleRenewal() {
        const delay = _expiresAt - Date.now();
        if (delay > 0) setTimeout(() => this.renewToken(), delay)
    }
}
