import { React, useState, useEffect, useRef, useContext } from 'react';
import Axios from '../Axios';
import { UserContext } from '../UserContext';
import { NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function Account() {
  const initialValues = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setfailureMessage] = useState('');
  const { username } = useContext(UserContext);

  const REGISTER_URL = '/change_password';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setIsSubmit(true);

    try {
      if (Object.keys(errors).length === 0) {
        const response = await Axios.post(REGISTER_URL, formValues);
        console.log(response);
        setfailureMessage(''); // Clear the error message
        setSuccessMessage(response.data);
        // window.location.href = "/";
      }
    } catch (error) {
      if (error.response?.status) {
        setSuccessMessage('');
        setfailureMessage(error.response.data.errorMessage);
      } else {
        console.log(error);
      }
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
    if (!values.current_password) {
      errors.current_password = 'You must know the password before changing';
    }
    if (!values.new_password) {
      errors.new_password = 'Password is required!';
    } else if (values.new_password.length < 4) {
      errors.new_password = 'Too Short!';
    } else if (values.new_password.length > 10) {
      errors.new_password = 'Too Long!';
    }
    if (!values.confirm_password) {
      errors.confirm_password = 'Required Field';
    } else if (values.confirm_password !== values.new_password) {
      errors.confirm_password = 'Password does not match';
    }

    setFormErrors(errors);
    return errors;
  };

  return (
    <>
      <Container
        style={{
          height: '90vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div class='content-section'>
          <div>
            {failureMessage ? (
              <div class='alert alert-danger'>{failureMessage}</div>
            ) : (
              <div></div>
            )}
          </div>
          <div>
            {successMessage ? (
              <div class='alert alert-success'>{successMessage}</div>
            ) : (
              <div></div>
            )}
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <fieldset class='form-group'>
              <legend class='border-bottom mb-4'>
                Change Password for <b>{username}</b>
              </legend>
              <div class='form-group'>
                <label class='form-control-label' for='current_password'>
                  Current Password
                </label>
                <input
                  class='form-control'
                  id='current_password'
                  name='current_password'
                  placeholder='Current Password'
                  type='password'
                  onChange={handleChange}
                ></input>
                <div class='invalid-feedback d-block'>
                  {formErrors.current_password}
                </div>
              </div>
              <div class='form-group'>
                <label class='form-control-label' for='new_password'>
                  New Password
                </label>
                <input
                  class='form-control'
                  id='new_password'
                  name='new_password'
                  placeholder='New Password'
                  type='password'
                  onChange={handleChange}
                ></input>
                <div class='invalid-feedback d-block'>
                  {formErrors.new_password}
                </div>
              </div>
              <div class='form-group'>
                <label class='form-control-label' for='confirm_password'>
                  Confirm Password
                </label>
                <input
                  class='form-control'
                  id='confirm_password'
                  name='confirm_password'
                  placeholder='Confirm Password'
                  type='password'
                  onChange={handleChange}
                ></input>
                <div class='invalid-feedback d-block'>
                  {formErrors.confirm_password}
                </div>
              </div>
            </fieldset>
            <div class='form-group'>
              <input
                class='btn btn-outline-info'
                name='sign_up'
                type='submit'
                value='Change Password'
              ></input>
            </div>
          </form>
          <div class='border-top pt-3'>
            <small class='text-muted'>
              Not You?{' '}
              <NavLink to='/logout' className='ml-2'>
                Log out
              </NavLink>
            </small>
          </div>
        </div>
      </Container>
    </>
  );
}
export default Account;
