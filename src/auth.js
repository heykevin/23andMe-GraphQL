import fetch from "node-fetch";
import FormData from "form-data";
import config from "../config.js";

const BASE_URL = "https://api.23andme.com";

const handleErrors = (compressedRes) => {
  if (compressedRes.status !== 200) {
    console.log("error", compressedRes);
    throw new Error(compressedRes.statusText);
  }
  return compressedRes.json();
};

let instance = null;

export default class Auth {
    constructor(demoMode) {
        if (!instance) {
          instance = this;
        }

        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.redirectUri = `${config.uri}/receive_code/`;
        this.scope = 'basic names';
        this.token = null;
        this.demo = false;
        
        if (demoMode) {
            this.demo = true;
        }
        return instance;
    };
  
    getToken(authCode) {
        let form = new FormData();
        form.append("client_id", this.clientId);
        form.append("client_secret", this.clientSecret);
        form.append("grant_type", "authorization_code");
        form.append("code", authCode);
        form.append("redirect_uri", this.redirectUri);
        form.append("scope", this.scope);
        return fetch(`${BASE_URL}/token/`, {
            method:"post",
            body: form,
            compress: true
        }).then((compressedRes) => {
            return handleErrors(compressedRes);
        }).then((token) => {
            this.token = token;
            return token;
        });
    }

    get(path) {
      if (!this.token) {
        console.log("No token man");
      }
      if (this.demo){
        path = "/demo" + path;
      }
      return fetch(`${BASE_URL}/1${path}`, {
        method: "get",
        headers: {Authorization: `Bearer ${this.token.access_token}`}
      }).then((res) => {
        return handleErrors(res);
      }).then((body) => {
        return body;
      });
    }
}
