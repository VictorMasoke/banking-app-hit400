"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { Loader2 } from "lucide-react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { resetPassword, getSecurityQuestion } from "@/lib/actions/auth.actions";
import { FormControl } from "@/components/ui/form";

// Step 1: Email form schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Step 2: Reset password form schema
const resetSchema = z.object({
  securityAnswer: z.string().min(1, "Security answer is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = {
  email: string;
  securityAnswer: string;
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordForm = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [email, setEmail] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      securityAnswer: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get security question for the email
      const question = await getSecurityQuestion(values.email);
      setSecurityQuestion(question);
      setEmail(values.email);

      resetForm.reset({
        securityAnswer: "",  // ← Ensure this is empty
        newPassword: "",
        confirmPassword: ""
      });

      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve security question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (values: z.infer<typeof resetSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      await resetPassword(email, values.securityAnswer, values.newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/money-mail-svgrepo-com.svg"
            width={50}
            height={50}
            alt="Bank Logo"
          />
          <h1 className="text-26 font-bold text-black-1">Basel Banking</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {success ? "Success!" : step === 1 ? "Reset Password" : "Verify Identity"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {success
              ? "Your password has been updated successfully"
              : step === 1
              ? "Enter your email to begin password reset"
              : "Please answer your security question"}
          </p>
          {step === 2 && !success && (
            <p className="text-16 font-normal text-gray-600">
              {securityQuestion}
            </p>
          )}
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success ? (
        <div className="flex flex-col gap-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Password Updated</AlertTitle>
            <AlertDescription>
              You can now sign in with your new password.
            </AlertDescription>
          </Alert>
          <Link href="/sign-in" className="form-btn">
            Return to Sign In
          </Link>
        </div>
      ) : step === 1 ? (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
            <CustomInput
              control={emailForm.control}
              name="email"
              placeholder="Enter your registered email"
              label="Email Address"
              type="email"
            />

            <div className="flex flex-col gap-4">
              <Button className="form-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Checking...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-8">
          <div className="form-item flex w-full flex-col">
          <FormControl>
            <input
              {...resetForm.register("securityAnswer")}
              placeholder="Enter your answer"
              className="input-class"
            />
          </FormControl>

          </div>


            <CustomInput
              control={resetForm.control}
              name="newPassword"
              placeholder="Enter your new password"
              label="New Password"
              type="password"
            />

            <CustomInput
              control={resetForm.control}
              name="confirmPassword"
              placeholder="Confirm your new password"
              label="Confirm Password"
              type="password"
            />

            <div className="flex flex-col gap-4">
              <Button className="form-btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setStep(1);
                  emailForm.reset({ email: "" });
                  setEmail("");
                }}
                disabled={isLoading}
              >
                Back
              </Button>

            </div>
          </form>
        </Form>
      )}
    </section>
  );
};

export default ResetPasswordForm;
