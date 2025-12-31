import Navbar from "@/app/(home)/_components/navbar";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="bg-background flex justify-center items-center h-screen">
      <SignIn appearance={{theme: dark}} />
    </div>
  );
}
