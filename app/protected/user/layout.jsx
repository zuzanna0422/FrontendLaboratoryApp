"use client";

import { useLayoutEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/app/_lib/AuthContext";

function Protected({ children }) {
  const { user } = useAuth();
  const returnUrl = usePathname();

  useLayoutEffect(() => {
    if (!user) {
      redirect(`/public/user/signin?returnUrl=${returnUrl}`);
    }
  }, [user, returnUrl]);

  return <>{children}</>;
}

export default Protected;
