import {getLoggedInUser} from "@/lib/actions/auth.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { logout } from "@/lib/actions/auth.actions";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await logout();

    if (loggedOut) router.push("/sign-in");
  };

  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name_mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-700">{user?.user_name[0]}</p>
      </div>

      <div
        className={type === "mobile" ? "footer_email_mobile" : "footer_email"}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {user?.user_name} |{" "}
          <span className="font-extrabold">{user?.role?.toUpperCase()}</span>
        </h1>

        <p className="text-14 truncate font-normal text-gray-600">
          {user?.email || ""}
        </p>
      </div>

      <div className="footer_image" onClick={handleLogout}>
        <Image
          src={
            user?.role?.toLowerCase() === "admin"
              ? "../icons/logout.svg"
              : "icons/logout.svg"
          }
          fill
          alt="logout logo"
        />
      </div>
    </footer>
  );
};

export default Footer;
