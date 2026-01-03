import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/http/api";
import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useTokenStore((state) => state.setAuth);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      const { accessToken } = res.data;

      // ✅ Save token (user will be fetched after login)
      setAuth(accessToken, null as any);

      navigate("/dashboard/home", { replace: true });
    },
    onError: (error) => {
      console.error("Registration error", error);
    },
  });

  const handleRegisterSubmit = () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    mutation.mutate({ name, email, password });
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create a new account
            {mutation.isError && (
              <p className="mt-2 text-sm text-red-500">
                {(() => {
                  const err = mutation.error as AxiosError<any>;
                  return (
                    err?.response?.data?.message ||
                    err.message ||
                    "Something went wrong"
                  );
                })()}
              </p>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input ref={nameRef} placeholder="Your name" />
          </div>

          <div>
            <Label>Email</Label>
            <Input ref={emailRef} type="email" placeholder="you@example.com" />
          </div>

          <div>
            <Label>Password</Label>
            <Input ref={passwordRef} type="password" />
          </div>

          <Button
            onClick={handleRegisterSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegisterPage;
