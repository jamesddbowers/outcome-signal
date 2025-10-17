"use client";

import React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "bg-card text-card-foreground border border-border",
            formFieldInput: "border-input",
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
