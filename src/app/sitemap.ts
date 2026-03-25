import { MetadataRoute } from "next"

// export default function sitemap() {
export default function sitemap(): MetadataRoute.Sitemap {
  //   const baseUrl = "https://www.collegecutoff.net";
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "https://clgcutoff-local.vercel.app/";

  const courseTypes = [
    "NEET PG",
    "NEET UG",
    "NEET MDS",
    "NEET SS",
    "INICET",
    "DNB",
    "AIAPGET (Ayurveda)",
  ]

//   const states = [
//     { code: "all", name: "All India" },
//     { code: "AN", name: "Andaman and Nicobar Islands" },
//     { code: "AD", name: "Andhra Pradesh" },
//     { code: "AR", name: "Arunachal Pradesh" },
//     { code: "AS", name: "Assam" },
//     { code: "BR", name: "Bihar" },
//     { code: "CH", name: "Chandigarh" },
//     { code: "CG", name: "Chhattisgarh" },
//     // 👉 add all remaining states here
//   ]

  const states = [
  { name: "All India", slug: "all-india", code: "all" },
  { name: "Andaman and Nicobar Islands", slug: "andaman-and-nicobar-islands", code: "AN" },
  { name: "Andhra Pradesh", slug: "andhra-pradesh", popular: true, code: "AD" },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh", code: "AR" },
  { name: "Assam", slug: "assam", code: "AS" },
  { name: "Bihar", slug: "bihar", code: "BR" },
  { name: "Chandigarh", slug: "chandigarh", code: "CH" },
  { name: "Chhattisgarh", slug: "chhattisgarh", code: "CG" },
  { name: "Dadra and Nagar Haveli", slug: "dadra-and-nagar-haveli", code: "DN" },
  { name: "Delhi", slug: "delhi", code: "DL" },
  { name: "Daman and Diu", slug: "daman-and-diu", code: "DD" },
  { name: "Goa", slug: "goa", code: "GA" },
  { name: "Gujarat", slug: "gujarat", popular: true, code: "GJ" },
  { name: "Haryana", slug: "haryana", code: "HR" },
  { name: "Himachal Pradesh", slug: "himachal-pradesh", code: "HP" },
  { name: "Jammu and Kashmir", slug: "jammu-and-kashmir", code: "JK" },
  { name: "Jharkhand", slug: "jharkhand", code: "JH" },
  { name: "Karnataka", slug: "karnataka", popular: true, code: "KA" },
  { name: "Kerala", slug: "kerala", popular: true, code: "KL" },
  { name: "Ladakh", slug: "ladakh", code: "LA" },
  { name: "Lakshadweep", slug: "lakshadweep", code: "LD" },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", code: "MP" },
  { name: "Maharashtra", slug: "maharashtra", popular: true, code: "MH" },
  { name: "Manipur", slug: "manipur", code: "MN" },
  { name: "Meghalaya", slug: "meghalaya", code: "ML" },
  { name: "Mizoram", slug: "mizoram", code: "MZ" },
  { name: "Nagaland", slug: "nagaland", code: "NL" },
  { name: "Odisha", slug: "odisha", code: "OD" },
  { name: "Pondicherry", slug: "pondicherry", code: "PY" },
  { name: "Punjab", slug: "punjab", code: "PB" },
  { name: "Rajasthan", slug: "rajasthan", code: "RJ" },
  { name: "Sikkim", slug: "sikkim", code: "SK" },
  { name: "Tamil Nadu", slug: "tamil-nadu", popular: true, code: "TN" },
  { name: "Telangana", slug: "telangana", popular: true, code: "TS" },
  { name: "Tripura", slug: "tripura", code: "TR" },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", popular: true, code: "UP" },
  { name: "Uttarakhand", slug: "uttarakhand", code: "UK" },
  { name: "West Bengal", slug: "west-bengal", code: "WB" },
]

  const urls: any[] = []

  // Static pages
  const staticPages = [
    "",
    "/contact-us",
    "/pricing-policy",
    "/terms-and-conditions",
    "/cancellation-refund-policy",
    "/shipping-policy",
    "/privacy-policy",
    "/closing-ranks",
  ]

  staticPages.forEach((path) => {
    urls.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  })

  // Course pages
  courseTypes.forEach((course) => {
    urls.push({
      url: `${baseUrl}/closing-ranks?courseType=${encodeURIComponent(course)}`,
    })
  })

  // State + Course pages
  states.forEach((state) => {
    courseTypes.forEach((course) => {
      urls.push({
        url: `${baseUrl}/closing-ranks/${state.code}?state=${encodeURIComponent(
          state.name,
        )}&amp;courseType=${encodeURIComponent(course)}`,
      })
    })
  })

  return urls
}
