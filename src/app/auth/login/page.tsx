"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

// Email regex validation pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validation function
const validate = (values: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export default function LoginPage() {
  const router = useRouter();
  const { signIn, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(null);

      try {
        await signIn(values.email, values.password);
        router.push("/chat");
      } catch (error) {
        setGeneralError("Failed to sign in. Please check your credentials.");
        console.error("Login error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Clear field function
  const clearField = (field: "email" | "password") => {
    formik.setFieldValue(field, "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>

        {(generalError || authError) && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-center">
            {generalError || authError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.email && formik.errors.email
                    ? "border-destructive"
                    : ""
                }
              />

              {/* Clear button */}
              {formik.values.email && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => clearField("email")}
                  style={{ backgroundColor: "transparent" }}>
                  <X className="h-4 w-4" />
                </Button>
              )}

              {/* Validation icon */}
              {formik.touched.email && (
                <div
                  className="absolute top-0 h-full flex items-center"
                  style={{
                    right: formik.values.email ? "40px" : "8px",
                    backgroundColor: "transparent",
                  }}>
                  {formik.errors.email ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>

            {/* Error message */}
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-destructive">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.password && formik.errors.password
                    ? "border-destructive"
                    : ""
                }
              />

              {/* Password visibility toggle */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  backgroundColor: "transparent",
                  right: formik.values.password ? "32px" : "0px",
                }}>
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>

              {/* Clear button */}
              {formik.values.password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => clearField("password")}
                  style={{ backgroundColor: "transparent" }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Error message */}
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-destructive">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="text-sm text-right">
            <Link
              href="/auth/reset-password"
              className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              formik.isSubmitting ||
              (Object.keys(formik.errors).length > 0 &&
                formik.touched.email &&
                formik.touched.password)
            }>
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
