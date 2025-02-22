import HeaderBox from "@/components/HeaderBox";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import AdminDashboard from "@/components/AdminDashboard";

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  return (
    <section className="p-6">
      {/* Header */}
      <HeaderBox
        type="greeting"
        title="Welcome"
        user={loggedIn?.firstName || "Admin"}
        subtext="Manage your clients with ease and efficiency using Basel Compliance"
      />

      {/* Dashboard (Client Component) */}
      <AdminDashboard />
    </section>
  );
};

export default Home;
