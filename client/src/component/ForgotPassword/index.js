import { MdOutlineKeyboardBackspace } from "react-icons/md";
import "../ResponsiveDevice/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

const ForgotPassword = (props) => {
  const { changeButtonClicked } = props;

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);

  const onSubmitResetPassword = async (event) => {
    try {
      event.preventDefault();
      setDisabled(true);
      if (email === "") {
        setErrorMsg("Email is Mandatory to be Filled");
        setDisabled(false);
      } else {
        setErrorMsg("");
        const api = `http://localhost:5000`;
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
          console.log(data);
          const successMsg = data.success_msg;
          toast.success(`${successMsg}`, {
            position: "bottom-center",
            autoClose: 5000,
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
        autoClose: 5000,
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
      <div className="div-container-forgot">
        <div className="back-button-container">
          <button
            style={{ fontWeight: "bolder" }}
            className="back-button"
            onClick={() => {
              changeButtonClicked();
            }}
          >
            <MdOutlineKeyboardBackspace className="icon-back" />
            Back
          </button>
        </div>

        <div className="forgot-container">
        <h1 className="main-heading-form">Reset Your Password</h1>
          <form onSubmit={onSubmitResetPassword}>
            <div className="mb-3 mt-2">
              <label htmlFor="email">Enter you Email Id:</label>
              <input
                type="text"
                id="email"
                className="form-control"
                onChange={onChangeEmailVal}
                value={email}
              />
            </div>
            <div>
              <button className="btn btn-primary" disabled={disabled}>
                {disabled === true ? (
                  <Oval
                    visible={true}
                    height="25"
                    width="25"
                    color="#ffffff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
            <p
              style={{ color: "#ff3333", fontWeight: "Bolder" }}
              className="mt-2"
            >
              {errorMsg}
            </p>
          </form>
        </div>
      </div>
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
