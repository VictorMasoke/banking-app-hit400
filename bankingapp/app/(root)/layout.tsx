import MobileNav from "@/components/MobileNav";
import SideBar from "@/components/SideBar";
import {getLoggedInUser} from "@/lib/actions/auth.actions";
import Image from "next/image";
import { redirect } from "next/navigation";
import TawkChat from "@/components/TawkChat";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = await getLoggedInUser();

  if(!loggedIn) redirect('/sign-in')

  return (
    <main className="flex h-screen w-full font-inter">
        <SideBar user={loggedIn}/>

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src="/icons/money-mail-svgrepo-com.svg" width={50} height={50} alt="logo"
            />
              <div>
                <MobileNav user={loggedIn}/>
              </div>
          </div>
          {children}
        </div>

        {/* Load Tawk.to chat */}
      <TawkChat />

    </main>
  );
}
