import http from "./httpService";

const apiEndpoint = `/athletes`;
const apiEndpointParent = `/parents`;
const apiEndpointDocument = `/documents`;

function athleteUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function parentUrl(id) {
  return `${apiEndpointParent}/${id}`;
}

function documentUrl(id) {
  return `${apiEndpointDocument}/${id}`;
}

// Athletes
//************************************************************//
export function getAthletes(currentPage, sortColumn) {
  const order = sortColumn && sortColumn.order === "desc" ? "-" : "";
  const column =
    sortColumn && sortColumn.path ? sortColumn.path : "creationDate";
  const page = currentPage ? currentPage : 1;

  if (currentPage)
    return http.get(`${apiEndpoint}/?ordering=${order}${column}&page=${page}`);

  return http.get(`${apiEndpoint}/?ordering=${order}${column}`);
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

export function getAthletesBirthdate(month) {
  return http.get(`/athletes-birthdate/?month=${month}`);
}
//Parents
//************************************************************//
export function getParents(athleteId) {
  return http.get(`${apiEndpointParent}/?athlete_id=${athleteId}`);
}

export function getParent(parentId) {
  return http.get(`${apiEndpointParent}/?id=${parentId}`);
}

export function saveParent(parent) {
  if (parent.id) {
    const body = { ...parent };
    delete body.id;
    return http.put(parentUrl(parent.id), body);
  }

  return http.post(`${apiEndpointParent}/`, parent);
}

export function deleteParent(parentId) {
  return http.delete(parentUrl(parentId));
}

//Documents
//************************************************************//
export function getDocuments(athleteId) {
  return http.get(`${apiEndpointDocument}/?athlete_id=${athleteId}`);
}

export function getDocument(documentId) {
  return http.get(`${apiEndpointDocument}/?id=${documentId}`);
}

export function saveDocument(document) {
  if (document.id) {
    const body = { ...document };
    delete body.id;
    return http.put(documentUrl(document.id), body);
  }

  return http.post(`${apiEndpointDocument}/`, document);
}

export function deleteDocument(documentId) {
  return http.delete(documentUrl(documentId));
}
