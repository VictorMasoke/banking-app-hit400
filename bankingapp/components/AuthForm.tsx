"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";
import { resolve } from "path";

import { AlertCircle } from "lucide-react"
 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    
    
    try {
      setIsLoading(true);
      if(type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        })

        if (response.role === "user") {
          router.push('/')
        } else if (response.role === "admin") {
          router.push('/admin/home')
        } else (
          console.log("An error occured during log in.")
        );
      }

      if(type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          state: data.state!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password
        }

        const newUser = await signUp(userData);

        setUser(newUser);
      }
      
    } catch (error) {
      setErrorMessage(error?.message || "An unexpected error occurred");
      setIsLoading(false);
      console.log(error)
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
            alt="Horizon Logo"
          />
          <h1 className="text-26 font-bold text-black-1">Basel Banking</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p>
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant='primary'/>
        </div>
      ) : (
        <>
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
                    name="address1"
                    placeholder="Enter your specific address"
                    label="Address"
                  />

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="city"
                      placeholder="Example: Harare"
                      label="City"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      placeholder="Example: 0000"
                      label="Postal Code"
                    />
                  </div>

                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      placeholder="Example: AI"
                      label="State"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      placeholder="Example: 074942011"
                      label="SSN"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="dateOfBirth"
                    placeholder="YYYY-MM-DD"
                    label="Date Of Birth"
                  />
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                placeholder="Enter your email"
                label="Email Address"
              />

              <CustomInput
                control={form.control}
                name="password"
                placeholder="Enter your password"
                label="Password"
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

            <footer className="flex justify-center gap-1">
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
            </footer>
          </Form>
        </>
      )}
    </section>
  );
};

export default AuthForm;
