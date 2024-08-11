import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import { Timestamp } from "firebase/firestore";

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

  // "https://news-backend-45h4p5l4ua-el.a.run.app/api";
  // https://news-admin-panel-45h4p5l4ua-el.a.run.app/auth/login

  // http://localhost:8080/api

  return fetch(`http://localhost:8080/api${url}`, {
    method: methodType,
    body: formData,
    headers: headers,
  });
}

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const showToast = (message: string, type: "s" | "e") => {
  if (type === "s") {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: "light",
      // transition: ,
    });
  } else if (type === "e") {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: "light",
      // transition: ,
    });
  }
};

export {
  doApiCall,
  formatDate,
  showToast,
  adminCollectionName,
  userCollectionName,
  reporterCollectionName,
  categoryCollectionName,
  historicalPlaceCollectionName,
  talukaCollectionName,
  newsCollectionName,
};
