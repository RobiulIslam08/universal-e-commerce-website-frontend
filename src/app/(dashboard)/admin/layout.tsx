// "use client"

// import type React from "react"

// import { useState } from "react"
// import AdminSidebar from "@/components/admin/admin-sidebar"
// import AdminHeader from "@/components/admin/admin-header"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   return (
//     <div className="flex overflow-hidden bg-background">
//       <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
//         <main className="flex-1 overflow-auto">
//           <div className="p-4 md:p-6 lg:p-8">{children}</div>
//         </main>
//       </div>
//     </div>
//   )
// }

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size and auto-close sidebar on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/10">
          <div className="p-4 md:p-6 lg:p-8 w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
