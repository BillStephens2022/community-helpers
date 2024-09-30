import SignupForm from "../_components/forms/signupForm";

export const metadata = {
  title: "Sign up / Log in",
};

export default function Page() {
  return (
    <>
      <h2>Sign up / Sign In</h2>
      <SignupForm />
    </>
  );
}
