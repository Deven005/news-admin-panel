import { toast } from "react-toastify";
import { auth } from "../firebase/config";

interface ApiCallInput {
  url: string;
  formData?: FormData;
  callType: string;
}

const adminCollectionName: string = "adminList";
const userCollectionName: string = "userList";
const reporterCollectionName: string = "reporterList";
const categoryCollectionName: string = "categoryList";
const historicalPlaceCollectionName: string = "historicalPlaceList";
const talukaCollectionName: string = "talukaList";
const newsCollectionName: string = "newsList";
const advertisesCollectionName: string = "advertises";

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
  // API_URL

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

const convertTimestampToDate = (timestamp: {
  _seconds: number;
  _nanoseconds: number;
}): string => {
  if (
    !timestamp ||
    typeof timestamp._seconds !== "number" ||
    typeof timestamp._nanoseconds !== "number"
  ) {
    return "Invalid Date"; // Handle unexpected inputs
  }

  const milliseconds =
    timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6);
  const date = new Date(milliseconds);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
};

export {
  doApiCall,
  formatDate,
  showToast,
  convertTimestampToDate,
  adminCollectionName,
  userCollectionName,
  reporterCollectionName,
  categoryCollectionName,
  historicalPlaceCollectionName,
  talukaCollectionName,
  newsCollectionName,
  advertisesCollectionName,
};
