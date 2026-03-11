import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      }
    >
      <UnsubscribeClient />
    </Suspense>
  );
}