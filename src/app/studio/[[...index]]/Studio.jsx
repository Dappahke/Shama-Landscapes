// src/app/studio/[[...index]]/Studio.jsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function Studio() {
  // The config file in your root handles the 'basePath: "/studio"'
  return <NextStudio config={config} />;
}