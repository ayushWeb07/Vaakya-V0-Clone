import React from "react";
import Navbar from "./_components/navbar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;
