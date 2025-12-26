import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Header";
import { getCurrentUser } from "@/services/auth";



// মেটাডেটা সাধারণত মেইন লেআউটে থাকলেই ভালো, তবে এখানেও রাখতে পারেন যদি পেজ স্পেসিফিক হয়
export const metadata = {
  title: "Your Site Title",
  description: "Your Site Description",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
// ✅ ২. সার্ভার সাইডে ইউজার ডাটা ফেচ করুন
  const user = await getCurrentUser();
  
  // কনসোলে চেক করুন ডাটা আসছে কিনা (টার্মিনালে দেখাবে)
  console.log("Layout User Data:", user);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar সেশন পাস করছেন */}
      <Navbar user={user}  />
      
      {/* মেইন কন্টেন্ট */}
      <main className="grow">
        {children}
      </main>

      {/* ফুটার */}
      <Footer />
    </div>
  );
}