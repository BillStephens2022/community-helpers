import LoginButton from "../_components/ui/LoginButton";

export const metadata = {
  title: "Log in",
};

export default function Page() {
  return (
    <>
      <h2>Sign up / Sign In</h2>
      <LoginButton>Sign Up</LoginButton>
      <LoginButton>Sign In</LoginButton>
    </>
  );
}
