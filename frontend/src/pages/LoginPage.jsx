import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setValues((currentValues) => ({
      ...currentValues,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(values);
      navigate(location.state?.from?.pathname || "/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      submitLabel="Login"
      values={values}
      error={error}
      isSubmitting={isSubmitting}
      footerText="Need an account?"
      footerLink="/register"
      footerLinkText="Register"
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "current-password"
        }
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
