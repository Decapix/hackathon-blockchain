import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

import web3AuthLogoWhite from "../assets/web3authLogoWhite.svg";

const DisconnectWeb3AuthButton = () => {
  const { isConnected, logout } = useWeb3Auth();

  if (isConnected) {
    return (
      <div
        className="flex flex-row rounded-full px-6 py-3 text-white justify-center items-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        style={{ backgroundColor: "#FF66B2" }}
        onClick={() => logout()}
      >
        <span className="font-medium">Deconnect</span>
      </div>
    );
  }
  return null;
};
export default DisconnectWeb3AuthButton;
