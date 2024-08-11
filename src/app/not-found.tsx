"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  useEffect(() => {
    document.title = "Page Not Found - MyDhule";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center px-6 py-12">
      <div className="card shadow-lg rounded-lg p-6 bg-white transform transition-transform duration-500 ease-in-out hover:scale-105">
        <h1 className="text-6xl font-bold text-error mb-4 animate__animated animate__fadeIn animate__delay-1s">
          404
        </h1>
        <p className="text-2xl mb-6 animate__animated animate__fadeIn animate__delay-2s">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <div className="space-x-4 mb-6 animate__animated animate__fadeIn animate__delay-3s">
          <button
            className="btn btn-primary px-6 py-3 text-lg shadow-md transition-transform transform hover:scale-105"
            onClick={handleGoBack}
          >
            Go Back
          </button>
          <button
            className="btn btn-secondary px-6 py-3 text-lg shadow-md transition-transform transform hover:scale-105"
            onClick={handleGoHome}
          >
            Go Home
          </button>
        </div>
        <div className="w-full max-w-md animate__animated animate__fadeIn animate__delay-4s">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/mydhule-3635d.appspot.com/o/my_assets%2Ficon%2Fmy%20dhule%20appIcon.png?alt=media&token=2cac825d-2001-43e6-a8e8-9d5d0276d5a9"
            alt="Page Not Found Illustration"
            className="h-auto mx-auto text-center"
            priority={true}
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
