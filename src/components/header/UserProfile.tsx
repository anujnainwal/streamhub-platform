import React from "react";
import Image from "next/image";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaCreditCard,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";

interface UserInfo {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullName: string;
  id: string;
}

interface UserProfileProps {
  userInfo: UserInfo;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo, onSignOut }) => {
  const router = useRouter();
  let dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-center">
            <FaUser className="text-gray-300 h-5 w-5" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-[#FFFFFF] text-black mr-5">
        <DropdownMenuLabel>
          <div className="p-2">
            <ul>
              {["my-profile", "edit-profile", "manage-account", "sign-out"].map(
                (item, index) => {
                  let icon;
                  let label;
                  let path: string;

                  switch (item) {
                    case "my-profile":
                      icon = <FaUser className="mr-2" />;
                      label = "My Profile";
                      path = "/my-profile";
                      break;
                    case "edit-profile":
                      icon = <FaCog className="mr-2" />;
                      label = "Edit Profile";
                      path = "/edit-profile";
                      break;
                    case "manage-account":
                      icon = <FaCreditCard className="mr-2" />;
                      label = "Manage Account";
                      path = "/manage-account";
                      break;
                    case "sign-out":
                      icon = <FaSignOutAlt className="mr-2" />;
                      label = "Sign Out";
                      break;
                    default:
                      break;
                  }

                  return (
                    <li key={index}>
                      <DropdownMenuItem
                        onClick={() => {
                          if (item === "sign-out") {
                            handleLogout(); // sign-out logic
                          } else {
                            router.push(path);
                          }
                        }}
                        className="flex items-center p-2 text-[#706f6f] hover:text-[#706f6f] cursor-pointer"
                      >
                        {icon}
                        {label}
                      </DropdownMenuItem>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
