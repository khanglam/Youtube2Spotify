import { React, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Styles = styled.div`
  .a {
    color: #bbb;
    &:hover {
      color: white;
    }
  }
`;

export const Register = () => {
  const { register, handleSubmit, errors } = useForm();
  const [userInfo, setUserInfo] = useState();

  const onSubmit = (data) => {
    setUserInfo(data);
    console.log(data);
  };
  console.log(errors);

  return (
    <div class='content-section'>
      <form
        method='POST'
        class=''
        action=''
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <fieldset class='form-group'>
          <legend class='border-bottom mb-4'>Register</legend>
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
              ref={register({ required: "Field is required" })}
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
              ref={register({
                required: "Field is required",
                minLength: { value: 4, message: "Too Short!" },
                maxLength: { value: 20, message: "Too Long!" },
              })}
            ></input>
            <div class='invalid-feedback d-block'>
              {errors.password?.message}
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
              ref={register({
                required: "Field is required",
                minLength: { value: 4, message: "Too Short!" },
                maxLength: { value: 20, message: "Too Long!" },
              })}
            ></input>
            <div class='invalid-feedback d-block'>
              {errors.confirm_password?.message}
            </div>
          </div>
        </fieldset>
        <div class='form-group'>
          <input
            class='btn btn-outline-info'
            name='sign_up'
            type='submit'
            value='Sign Up'
          ></input>
        </div>
      </form>
      <div class='border-top pt-3'>
        <small class='text-muted'>
          Already Have An Account?{" "}
          <a class='ml-2' href='/login'>
            Sign In
          </a>
        </small>
      </div>
    </div>
  );
};
