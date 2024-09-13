import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Oval } from "react-loader-spinner";
import {
  BackButton,
  ErrorMessage,
  FormHeading,
  InputContainer,
  InputElement,
  LabelElement,
  LoginForm,
  LoginRegisterButton,
  LoginRegisterButtonContainer,
} from "./StyledComponents";

const ForgotPassword = (props) => {
  const { changeButtonClicked } = props;

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const onSubmitResetPassword = async (event) => {
    if(!navigator.onLine){
      await toast.error("You are offline. Please connect to the internet and try again.", {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }
    try {
      event.preventDefault();
      setDisabled(true);
      if (email === "") {
        setErrorMsg("Email is Mandatory to be Filled");
        setDisabled(false);
      } else {
        setErrorMsg("");
        const api = `http://localhost:6969`;
        const postData = { email };
        const option = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        };
        const response = await fetch(`${api}/forgot-password`, option);
        if (response.ok === true) {
          const data = await response.json();
          const successMsg = data.success_msg;
          toast.success(`${successMsg}`, {
            position: "bottom-center",
            autoClose: 6969,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setDisabled(false);
          setEmail("");
        } else {
          const data = await response.json();
          const errorMsg = data.error_msg;
          setErrorMsg(errorMsg);
          setDisabled(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`Internal Server Error! Please try again Later`, {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setDisabled(false);
    }
  };

  const onChangeEmailVal = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <LoginForm className="pt-3 shadow" onSubmit={onSubmitResetPassword}>
        <BackButton
          className="back-button mb-4"
          onClick={() => {
            changeButtonClicked();
          }}
        >
          <MdOutlineKeyboardBackspace className="mr-5" />
          Back
        </BackButton>
        <InputContainer className="mt-2 mb-3">
          <FormHeading className="mb-3">Reset Your Password</FormHeading>
          <LabelElement htmlFor="email">Enter you Email Id:</LabelElement>
          <InputElement
            type="text"
            id="email"
            className="form-control mt-2"
            onChange={onChangeEmailVal}
            value={email}
          />
        </InputContainer>
        <LoginRegisterButtonContainer>
          <LoginRegisterButton type="submit" disabled={disabled}>
            {disabled === true ? (
              <Oval
                visible={true}
                height="25"
                width="25"
                color="#ffffff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                className="text-center"
              />
            ) : (
              "Send Email"
            )}
          </LoginRegisterButton>
        </LoginRegisterButtonContainer>
        <ErrorMessage className="mt-3">{errorMsg}</ErrorMessage>
      </LoginForm>
      <ToastContainer
        position="bottom-center"
        autoClose={7000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default ForgotPassword;
