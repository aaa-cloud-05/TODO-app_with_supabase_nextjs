import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AuthInitializer from "@/components/AuthInitializer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <AuthInitializer/>
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}