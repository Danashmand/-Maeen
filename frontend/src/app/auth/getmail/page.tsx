"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const getUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput.value;

    try {
      const response = await axios.get(`http://localhost:3000/users/email?email=${email}`);
      console.log("Login success:", response.data);

      // Store the user data in localStorage as a string
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect to the dashboard
      router.push("/dashboard");  // Uses Next.js navigation
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  return (
    <div>
      <label htmlFor="email">One last step... give us your email address</label>
      <input type="text" id="email" name="email" placeholder="Enter your email" />
      <button type="submit" onClick={getUser}>Submit</button>
    </div>
  );
}

export default Page;
