"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Check, X, AlertCircle } from "lucide-react";

// Email regex validation pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Validation function
const validate = (values: { email: string }) => {
  const errors: { email?: string } = {};

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

export default function ResetPasswordPage() {
  const { resetPassword, error: authError } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(null);

      try {
        await resetPassword(values.email);
        setIsSubmitted(true);
      } catch (error) {
        setGeneralError("Failed to request password reset. Please try again.");
        console.error("Password reset error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Clear field function
  const clearField = (field: "email") => {
    formik.setFieldValue(field, "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-md bg-primary/10 text-primary">
              Password reset link has been sent to your email address. Please
              check your inbox.
            </div>
            <Button asChild className="w-full">
              <Link href="/auth/login">Return to Login</Link>
            </Button>
          </div>
        ) : (
          <>
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

              <Button
                type="submit"
                className="w-full"
                disabled={
                  formik.isSubmitting ||
                  Object.keys(formik.errors).length > 0 ||
                  !formik.values.email
                }>
                {formik.isSubmitting
                  ? "Sending reset link..."
                  : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}

        <div className="text-center text-sm">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
