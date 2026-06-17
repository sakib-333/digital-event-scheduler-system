import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  return <h1>Signin</h1>;
}