"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "bg-card text-card-foreground border border-border",
            formFieldInput: "border-input",
          },
        }}
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
