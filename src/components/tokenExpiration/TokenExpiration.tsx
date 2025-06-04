// "use client";

// import React from "react";
// import { usePathname } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { jwtDecode } from "jwt-decode";

// interface TokenPayload {
//   exp: number;
//   [key: string]: any;
// }

// const TokenExpiration = () => {
//   const pathname = usePathname();
//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     const checkTokenExpiration = () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const decoded = jwtDecode<TokenPayload>(token);
//           const now = Math.floor(Date.now() / 1000);

//           if (decoded.exp < now) {
//             console.warn("Token expired, logging out");
//             // localStorage.removeItem("token");
//             // dispatch(resetApp()); // or LOGOUT
//             // window.location.href = "/login"; // optional redirect
//           }
//         } catch (err) {
//           console.error("Failed to decode token:", err);
//           //   localStorage.removeItem("token");
//           //   dispatch(resetApp());
//         }
//       }
//     };

//     checkTokenExpiration();
//   }, [pathname]);

//   return null;
// };

// export default TokenExpiration;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

interface TokenPayload {
  exp: number;
  [key: string]: any;
}

const TokenExpiration = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const handleLogout = () => {
      console.warn("🔒 Token expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      //   dispatch(resetApp());
      //   window.location.href = "/login";
    };

    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          handleLogout();
        } else {
          const expirationMoment = moment.unix(decoded.exp);
          const duration = moment.duration(expirationMoment.diff(moment()));

          const formattedCountdown = moment
            .utc(moment.duration(duration).asMilliseconds())
            .format("HH:mm:ss");
          setCountdown(formattedCountdown);
        }
      } catch (err) {
        handleLogout();
      }
    };

    checkToken(); // Initial check on mount

    intervalRef.current = setInterval(() => {
      checkToken();
    }, 1000); // now checking every second for live countdown

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  return (
    countdown && (
      <div
        style={{
          position: "fixed",
          //   bottom: 10,
          top: 80,
          right: 10,
          padding: "8px 12px",
          background: "#000",
          color: "#fff",
          borderRadius: "6px",
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      >
        Session expires in: <strong>{countdown}</strong>
      </div>
    )
  );
};

export default TokenExpiration;
