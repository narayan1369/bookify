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
import { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useTokenStore((s) => s.setAuth);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { accessToken, user } = res.data;

      console.log("LOGIN SUCCESS:", user);

      // ✅ SAVE TOKEN + USER
      setAuth(accessToken, user);

      // ✅ FORCE REDIRECT (NO CONFUSION)
      if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard/home";
      }
    },
    onError: (err) => {
      console.error("LOGIN ERROR", err);
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
              <span className="text-red-500">
                {(mutation.error as AxiosError)?.message}
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div>
            <Label>Email</Label>
            <Input ref={emailRef} />
          </div>
          <div>
            <Label>Password</Label>
            <Input ref={passwordRef} type="password" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>

          <Link to="/auth/register">Create account</Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default LoginPage;
