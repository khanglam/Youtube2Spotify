import { React, useState } from "react";
import { useForm } from "react-hook-form";

function Login() {
  const initialValues = { username: "", password: "" };
  const { register, handleSubmit, errors } = useForm();
  const [userInfo, setUserInfo] = useState();
  const [formValues, setFormValues] = useState(initialValues);

  const onSubmit = (data) => {
    // setUserInfo(data); This is for the JSON presentation
    console.log(data);
  };
  // console.log(errors);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  return (
    <div class='content-section'>
      <form
        // method='POST'
        class=''
        action=''
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
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
              value={formValues.username}
              ref={register({ required: "Username is required" })}
              onChange={handleChange}
            />
            <div class='invalid-feedback d-block'>
              {errors.username?.message}
            </div>
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
              value={formValues.password}
              ref={register({
                required: "Password is required",
                minLength: { value: 4, message: "Too Short!" },
                maxLength: { value: 20, message: "Too Long!" },
              })}
              onChange={handleChange}
            ></input>
            <div class='invalid-feedback d-block'>
              {errors.password?.message}
            </div>
          </div>
          <div class='form-check'>
            <input
              class='form-check-input'
              id='remember'
              name='remember'
              type='checkbox'
            ></input>
            <label class='form-check-label' for='remember'>
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

// <div className='container'>
//   <Form onSubmit={handleSubmit(onSubmit)}>
//     <Form.Group controlId='username'>
//       <Form.Label>Username</Form.Label>
//       <Form.Control
//         type='text'
//         placeholder='Username'
//         ref={register({ required: "Username is required" })}
//         isInvalid={!!errors.username}
//       ></Form.Control>
//     </Form.Group>
//     <Form.Group controlId='password'>
//       <Form.Label>Password</Form.Label>
//       <Form.Control type='text' placeholder='Password'></Form.Control>
//     </Form.Group>
//     <Form.Group controlId='submit'>
//       <Button type='submit' className='my-2' variant='primary'>
//         Login
//       </Button>
//     </Form.Group>
//   </Form>
// </div>
