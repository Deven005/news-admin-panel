"use client";
import React from "react";
import LoginForm from "../../components/auth/login/LoginForm";
import Image from "next/image";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.section
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="card bg-white/70 backdrop-blur-md shadow-2xl rounded-lg">
          <div className="card-body flex flex-col md:flex-row items-center justify-center text-center p-6 space-y-6 md:space-y-0 md:space-x-6">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="md:w-1/2"
            >
              <Image
                src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                alt="Sample image"
                width={800}
                height={533}
                layout="responsive"
                className="rounded-lg shadow-lg object-cover w-full"
                priority={true}
              />
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-4">Please login to your account</p>
              <LoginForm />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Login;
