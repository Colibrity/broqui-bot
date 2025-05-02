"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

// Password regex validation pattern
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

export default function ProfilePage() {
  const { user, loading, error, updateProfile, updatePassword, signOut } =
    useAuth();
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Form for updating display name
  const nameFormik = useFormik({
    initialValues: {
      displayName: user?.displayName || "",
    },
    validate: (values) => {
      const errors: { displayName?: string } = {};
      if (!values.displayName) {
        errors.displayName = "Name is required";
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      console.log("ProfilePage: Form submitted", values.displayName);
      console.log("ProfilePage: Current user state:", user);

      try {
        console.log("ProfilePage: Calling updateProfile");
        await updateProfile(values.displayName);
        console.log("ProfilePage: Update completed successfully");

        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
      } catch (error) {
        console.error("ProfilePage: Failed to update name:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Form for updating password
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: {
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
      } = {};

      if (!values.currentPassword) {
        errors.currentPassword = "Current password is required";
      }

      if (!values.newPassword) {
        errors.newPassword = "New password is required";
      } else if (!passwordRegex.test(values.newPassword)) {
        errors.newPassword = "Password does not meet requirements";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Confirm password is required";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await updatePassword(values.currentPassword, values.newPassword);

        setPasswordSuccess(true);
        resetForm();

        setTimeout(() => {
          signOut();
        }, 2000);
      } catch (error) {
        console.error("Failed to update password:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Helper function to clear input fields
  const clearField = (formik: any, field: string) => {
    formik.setFieldValue(field, "");
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Profile Info */}
        <div className="flex-1 space-y-6 flex flex-col">
          <div className="bg-card rounded-lg p-6 shadow-sm border flex-1">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="mb-4">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-muted-foreground">
                Current Display Name
              </div>
              <div className="font-medium">{user.displayName || "Not set"}</div>
            </div>

            <form onSubmit={nameFormik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Update Display Name
                </label>
                <div className="relative">
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Your display name"
                    value={nameFormik.values.displayName}
                    onChange={nameFormik.handleChange}
                    onBlur={nameFormik.handleBlur}
                    className={
                      nameFormik.touched.displayName &&
                      nameFormik.errors.displayName
                        ? "border-destructive"
                        : ""
                    }
                  />

                  {/* Clear button */}
                  {nameFormik.values.displayName && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => clearField(nameFormik, "displayName")}
                      style={{ backgroundColor: "transparent" }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Validation icon */}
                  {nameFormik.touched.displayName && (
                    <div
                      className="absolute top-0 h-full flex items-center"
                      style={{
                        right: nameFormik.values.displayName ? "40px" : "8px",
                        backgroundColor: "transparent",
                      }}>
                      {nameFormik.errors.displayName ? (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  )}
                </div>

                {/* Error message */}
                {nameFormik.touched.displayName &&
                  nameFormik.errors.displayName && (
                    <div className="text-sm text-destructive">
                      {nameFormik.errors.displayName}
                    </div>
                  )}
              </div>

              {nameSuccess && (
                <div className="p-3 rounded-md bg-green-100 text-green-700 text-center">
                  Profile updated successfully!
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  nameFormik.isSubmitting ||
                  Object.keys(nameFormik.errors).length > 0
                }>
                {nameFormik.isSubmitting ? "Saving..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </div>

        {/* Right column - Security */}
        <div className="flex-1 space-y-6 flex flex-col">
          <div className="bg-card rounded-lg p-6 shadow-sm border flex-1">
            <h2 className="text-xl font-semibold mb-4">Security</h2>

            <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label
                  htmlFor="currentPassword"
                  className="text-sm font-medium">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    className={
                      passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword
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
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      backgroundColor: "transparent",
                      right: passwordFormik.values.currentPassword
                        ? "32px"
                        : "0px",
                    }}>
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Clear button */}
                  {passwordFormik.values.currentPassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() =>
                        clearField(passwordFormik, "currentPassword")
                      }
                      style={{ backgroundColor: "transparent" }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Error message */}
                {passwordFormik.touched.currentPassword &&
                  passwordFormik.errors.currentPassword && (
                    <div className="text-sm text-destructive">
                      {passwordFormik.errors.currentPassword}
                    </div>
                  )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordFormik.values.newPassword}
                    onChange={(e) => {
                      passwordFormik.handleChange(e);
                      setShowPasswordRequirements(true);
                    }}
                    onBlur={passwordFormik.handleBlur}
                    className={
                      passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword
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
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      backgroundColor: "transparent",
                      right: passwordFormik.values.newPassword ? "32px" : "0px",
                    }}>
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Clear button */}
                  {passwordFormik.values.newPassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => clearField(passwordFormik, "newPassword")}
                      style={{ backgroundColor: "transparent" }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Error message */}
                {passwordFormik.touched.newPassword &&
                  passwordFormik.errors.newPassword && (
                    <div className="text-sm text-destructive">
                      {passwordFormik.errors.newPassword}
                    </div>
                  )}

                {/* Password requirements checker */}
                {showPasswordRequirements && (
                  <PasswordValidator
                    password={passwordFormik.values.newPassword}
                  />
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    className={
                      passwordFormik.touched.confirmPassword &&
                      passwordFormik.errors.confirmPassword
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
                      right: passwordFormik.values.confirmPassword
                        ? "32px"
                        : "0px",
                    }}>
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>

                  {/* Clear button */}
                  {passwordFormik.values.confirmPassword && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() =>
                        clearField(passwordFormik, "confirmPassword")
                      }
                      style={{ backgroundColor: "transparent" }}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Error message */}
                {passwordFormik.touched.confirmPassword &&
                  passwordFormik.errors.confirmPassword && (
                    <div className="text-sm text-destructive">
                      {passwordFormik.errors.confirmPassword}
                    </div>
                  )}
              </div>

              {passwordSuccess && (
                <div className="p-3 rounded-md bg-green-100 text-green-700 text-center">
                  Password updated successfully!
                </div>
              )}

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  passwordFormik.isSubmitting ||
                  Object.keys(passwordFormik.errors).length > 0
                }>
                {passwordFormik.isSubmitting
                  ? "Updating..."
                  : "Change Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
