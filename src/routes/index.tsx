import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
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

  return (
    <button onClick={handleGetStarted}>
      Get Started
    </button>
  );
}