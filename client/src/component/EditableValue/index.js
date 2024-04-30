import { useState, useEffect } from "react";
import {
  TableInput,
  MainContainer,
  InputVal,
  ErrMsg,
} from "./StyledComponents";

const EditableValue = ({ value, onValueChange, validate, type, disabled }) => {
  const [isEditing, setIsEditing] = useState(value == null || value === "");
  const [currentValue, setCurrentValue] = useState(value || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentValue(String(value));
    if (value != null && value !== "") {
      setIsEditing(false);
    }
  }, [value]);

  const handleFocus = () => setIsEditing(true);

  const handleBlur = () => {
    if (currentValue.trim() === "") {
      setIsEditing(true);
      setError("This field cannot be empty.");
    } else if (error) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      onValueChange(currentValue);
      setError("");
    }
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    const isValid = validate(newValue);
    setCurrentValue(newValue);
    setError(isValid ? "" : "Invalid input");
  };

  useEffect(() => {
    let timeoutId;
    if (error) {
      timeoutId = setTimeout(() => {
        setError("");
      }, 10000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [error]);

  return (
    <MainContainer style={{ position: "relative" }}>
      {isEditing ? (
        <TableInput
          type={type}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="form-control"
          style={{ borderColor: error ? "red" : "" }}
          disabled={disabled}
        />
      ) : (
        <InputVal onClick={handleFocus}>{currentValue}</InputVal>
      )}
      {error && <ErrMsg>{error}</ErrMsg>}
    </MainContainer>
  );
};

export default EditableValue;
