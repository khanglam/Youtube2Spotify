import React from 'react';

function Login() {
  return (
    <div class="content-section">
        <form method="POST" action="">
            <fieldset class="form-group">
                <legend class="border-bottom mb-4">Log In</legend>
                <div class="form-group">
                  <label class="form-control-label" for="email">Email</label>
                  <input class="form-control form-control-lg" id="email" name="email" required="" type="text" value=""></input>
                </div>
            </fieldset>
        </form>
    </div>
      
  )
}

export default Login;