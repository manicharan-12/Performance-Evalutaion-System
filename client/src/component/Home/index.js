import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import {
  LoaderContainer,
  FailureContainer,
  FailureImage,
  SubSectionHeading,
  CloseButton,
  ButtonContainer,
  HomeMainContainer,
  MainContainer,
  ModelContainer,
  FormsContainer,
  FormsList,
  FormListButtonContainer,
  OptionButton,
  NameText,
  SearchBox,
} from "./StyledComponents";
import Cookies from "js-cookie";
import { GrClose } from "react-icons/gr";
import { ThreeDots, Oval } from "react-loader-spinner";
import failure from "../Images/failure view.png";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Home = () => {
  const [formList, setFormList] = useState([]);
  const [userId, setUserId] = useState();
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getFormIdFromSearchParams = () => {
      try {
        const userId = searchParams.get("fac_id");
        console.log(userId)
        return userId;
      } catch (error) {
        console.error("Error fetching form ID from search params:", error);
      }
    };

    async function fetchForms() {
      try {
        const userId = getFormIdFromSearchParams();
        if (!userId) {
          console.error("Form ID not found in search params.");
          return;
        }

        setUserId(userId); // Assuming you need to set the formId in state

        setApiStatus(apiStatusConstants.inProgress);
        const api = "http://localhost:6969";

        const response = await fetch(`${api}/user/forms/${userId}`);
        const response2 = await fetch(`${api}/profile/details/${userId}`);

        if (response.ok) {
          const data = await response.json();
          setFormList(data.getForms);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
          toast.error("Failed to fetch forms", {
            position: "bottom-center",
            autoClose: 6969,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
        }

        if (response2.ok) {
          const data = await response2.json();
          setUserName(data.name);
          setApiStatus(apiStatusConstants.success);
        } else {
          setApiStatus(apiStatusConstants.failure);
          toast.error("Failed to fetch user data", {
            position: "bottom-center",
            autoClose: 6969,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
        }
      } catch (error) {
        setApiStatus(apiStatusConstants.failure);
        console.error("Error fetching data:", error);
      }
    }

    fetchForms();
  }, [searchParams]); // Ensure this effect runs when searchParams change

  const openModal = () => {
    setModal(true);
    setName("");
    setIsEditing(false);
    setEditingFormId(null);
  };
  const handleNavigate = () => {
    navigate("/hod-dashboard");
  };
  const closeModal = () => {
    setModal(false);
    setName("");
  };

  const onChangeFormName = (event) => {
    setName(event.target.value);
  };

  const openEditModal = (formId, formName) => {
    setEditingFormId(formId);
    setName(formName);
    setIsEditing(true);
    setModal(true);
  };

  const createOrEditForm = async () => {
    // if(!navigator.onLine){
    //   await toast.error("You are offline. Please connect to the internet and try again.", {
    //     position: "bottom-center",
    //     autoClose: 6969,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //   });
    //   return;
    // }
    try {
      setDisabled(true);
      const userId = Cookies.get("user_id");
      const postData = { formName: name };
      const api = "http://localhost:6969";

      let response;
      if (isEditing) {
        response = await fetch(`${api}/update/form/${editingFormId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      } else {
        response = await fetch(`${api}/add/form/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
      }

      if (response.ok) {
        const data = await response.json();
        if (isEditing) {
          setFormList((prevFormList) =>
            prevFormList.map((form) =>
              form._id === editingFormId ? { ...form, formName: name } : form
            )
          );
        } else {
          const formId = data.formId;
          setFormList((prevFormList) => [
            ...prevFormList,
            { _id: formId, formName: name },
          ]);
          navigate(`/academicWork/part-a/?f_id=${formId}`, {
            state: { formId },
          });
        }
        closeModal();
      } else {
        throw new Error("Failed to save form");
      }
    } catch (error) {
      toast.error("Internal Server Error! Please try again later", {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    } finally {
      setDisabled(false);
    }
  };

  const onClickEdit = (formId, formName) => {
    openEditModal(formId, formName);
  };

  const onClickDelete = async (formId) => {
    // if(!navigator.onLine){
    //   await toast.error("You are offline. Please connect to the internet and try again.", {
    //     position: "bottom-center",
    //     autoClose: 6969,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //   });
    //   return;
    // }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this form?"
    );
    if (isConfirmed) {
      try {
        const api = "http://localhost:6969";
        const response = await fetch(`${api}/delete/form/${formId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setFormList((prevFormList) =>
            prevFormList.filter((form) => form._id !== formId)
          );
        } else {
          throw new Error("Failed to delete form");
        }
      } catch (error) {
        toast.error("Internal Server Error! Please try again later", {
          position: "bottom-center",
          autoClose: 6969,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    } else {
    }
  };

  const handleFormClick = async (formId) => {
    // if(!navigator.onLine){
    //   await toast.error("You are offline. Please connect to the internet and try again.", {
    //     position: "bottom-center",
    //     autoClose: 6969,
    //     hideProgressBar: true,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //     draggable: true,
    //   });
    //   return;
    // }

    try {
      navigate(`/academicWork/part-a/?f_id=${formId}&fac_id=${userId}`);
    } catch (error) {
      toast.error("Internal Server Error! Please try again later", {
        position: "bottom-center",
        autoClose: 6969,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    }
  };

  const onChangeSearchText = (event) => {
    setSearchText(event.target.value);
  };

  const renderLoadingView = () => (
    <LoaderContainer data-testid="loader">
      <ThreeDots
        visible={true}
        height="50"
        width="50"
        color="#0b69ff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </LoaderContainer>
  );

  const renderSuccessView = () => {
    const filteredForms = formList.filter((form) =>
      form.formName.toLowerCase().includes(searchText.toLowerCase())
    );
    return (
      <>
        <NameText>Welcome, {userName}!</NameText>
        <ButtonContainer>
          <SearchBox
            type="search"
            placeholder="Enter text to find form"
            value={searchText}
            onChange={onChangeSearchText}
          />
          <span style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleNavigate}
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundImage:
                  "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                color: "#fff",
                border: "none",
              }}
            >
              Faculty Submissions
            </button>
            <button
              onClick={openModal}
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundImage:
                  "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                color: "#fff",
                border: "none",
              }}
            >
              Create a new form
            </button>
          </span>
        </ButtonContainer>
        {modal && (
          <ModelContainer className="pb-3 shadow-lg">
            <ButtonContainer>
              <CloseButton onClick={closeModal}>
                <GrClose />
              </CloseButton>
            </ButtonContainer>
            <label className="pb-2">
              {isEditing ? "Update the name" : "Enter the name of the form"}
            </label>
            <p style={{ fontSize: "12px" }}>
              (Choose a relevant name to the form. The same name will be
              displayed to your higher authorities)
            </p>
            <input
              className="form form-control"
              onChange={onChangeFormName}
              value={name}
            />
            <ButtonContainer className="pt-4">
              <button
                onClick={createOrEditForm}
                disabled={disabled}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundImage:
                    "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
                  color: "#fff",
                  border: "none",
                }}
              >
                {disabled ? (
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
                ) : isEditing ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </ButtonContainer>
          </ModelContainer>
        )}
        <FormsContainer className="pt-3 mt-5">
          {filteredForms.map((eachForm) => (
            <FormsList key={eachForm._id}>
              <SubSectionHeading
                onClick={() => handleFormClick(eachForm._id)}
                style={{
                  cursor: "pointer",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap, nowrap",
                  overflow: "hidden",
                  textAlign: "center",
                  width: "100%",
                  textOverflow: "ellipsis",
                }}
              >
                {eachForm.formName}
              </SubSectionHeading>
              <FormListButtonContainer>
                <OptionButton
                  onClick={() => onClickEdit(eachForm._id, eachForm.formName)}
                >
                  Edit Name
                </OptionButton>
                <OptionButton onClick={() => onClickDelete(eachForm._id)}>
                  Delete Form
                </OptionButton>
              </FormListButtonContainer>
            </FormsList>
          ))}
        </FormsContainer>
      </>
    );
  };

  const renderFailureView = () => (
    <>
      <FailureContainer>
        <FailureImage src={failure} />
        <SubSectionHeading className="mt-4">
          Failed to load Data. Retry Again!
        </SubSectionHeading>
      </FailureContainer>
    </>
  );

  const renderHomePage = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoadingView();

      case apiStatusConstants.success:
        return renderSuccessView();

      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <HomeMainContainer className="mb-5">
      <MainContainer className="mt-5">{renderHomePage()}</MainContainer>
    </HomeMainContainer>
  );
};

export default Home;
