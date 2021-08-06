import { createBrowserHistory } from "history";

const decodeJwtToken = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  //console.log("Jwt Decode" + jsonPayload);
  return JSON.parse(jsonPayload);
};

const handleLogout = () => {
  let appState = {
    isLoggedIn: false,
    user: {},
  };
  // save app state with user date in local storage
  localStorage["appState"] = JSON.stringify(appState);
  let history = createBrowserHistory();
  history.push("/login");
  window.location.reload();
};

export const getAccessToken = () => {
  let state = localStorage["appState"];
  if (state) {
    let AppState = JSON.parse(state);
    if (AppState.isLoggedIn == true) {
      let payload = {};
      payload = decodeJwtToken(AppState.user_token);
      if (payload.exp < Date.now() / 1000) {
        console.log("Bethel! the token has expired");
        handleLogout();
      } else {
        return AppState.user_token;
      }
    }
  }
};
