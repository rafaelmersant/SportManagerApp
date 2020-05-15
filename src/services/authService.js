//import jwtDecode from "jwt-decode";
import http from "./httpService";

const apiEndpoint = `/auth`;
const token = {
  userId: "ms_userId",
  email: "ms_email",
  name: "ms_name",
  role: "ms_role",
  athleteId: "ms_athleteId",
};

//http.setJwt(getJwt());

export async function login(credentials) {
  const { data: jwt } = await http.post(`${apiEndpoint}/login/`, credentials);

  sessionStorage.setItem(token.userId, jwt.id);
  sessionStorage.setItem(token.email, jwt.email);
  sessionStorage.setItem(token.name, jwt.name);
  sessionStorage.setItem(token.role, jwt.role);
  sessionStorage.setItem(token.athleteId, jwt.athlete_id);
}

export function logout() {
  sessionStorage.removeItem(token.userId);
  sessionStorage.removeItem(token.email);
  sessionStorage.removeItem(token.name);
  sessionStorage.removeItem(token.role);
  sessionStorage.removeItem(token.athleteId);
}

export function getCurrentUser() {
  try {
    if (!sessionStorage.getItem(token.email)) return null;

    return {
      id: parseInt(sessionStorage.getItem(token.userId)),
      name: sessionStorage.getItem(token.name),
      email: sessionStorage.getItem(token.email),
      role: sessionStorage.getItem(token.role),
      athleteId: sessionStorage.getItem(token.athleteId),
    };

    //jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

// export function getJwt() {
//   return localStorage.getItem(tokenKey);
// }

// export function loginWithJwt(jwt) {
//   localStorage.setItem(tokenKey, jwt);
// }

export default {
  login,
  logout,
  getCurrentUser,
};
