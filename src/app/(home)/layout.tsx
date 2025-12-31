import React from "react";
import Navbar from "./_components/navbar";
import { Footer } from "./_components/footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
