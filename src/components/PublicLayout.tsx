import { Outlet } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTracker } from "./PageTracker";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageTracker />
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}