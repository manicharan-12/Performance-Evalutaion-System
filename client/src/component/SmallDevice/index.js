import {
  SmallDeviceContainer,
  SmallDeviceImage,
  SmallDeviceImageContainer,
  TextContent,
} from "../Styling/StyledComponents";
import image from "../Images/Small Devices.png";

const SmallDevice = () => {
  return (
    <SmallDeviceContainer>
      <SmallDeviceImageContainer>
        <SmallDeviceImage src={image} />
      </SmallDeviceImageContainer>
      <TextContent>
        This application is not for small devices. Open the application in large
        devices
      </TextContent>
    </SmallDeviceContainer>
  );
};

export default SmallDevice;
