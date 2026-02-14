import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/http/api";
import useTokenStore from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ FIXED
  const setAuth = useTokenStore((s) => s.setAuth);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { accessToken, user } = res.data;

      // ✅ save token + user
      setAuth(accessToken, user);

      // ✅ safe navigation (NO window.location)
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard/home", { replace: true });
      }
    },
    onError: (error: AxiosError<any>) => {
      console.error("LOGIN ERROR", error?.response?.data || error.message);
    },
  });

  const submit = () => {
    if (!emailRef.current || !passwordRef.current) return;

    mutation.mutate({
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            {mutation.isError && (
              <span className="text-red-500 text-sm">
                {(mutation.error as AxiosError<any>)?.response?.data?.message ||
                  "Invalid email or password"}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input ref={emailRef} type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input ref={passwordRef} type="password" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={submit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>

          <Link
            to="/auth/register"
            className="text-sm text-blue-600 hover:underline"
          >
            Create account
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;
