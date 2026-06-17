import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { HomePage } from "@/components/home/home-page";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  function handleGetStarted() {
    if (user) {
      navigate({
        to: "/dashboard",
      });
    } else {
      navigate({
        to: "/signin",
      });
    }
  }

  return <HomePage onGetStarted={handleGetStarted} />;
}
