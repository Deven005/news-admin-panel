import { toast } from "react-toastify";
import { auth } from "../firebase/config";
import { Timestamp } from "firebase/firestore";

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
const storesCollectionName: string = "stores";

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
  // "https://news-backend-573329204030.asia-south1.run.app/api";

  // https://news-admin-panel-45h4p5l4ua-el.a.run.app/auth/login
  // https://news-admin-panel-573329204030.asia-south1.run.app/auth/login

  // http://localhost:8080/api
  // API_URL

  return fetch(
    `https://news-backend-573329204030.asia-south1.run.app/api${url}`,
    {
      method: methodType,
      body: formData,
      headers: headers,
    }
  );
}

const formatDate = (date: Timestamp | Date | string | undefined) => {
  if (!date) return "N/A";

  let d: Date;

  if (date instanceof Timestamp) {
    d = date.toDate();
  } else if (typeof date === "string") {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else {
    return "N/A";
  }

  if (isNaN(d.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return d.toLocaleString("en-US", options);
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

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export {
  doApiCall,
  formatDate,
  showToast,
  convertTimestampToDate,
  calculateDistance,
  adminCollectionName,
  userCollectionName,
  reporterCollectionName,
  categoryCollectionName,
  historicalPlaceCollectionName,
  talukaCollectionName,
  newsCollectionName,
  advertisesCollectionName,
  storesCollectionName,
};
