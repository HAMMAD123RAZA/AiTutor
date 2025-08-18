"use client";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { notFound, useRouter } from "next/navigation";

export default function AdminRoute({ children }) {
  const { user, loadingUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace("/login"); // redirect unauthenticated users
    }
  }, [user, loadingUser, router]);

  if (loadingUser) {
    return <>
    <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900" ></div>
    </div>
    </>; // spinner or skeleton
  }

  if (!user) {
    return null; // prevents flicker
  }

  if (user.role !== "admin") {
    notFound(); // show 404 page instead of redirect
  }

  return <>{children}</>;
}
