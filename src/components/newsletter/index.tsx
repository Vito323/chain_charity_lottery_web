"use client";
import React from "react";
import "./style.css";
import { subscribeEmail } from "@/service/general";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const Newsletter = () => {
  const [email, setEmail] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState<string>("");


  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const debouncedValidateEmail = React.useMemo(
    () => debounce((value: string) => {
      setEmailError("");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
      }
    }, 300),
    []
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidateEmail(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email && validateEmail(email) && !isLoading) {
        const mockEvent = {
          preventDefault: () => {},
        } as React.MouseEvent<HTMLButtonElement>;
        onHandleSubmit(mockEvent);
      }
    }
  };


  const onHandleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setEmailError("");
    try {
      const response = await subscribeEmail(email);
      if (response.ok) {
        setEmail("");
        toast.success("Subscription successful! Thank you for your attention");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="wpo-news-letter-section">
      <div className="container">
        <div className="row">
          <div className="col col-md-6 offset-lg-3 col-sm-8 offset-md-2">
            <div className="wpo-newsletter">
              <h3>Follow us for further information</h3>
              <div className="wpo-newsletter-form">
                <form>
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className={`form-control ${emailError ? "error" : ""}`}
                      value={email}
                      onChange={handleEmailChange}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    {emailError && (
                      <div className="error-message">{emailError}</div>
                    )}
                    <button
                      onClick={onHandleSubmit}
                      disabled={!email || !!emailError || isLoading}
                      type="submit"
                      className={isLoading ? "loading" : ""}
                    >
                      {isLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
