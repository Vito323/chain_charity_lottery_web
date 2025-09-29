"use client";
import React from "react";
import _ from 'lodash'
interface FormFields {
  name: string;
  email: string;
  subject: string;
  lastname: string;
  events: string;
  notes: string;
}

const ContactForm = () => {
  const [error, setError] = React.useState<FormFields>();
  const [field, setField] = React.useState<FormFields>({
    name: "",
    email: "",
    subject: "",
    lastname: "",
    events: "",
    notes: "",
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormFields;
    const errorData = error || ({} as FormFields);
    errorData[name] = "";
    setError(errorData);
    setField({
      ...field,
      [name]: e.target.value,
    });
  };

  const subimtHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorData = {} as FormFields;
    if (field.name === "") {
      errorData.name = "Please enter your name";
    }
    if (field.email === "") {
      errorData.email = "Please enter your email";
    }
    if (field.subject === "") {
      errorData.subject = "Please enter your subject";
    }
    if (field.lastname === "") {
      errorData.lastname = "Please enter your Lastname";
    }
    if (field.events === "") {
      errorData.events = "Select your event list";
    }
    if (field.notes === "") {
      errorData.notes = "Please enter your note";
    }
    if (!_.isEmpty(errorData)) {
      setError(errorData);
    }
    if (
      errorData.name === "" &&
      errorData.email === "" &&
      errorData.email === "" &&
      errorData.lastname === "" &&
      errorData.subject === "" &&
      errorData.events === "" &&
      errorData.notes === ""
    ) {
      setField({
        name: "",
        email: "",
        subject: "",
        events: "",
        notes: "",
        lastname: "",
      });
      setError(undefined);
    }
  };

  return (
    <form onSubmit={subimtHandler} className="form">
      <div className="row">
        <div className="col-lg-6 col-md-12">
          <div className="form-field">
            <input
              value={field.name}
              onChange={changeHandler}
              type="text"
              name="name"
              placeholder="Name"
            />
            <p>{error?.name || ""}</p>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="form-field">
            <input
              value={field.lastname}
              onChange={changeHandler}
              type="text"
              name="lastname"
              placeholder="Lastname"
            />
            <p>{error?.lastname || ""}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-field">
            <input
              onChange={changeHandler}
              value={field.email}
              type="email"
              name="email"
              placeholder="Email"
            />
            <p>{error?.email || ""}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-field">
            <input
              onChange={changeHandler}
              value={field.subject}
              type="text"
              name="subject"
              placeholder="Subject"
            />
            <p>{error?.subject || ""}</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-field">
            <textarea name="message" placeholder="Message"></textarea>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-submit">
            <button type="submit" className="theme-btn">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
