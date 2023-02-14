import { React, useState, useEffect, useRef } from "react";
import Axios from "../Axios";
import { NavLink } from "react-router-dom";

export const Register = () => {
  const initialValues = { username: "", password: "", confirm_password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const focusUserName = useRef(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setfailureMessage] = useState("");

  const REGISTER_URL = "/register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setIsSubmit(true);

    try {
      if (Object.keys(errors).length === 0) {
        const response = await Axios.post(REGISTER_URL, formValues);
        setfailureMessage(""); // Clear the error message
        setSuccessMessage(response.data);
        // window.location.href = "/";
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setfailureMessage(error.response.data.errorMessage);
      } else {
        console.log(error);
      }
      focusUserName.current.focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    if (isSubmit) {
      validate(formValues);
    }
  }, [formValues]);

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Too Short!";
    } else if (values.password.length > 10) {
      errors.password = "Too Long!";
    }
    if (!values.confirm_password) {
      errors.confirm_password = "Required Field";
    } else if (values.confirm_password !== values.password) {
      errors.confirm_password = "Password does not match";
    }

    setFormErrors(errors);
    return errors;
  };

  return (
    <div class="content-section">
      <div>
        {failureMessage ? (
          <div class="alert alert-danger">{failureMessage}</div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {successMessage !== "" ? (
          <div class="alert alert-success">{successMessage}</div>
        ) : (
          <div></div>
        )}
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset class="form-group">
          <legend class="border-bottom mb-4">Register</legend>
          <div class="form-group">
            <label class="form-label" for="username">
              Username
            </label>
            <input
              class="form-control"
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              ref={focusUserName}
              onChange={handleChange}
            />
            <div class="invalid-feedback d-block">{formErrors.username}</div>
          </div>
          <div class="form-group">
            <label class="form-control-label" for="password">
              Password
            </label>
            <input
              class="form-control"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
            ></input>
            <div class="invalid-feedback d-block">{formErrors.password}</div>
          </div>
          <div class="form-group">
            <label class="form-control-label" for="confirm_password">
              Confirm Password
            </label>
            <input
              class="form-control"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              type="password"
              onChange={handleChange}
            ></input>
            <div class="invalid-feedback d-block">
              {formErrors.confirm_password}
            </div>
          </div>
        </fieldset>
        <div class="form-group">
          <input
            class="btn btn-outline-info"
            name="sign_up"
            type="submit"
            value="Sign Up"
          ></input>
        </div>
      </form>
      <div class="border-top pt-3">
        <small class="text-muted">
          Already Have An Account?{" "}
          <NavLink to="/login" className="ml-2">
            Sign In
          </NavLink>
        </small>
      </div>
    </div>
  );
};
