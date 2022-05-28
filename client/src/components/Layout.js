import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "../App.css";

function Layout(props) {
  return (
    <>
      <header class='site-header'>
        <NavigationBar />
      </header>
      <main role='main'>
        <div class='container'>{props.children}</div>
      </main>
    </>
  );
}
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // form.classList.add("was-validated");
      },
      false
    );
  });
})();
export default Layout;
