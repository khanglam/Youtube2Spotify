import { React, useState, useEffect, useRef, useContext } from "react";
import Axios from "../Axios";
import { UserContext } from "../UserContext";

function Login() {
  const initialValues = { username: "", password: "", remember_me: false };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const isMounted = useRef(false); // Unused for now
  const focusUserName = useRef(false);
  const { setIsLoggedIn } = useContext(UserContext);

  const LOGIN_URL = "/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setIsSubmit(true);

    try {
      if (Object.keys(errors).length === 0) {
        const response = await Axios.post(LOGIN_URL, formValues);
        setIsLoggedIn(true);
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
    <div className='content-section'>
      <div className='invalid-feedback d-block'>{formErrors.connection}</div>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className='form-group'>
          <legend className='border-bottom mb-4'>Log In</legend>
          <div className='form-group'>
            <label className='form-label' for='username'>
              Username
            </label>
            <input
              className='form-control'
              id='username'
              name='username'
              type='text'
              placeholder='Username'
              // value={formValues.username}
              ref={focusUserName}
              onChange={handleChange}
            />
            <div className='invalid-feedback d-block'>
              {formErrors.username}
            </div>
          </div>
          <div className='form-group'>
            <label className='form-control-label' for='password'>
              Password
            </label>
            <input
              className='form-control'
              id='password'
              name='password'
              placeholder='Password'
              type='password'
              // value={formValues.password}
              onChange={handleChange}
            ></input>
            <div className='invalid-feedback d-block'>
              {formErrors.password}
            </div>
          </div>
          <div className='form-check'>
            <input
              className='form-check-input'
              id='remember_me'
              name='remember_me'
              type='checkbox'
              onChange={handleChange}
            ></input>
            <label className='form-check-label' for='remember_me'>
              Remember Me
            </label>
          </div>
        </fieldset>
        <div className='form-group'>
          <input
            className='btn btn-outline-info'
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
export default Login;
