import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = `${apiUrl}/athletes`;

function athleteUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getAthletes() {
  return http.get(`${apiEndpoint}/`);
}

export function getAthletesByName(searchText) {
  if (searchText) return http.get(`${apiEndpoint}/?search=${searchText}`);

  return http.get(`${apiEndpoint}/`);
}

export function getAthleteByFirstLastName(firstName, lastName) {
  return http.get(
    `${apiEndpoint}/?first_name=${firstName}&last_name=${lastName}`
  );
}

export function getAthlete(athleteId) {
  return http.get(`${apiEndpoint}/?id=${athleteId}`);
}

export function saveAthlete(athlete) {
  if (athlete.id) {
    const body = { ...athlete };
    delete body.id;
    return http.put(athleteUrl(athlete.id), body);
  }

  return http.post(`${apiEndpoint}/`, athlete);
}

export function deleteAthlete(athleteId) {
  return http.delete(athleteUrl(athleteId));
}
