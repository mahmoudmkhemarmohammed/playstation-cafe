import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="heightLayout py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
