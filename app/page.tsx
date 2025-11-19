"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tasks page
    router.push("/tasks");
  }, [router]);

  return null;
}
