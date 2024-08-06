import { auth } from "../firebase/config";

interface ApiCallInput {
  url: string;
  formData: FormData;
  callType: string;
}

const adminCollectionName: string = "adminList";
const userCollectionName: string = "userList";
const reporterCollectionName: string = "reporterList";
const categoryCollectionName: string = "categoryList";
const historicalPlaceCollectionName: string = "historicalPlaceList";
const talukaCollectionName: string = "talukaList";
const newsCollectionName: string = "newsList";

async function doApiCall({ url, formData, callType }: ApiCallInput) {
  var methodType = "";

  switch (callType) {
    case "p":
      methodType = "PATCH";
      break;
    case "g":
      methodType = "GET";
      break;
    case "d":
      methodType = "DELETE";
      break;
    default:
      methodType = "POST";
      break;
  }

  const headers = new Headers();
  headers.append(
    "Authorization",
    `Bearer ${await auth.currentUser?.getIdToken()}`
  );

  // "https://news-backend-45h4p5l4ua-el.a.run.app/api".includes('');
  // https://news-admin-panel-45h4p5l4ua-el.a.run.app/auth/login

  // http://localhost:8080/api

  return fetch(`http://localhost:8080/api${url}`, {
    method: methodType,
    body: formData,
    headers: headers,
  });
}

export {
  doApiCall,
  adminCollectionName,
  userCollectionName,
  reporterCollectionName,
  categoryCollectionName,
  historicalPlaceCollectionName,
  talukaCollectionName,
  newsCollectionName
};
