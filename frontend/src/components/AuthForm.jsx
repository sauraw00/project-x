import { Link } from "react-router-dom";

const AuthForm = ({
  title,
  submitLabel,
  fields,
  values,
  error,
  isSubmitting,
  footerText,
  footerLink,
  footerLinkText,
  onChange,
  onSubmit
}) => {
  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={onSubmit}>
        <div>
          <p className="eyebrow">Account</p>
          <h1>{title}</h1>
        </div>

        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              value={values[field.name]}
              onChange={onChange}
              autoComplete={field.autoComplete}
              required
            />
          </label>
        ))}

        {error ? <p className="error-message">{error}</p> : null}

        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : submitLabel}
        </button>

        <p className="form-footer">
          {footerText} <Link to={footerLink}>{footerLinkText}</Link>
        </p>
      </form>
    </main>
  );
};

export default AuthForm;
