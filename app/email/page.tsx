import React from "react";
import { EmailTemplate } from "./EmailTemplate";

function page() {
  return (
    <div>
      <EmailTemplate
        name="John"
        surname="Doe"
        email="john.doe@gmail.com"
        message="Hello, World!"
      />
    </div>
  );
}

export default page;
