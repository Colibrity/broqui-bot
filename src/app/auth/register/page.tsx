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
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/;

// Password requirements component
const PasswordValidator = ({ password }: { password: string }) => {
  const passwordRequirements = [
    { regex: /[A-Z]/, label: "At least one upper case letter" },
    { regex: /[a-z]/, label: "At least one lower case letter" },
    { regex: /[0-9]/, label: "At least one digit" },
    { regex: /.{8,}/, label: "Minimum 8 characters length" },
  ];

  const allValid = passwordRequirements.every((req) =>
    req.regex.test(password)
  );

  return (
    <div className="mt-2 text-sm">
      <ul className="space-y-1">
        {passwordRequirements.map((req, index) => (
          <li
            key={index}
            className="flex items-center gap-2"
            style={{ color: req.regex.test(password) ? "green" : "red" }}>
            {req.regex.test(password) ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Validation function
const validate = (values: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Invalid email address";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordRegex.test(values.password)) {
    errors.password = "Password does not meet the requirements";
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm Password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return errors;
};

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setGeneralError(null);

      try {
        await signUp(values.email, values.password);
        router.push("/chat");
      } catch (error) {
        setGeneralError("Failed to create an account. Please try again.");
        console.error("Registration error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Clear field function
  const clearField = (field: "email" | "password" | "confirmPassword") => {
    formik.setFieldValue(field, "");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        {(generalError || authError) && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-center">
            {generalError || authError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4 relative">
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
                onChange={(e) => {
                  formik.handleChange(e);
                  setShowPasswordRequirements(true);
                }}
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

            {/* Password requirements checker */}
            {showPasswordRequirements && (
              <PasswordValidator password={formik.values.password} />
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  backgroundColor: "transparent",
                  right: formik.values.confirmPassword ? "32px" : "0px",
                }}>
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>

              {/* Clear button */}
              {formik.values.confirmPassword && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => clearField("confirmPassword")}
                  style={{ backgroundColor: "transparent" }}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Error message */}
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-sm text-destructive">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              formik.isSubmitting ||
              (Object.keys(formik.errors).length > 0 &&
                (formik.touched.email ||
                  formik.touched.password ||
                  formik.touched.confirmPassword))
            }>
            {formik.isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
