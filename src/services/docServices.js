import http from "./httpService";

const apiEndpointDocument = `docs`;

function documentUrl(id) {
  return `${apiEndpointDocument}/${id}`;
}

export function getDocuments(source) {
  return http.get(
    `${apiEndpointDocument}/?source=${source}&ordering=-creation_date`
  );
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
