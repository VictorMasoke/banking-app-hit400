"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";
import { signIn, signUp } from "@/lib/actions/auth.actions";
import { sendNotification } from "@/lib/actions/notifications.actions";

const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(type === 'sign-up' && {
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Zimbabwe",
        securityQuestion: "What city were you born in?",
        securityAnswer: "",
        role: "user",
      }),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if(type === 'sign-in') {
        const user = await signIn({
          email: data.email,
          password: data.password,
        });
        // Redirect to dashboard after successful sign-in
        if (user.role === 'admin') {
          router.push('/admin/home');
        } else {
          router.push('/');
        }
      }

      if(type === 'sign-up') {
        const userData = {
          first_name: data.firstName!,
          last_name: data.lastName!,
          email: data.email,
          phone: data.phone!,
          password: data.password,
          date_of_birth: data.dateOfBirth!,
          address: data.address!,
          city: data.city!,
          state: data.state!,
          zip_code: data.zipCode!,
          country: data.country!,
          security_question: data.securityQuestion!,
          security_answer: data.securityAnswer!,

        };

        await signUp(userData);

        await sendNotification({email: data.email, subject: 'Welcome to Basel Banking', content: `<!DOCTYPE html> <html> <head> <meta charset="UTF-8"> <title>Welcome to Basel Banking</title> </head> <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;"> <table align="center" width="100%" style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);"> <tr> <td style="background-color:#003366; color:#ffffff; padding:20px 30px; text-align:center;"> <h1 style="margin:0; font-size:24px;">Welcome to Basel Banking</h1> </td> </tr> <tr> <td style="padding:30px;"> <p style="font-size:16px; color:#333333;">Dear Valued Customer,</p> <p style="font-size:16px; color:#333333;"> We're thrilled to have you with us! At <strong>Basel Banking</strong>, we are committed to providing you with secure, innovative, and customer-friendly financial services. </p> <p style="font-size:16px; color:#333333;"> You can now access your dashboard, manage your accounts, and explore our latest features designed to help you bank smarter. </p> <p style="font-size:16px; color:#333333;">If you have any questions, our support team is just a click away.</p> <div style="margin:30px 0; text-align:center;"> <a href="http://localhost:3000/" style="display:inline-block; padding:12px 24px; background-color:#003366; color:#ffffff; text-decoration:none; border-radius:4px;">Access Your Account</a> </div> <p style="font-size:14px; color:#777777;">Thank you for choosing Basel Banking.</p> </td> </tr> <tr> <td style="background-color:#f0f0f0; text-align:center; padding:15px; font-size:12px; color:#999999;"> &copy; 2025 Basel Banking. All rights reserved. </td> </tr> </table> </body> </html>`});

        // Redirect to sign-in page after successful sign-up
        router.push('/sign-in');
      }

    } catch (error: any) {
      setErrorMessage(error?.message || "An unexpected error occurred");
      setIsLoading(false);
      console.log(error);
    }
  }

  return (
    <section className="auth-form">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

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
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              Please enter your details
            </p>
          </h1>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === "sign-up" && (
            <>
              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="firstName"
                  placeholder="Enter your first name"
                  label="First Name"
                />
                <CustomInput
                  control={form.control}
                  name="lastName"
                  placeholder="Enter your last name"
                  label="Last Name"
                />
              </div>

              <CustomInput
                control={form.control}
                name="email"
                placeholder="Enter your email"
                label="Email"
              />

              <CustomInput
                control={form.control}
                name="phone"
                placeholder="Enter your phone number"
                label="Phone Number"
              />

              <CustomInput
                control={form.control}
                name="dateOfBirth"
                placeholder="YYYY-MM-DD"
                label="Date of Birth"
              />

              <CustomInput
                control={form.control}
                name="address"
                placeholder="Enter your street address"
                label="Street Address"
              />

              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="city"
                  placeholder="Enter your city"
                  label="City"
                />
                <CustomInput
                  control={form.control}
                  name="state"
                  placeholder="Enter your state"
                  label="State"
                />
              </div>

              <div className="flex gap-4">
                <CustomInput
                  control={form.control}
                  name="zipCode"
                  placeholder="Enter your ZIP code"
                  label="ZIP Code"
                />
                <CustomInput
                  control={form.control}
                  name="country"
                  placeholder="Enter your country"
                  label="Country"
                />
              </div>

              <CustomInput
                control={form.control}
                name="securityQuestion"
                placeholder="Enter security question"
                label="Security Question"
              />

              <CustomInput
                control={form.control}
                name="securityAnswer"
                placeholder="Enter security answer"
                label="Security Answer"
              />
            </>
          )}

          {type === "sign-in" && (
            <>
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Enter your email"
                label="Email"
              />
            </>
          )}

          <CustomInput
            control={form.control}
            name="password"
            placeholder="Enter your password"
            label="Password"
            type="password"
          />

          <div className="flex flex-col gap-4">
            <Button className="form-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading ...
                </>
              ) : type === "sign-in" ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>

        <footer className="flex flex-wrap justify-center gap-1 text-center mt-6">
          <p className="text-14 font-normal text-gray-600">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            className="form-link"
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
          {type === "sign-in" && (
            <>
              <span className="text-gray-400 mx-1">|</span>
              <Link
                className="form-link"
                href="/reset"
              >
                Forgot Password?
              </Link>
            </>
          )}
        </footer>
      </Form>
    </section>
  );
};

export default AuthForm;
