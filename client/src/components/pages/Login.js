import { React, useState, useEffect, useRef, useCallback } from "react";
import Axios from "../Axios";

function Login() {
  const initialValues = { username: "", password: "", remember_me: false };
  // const { register, handleSubmit, errors } = useForm();
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const isMounted = useRef(false); // Unused for now
  const focusUserName = useRef(false);

  const LOGIN_URL = "/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setIsSubmit(true);

    try {
      // if (Object.keys(formValues).length == 0 && isSubmit) {
      if (Object.keys(errors).length == 0) {
        const response = await Axios.post(LOGIN_URL, formValues);
        window.location.href = "/";
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setFormErrors({ formErrors, connection: "No Server Response" });
      } else if (error.response?.status === 401) {
        setFormErrors(error.response.data);
      } else {
        setFormErrors({ formErrors, connection: "Login Failed" });
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
    setFormErrors(errors);
    return errors;
  };

  // UseRef for Initial On-Mount of everything
  const useIsMount = () => {
    useEffect(() => {
      isMounted.current = false;
    }, []);
    return isMounted.current;
  };

  return (
    <div class='content-section'>
      <div class='invalid-feedback d-block'>{formErrors.connection}</div>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset class='form-group'>
          <legend class='border-bottom mb-4'>Log In</legend>
          <div class='form-group'>
            <label class='form-label' for='username'>
              Username
            </label>
            <input
              class='form-control'
              id='username'
              name='username'
              type='text'
              placeholder='Username'
              // value={formValues.username}
              ref={focusUserName}
              onChange={handleChange}
            />
            <div class='invalid-feedback d-block'>{formErrors.username}</div>
          </div>
          <div class='form-group'>
            <label class='form-control-label' for='password'>
              Password
            </label>
            <input
              class='form-control'
              id='password'
              name='password'
              placeholder='Password'
              type='password'
              // value={formValues.password}
              onChange={handleChange}
            ></input>
            <div class='invalid-feedback d-block'>{formErrors.password}</div>
          </div>
          <div class='form-check'>
            <input
              class='form-check-input'
              id='remember_me'
              name='remember_me'
              type='checkbox'
              onChange={handleChange}
            ></input>
            <label class='form-check-label' for='remember_me'>
              Remember Me
            </label>
          </div>
        </fieldset>
        <div class='form-group'>
          <input
            class='btn btn-outline-info'
            id='submit'
            name='submit'
            type='submit'
            value='Login'
          ></input>
        </div>
      </form>
    </div>
  );
}
// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function () {
//   "use strict";

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   var forms = document.querySelectorAll(".needs-validation");

//   // Loop over them and prevent submission
//   Array.prototype.slice.call(forms).forEach(function (form) {
//     form.addEventListener(
//       "submit",
//       function (event) {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// })();
export default Login;
