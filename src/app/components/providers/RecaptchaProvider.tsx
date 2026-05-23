"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RecaptchaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      useRecaptchaNet={true}
      scriptProps={{
        async: true,
        defer: true,
        id: "recaptcha-script", // ← prevents duplicate script injection
      }}
      container={{
        parameters: {
          badge: "bottomright",
          theme: "dark",
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}