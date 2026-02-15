"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LABEL_MAP: Record<string, string> = {
//   admin: "Admin",
  profile: "Profile",
  results: "Results",
  packages: "Packages",
  status: "Status",
  "contact-us": "Contact Us",
  "privacy-policy": "Privacy Policy",
  "terms-and-conditions": "Terms & Conditions",
  "shipping-policy": "Shipping Policy",
  "pricing-policy": "Pricing Policy",
  "cancellation-refund-policy": "Cancellation & Refund Policy",
  "closing-ranks": "Closing Ranks",
  "college-details": "College Details",
  cutoff: "Cutoff",
};

const STATE_MAP: Record<string, string> = {
  ad: "Andhra Pradesh",
  an: "Andaman and Nicobar",
  ar: "Arunachal Pradesh",
  as: "Assam",
  br: "Bihar",
  ch: "Chandigarh",
  cg: "Chhattisgarh",
  dl: "Delhi",
  dn: "Dadra and Nagar Haveli",
  dd: "Daman and Diu",
  ga: "Goa",
  gj: "Gujarat",
  hr: "Haryana",
  hp: "Himachal Pradesh",
  jh: "Jharkhand",
  jk: "Jammu & Kashmir",
  ka: "Karnataka",
  kl: "Kerala",
  la: "Ladakh",
  ld: "Lakshadweep",
  mh: "Maharashtra",
  ml: "Meghalaya",
  mn: "Manipur",
  mp: "Madhya Pradesh",
  mz: "Mizoram",
  nl: "Nagaland",
  od: "Odisha",
  pb: "Punjab",
  py: "Pondicherry",
  rj: "Rajasthan",
  sk: "Sikkim",
  ts: "Telangana",
  tn: "Tamil Nadu",
  tr: "Tripura",
  up: "Uttar Pradesh",
  uk: "Uttarakhand",
  wb: "West Bengal",
};


export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // hide breadcrumbs on home & admin (optional)
  if (segments.length === 0 || segments[0] === "admin") return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center text-lg text-gray-600">
        <li>
          <Link href="/" className="text-[rgb(230_120_23)] hover:underline">
            Home
          </Link>
          {/* {segments.length > 0 && <span className="mx-2">{">"}</span>} */}
          {segments.length > 0 && <span className="mx-2">{"▶"}</span>}
        </li>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

        //   const label =
        //     LABEL_MAP[segment] ||
        //     segment.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

        const label =
        STATE_MAP[segment.toLowerCase()] ||
        LABEL_MAP[segment] ||
        segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());


          return (
            <li key={href} className="flex items-center">
              {isLast ? (
                <span className="font-medium text-[rgb(0_84_164)]">{label}</span>
              ) : (
                <>
                  <Link href={href} className="text-[rgb(230_120_23)] hover:underline">
                    {label}
                  </Link>
                  <span className="mx-2">{"▶"}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
