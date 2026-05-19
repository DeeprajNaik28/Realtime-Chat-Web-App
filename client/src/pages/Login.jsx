import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

      localStorage.setItem(
        "userInfo",
        JSON.stringify(data)
      );

      alert("Login Successful");

      navigate("/");

      window.location.reload();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#1a1a1d] p-8 rounded-3xl shadow-2xl border border-gray-800">

        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Welcome Back
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#111] border border-gray-700 outline-none text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#111] border border-gray-700 outline-none text-white"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-4 rounded-xl font-semibold text-white"
          >
            Login
          </button>

        </form>


        <p className="text-center text-gray-400 mt-6">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300"
          >
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;
