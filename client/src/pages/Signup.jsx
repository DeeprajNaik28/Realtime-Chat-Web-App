import { useState } from "react";
import { signupUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
function Signup() {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
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

      const data = await signupUser(formData);

      console.log(data);

      alert("Signup Successful");

localStorage.setItem(
  "userInfo",
  JSON.stringify(data)
);

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
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">

      <div className="w-full max-w-md bg-[#1a1a1d] p-8 rounded-3xl shadow-2xl border border-gray-800">

        <h1 className="text-4xl font-bold text-center mb-8">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#111] border border-gray-700 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#111] border border-gray-700 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#111] border border-gray-700 outline-none"
          />

          <button
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-4 rounded-xl font-semibold"
          >
            Sign Up
          </button>

        </form>

      </div>

    </div>
  );
}

export default Signup;