import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
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
      await register(values);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Register"
      submitLabel="Create account"
      values={values}
      error={error}
      isSubmitting={isSubmitting}
      footerText="Already registered?"
      footerLink="/login"
      footerLinkText="Login"
      fields={[
        { name: "name", label: "Name", type: "text", autoComplete: "name" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Password", type: "password", autoComplete: "new-password" }
      ]}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default RegisterPage;
