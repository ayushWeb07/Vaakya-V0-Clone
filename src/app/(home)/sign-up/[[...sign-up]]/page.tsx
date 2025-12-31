import Navbar from "@/app/(home)/_components/navbar";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="bg-background flex justify-center items-center min-h-screen">
      <SignUp appearance={{theme: dark}} />
    </div>
  );
}
