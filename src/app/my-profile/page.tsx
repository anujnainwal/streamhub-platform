"use client";
import MyProfile from "@/pages/profile/UserProfile";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const page = () => {
  let router = useRouter();
  let authInfo = useSelector((state: any) => state.authInfo);
  // useEffect(() => {
  //   if (!authInfo.token) {
  //     router.push("/login");
  //   }
  // }, [authInfo.token]);
  return (
    <div>
      page
      <MyProfile userInfo={authInfo?.userInfo} />
    </div>
  );
};

export default page;
