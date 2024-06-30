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
    `Authorization ${await auth.currentUser?.getIdToken()}`
  );

  return fetch(`http://localhost:3000/api${url}`, {
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
};
