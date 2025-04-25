import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "./ui/Inputfield";
import Button from "./ui/button";
import ToastComponent from "./ui/ToastComponent";
import { toast } from "react-toastify";
import { AppContent } from "./context/AppContext";

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const togglePasswordVisibility = () =>
    setIsPasswordShown((prevState) => !prevState);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Send credentials (token)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful! Redirecting...");
        setIsLoggedin(true);

        // ✅ Ensure we fetch user data AFTER login
        await getUserData();

        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google OAuth endpoint
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#5F41E4] bg-image-login">
        <div className="w-full max-w-[410px] p-6 rounded-lg bg-white shadow-lg">
          <h2 className="text-left text-[2rem] font-semibold mb-5 text-black">
            Login
          </h2>
          <p className="text-left text-lg font-medium text-gray-700 mb-6">
            Enter your email below to login to your account
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              id="password"
              label="Password"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              isPasswordShown={isPasswordShown}
              togglePasswordVisibility={togglePasswordVisibility}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <a
              href="/reset-password"
              className="block text-right text-[#007bff] text-sm hover:underline"
            >
              Forgot password?
            </a>

            <Button
              text={isLoading ? "Logging in..." : "Log In"}
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            />
          </form>

          <Button
            text="Login with google"
            // onClick={}
            variant="secondary"
          />

          <p className="text-center text-base font-medium mt-7 mb-1">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#5F41E4] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <ToastComponent />
    </>
  );
};

export default Login;
