import { useWeb3Auth } from "@web3auth/modal-react-hooks";
import React from "react";

const UserProfile = () => {
  const { userInfo, isConnected } = useWeb3Auth();

  if (isConnected) {
    try {
      return (
        <div className="sticky px-4 inset-x-0 bottom-0 border-t border-secondary">
          <div className="flex items-center justify-flex-start py-4 shrink-0 overflow-hidden">
            {userInfo.profileImage && (
              <img className="object-fill w-10 h-10 rounded-full border-2 border-accent shadow-sm" src={userInfo?.profileImage} referrerPolicy="no-referrer" />
            )}
            {!userInfo.profileImage && (
              <span className="flex justify-center items-center bg-accent font-bold w-10 h-10 rounded-full text-[28px] text-primary shadow-sm">
                {userInfo?.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="ml-3 overflow-hidden">
              <strong className="text-sm block font-medium truncate text-primary">{userInfo.name as string}</strong>
              <span className="text-xs text-gray-500">Utilisateur connecté</span>
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export default UserProfile;
