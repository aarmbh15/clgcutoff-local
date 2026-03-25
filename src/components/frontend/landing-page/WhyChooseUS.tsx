// export default function WhyChooseUs() {
//   const benefits = [
//     {
//       icon: "Lightbulb",
//       title: "Focused on Private and Deemed Medical Colleges",
//       description:
//         // "We specialize in providing accurate information exclusively for private and deemed medical colleges across India, helping you make informed decisions for both MBBS and MD/MS admissions.",
//         "We specialize in accurate NEET college prediction for private and deemed medical colleges across India, helping students secure MBBS, MD/MS, and other medical seats under management and NRI quotas.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Comprehensive Cutoff Data for MBBS and MD/MS",
//       description:
//         // "Access last year's detailed cutoff information — college-wise and category-wise — for MBBS and across all MD/MS specializations. This gives you complete clarity to plan your medical admission journey with confidence.",
//         "Access detailed NEET cutoff data including college-wise and category-wise closing ranks for NEET UG, NEET PG and NEET MDS to understand your real admission chances.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       icon: "Award",
//       title: "Authentic Information Sourced from Official Authorities",
//       description:
//         "All our data is directly sourced from official counseling authority websites, ensuring it's genuine, verified, and completely up-to-date — no manipulation, no guesswork.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Personalized Counseling for Management and NRI Quota",
//       description:
//         "Private medical education is a significant investment, and a single mistake can cost a valuable seat. We offer paid personalized counseling (via phone, WhatsApp, and in-person) specifically for Management and NRI quota admissions — expert guidance that goes beyond what the portal alone can offer.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       icon: "Award",
//       title: "Simple, Transparent Process",
//       description:
//         "Our platform is clean and easy to use — check cutoff details instantly and reach out when you need one-on-one support. No confusing dashboards. No hidden steps.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Trusted by Medical Aspirants",
//       description:
//         "Every year, hundreds of MBBS and MD/MS aspirants rely on CollegeCutoff.net for accurate information and genuine support throughout their admission process.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//   ]

//   // Function to render the appropriate icon
//   const renderIcon = (iconName: string, colorClass: string) => {
//     switch (iconName) {
//       case "Lightbulb":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className={`${colorClass} h-6 w-6`}
//           >
//             <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
//             <path d="M9 18h6" />
//             <path d="M10 22h4" />
//           </svg>
//         )
//       case "Users":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className={`${colorClass} h-6 w-6`}
//           >
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//             <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//             <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//           </svg>
//         )
//       case "Award":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             className={`${colorClass} h-6 w-6`}
//           >
//             <circle cx="12" cy="8" r="6" />
//             <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
//           </svg>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <section className="w-full py-16 md:py-20 relative overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.05)_0%,rgba(255,255,255,0)_50%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.05)_0%,rgba(255,255,255,0)_50%)] -z-10"></div>
//       <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-yellow-200 opacity-10 blur-3xl -z-10"></div>
//       <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-emerald-200 opacity-10 blur-3xl -z-10"></div>

//       <div className="mx-auto">
//         <div className="text-center mb-10 md:mb-16">
//           <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4 ">
//             WHAT SETS US APART
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold">
//             {/* Why Choose Us */}
//             Why Choose Our NEET College Predictor
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-emerald-500 mx-auto mt-2"></div>
//         </div>

//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-16">
//             {benefits.map((benefit, index) => (
//               <div key={index} className="relative">
//                 <div
//                   className={`absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br ${benefit.color} -z-10 transform -rotate-1 scale-[1.02] opacity-70`}
//                 ></div>
//                 <div className="flex gap-3 md:gap-5 p-4 md:p-6 rounded-xl">
//                   <div
//                     className={`${benefit.iconBg} h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm`}
//                   >
//                     {renderIcon(benefit.icon, benefit.iconColor)}
//                   </div>
//                   <div>
//                     <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
//                       {benefit.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm md:text-base">
//                       {benefit.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* CTA */}
//           <div className="mt-12 md:mt-20 text-center">
//             <a
//               href="#"
//               className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               Try Our College Predictor Now
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="ml-2 h-5 w-5"
//               >
//                 <path d="M5 12h14" />
//                 <path d="m12 5 7 7-7 7" />
//               </svg>
//             </a>
//             <p className="text-gray-500 mt-4">
//               Join 30,000+ students who found their perfect medical college
//               match
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default function WhyChooseUs() {
//   const benefits = [
//     {
//       icon: "Lightbulb",
//       title: "Focused on Private and Deemed Medical Colleges",
//       description:
//         "We specialize in accurate NEET college prediction for private and deemed medical colleges across India, helping students secure MBBS, MD/MS, and other medical seats under management and NRI quotas.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Comprehensive Cutoff Data for MBBS and MD/MS",
//       description:
//         "Access detailed NEET cutoff data including college-wise and category-wise closing ranks for NEET UG, NEET PG and NEET MDS to understand your real admission chances.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       icon: "Award",
//       title: "Authentic Information Sourced from Official Authorities",
//       description:
//         "All our data is directly sourced from official counseling authority websites, ensuring it's genuine, verified, and completely up-to-date — no manipulation, no guesswork.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Personalized Counseling for Management and NRI Quota",
//       description:
//         "Private medical education is a significant investment, and a single mistake can cost a valuable seat. We offer paid personalized counseling via phone, WhatsApp, and in-person.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//     {
//       icon: "Award",
//       title: "Simple, Transparent Process",
//       description:
//         "Our platform is clean and easy to use — check cutoff details instantly and reach out when you need one-on-one support.",
//       color: "from-yellow-500/20 to-yellow-100/20",
//       iconBg: "bg-yellow-100",
//       iconColor: "text-yellow-600",
//     },
//     {
//       icon: "Users",
//       title: "Trusted by Medical Aspirants",
//       description:
//         "Every year, thousands of MBBS and MD/MS aspirants rely on us for accurate information and genuine support.",
//       color: "from-emerald-500/20 to-emerald-100/20",
//       iconBg: "bg-emerald-100",
//       iconColor: "text-emerald-600",
//     },
//   ]

//   const renderIcon = (iconName, colorClass) => {
//     const common = `${colorClass} h-6 w-6`

//     switch (iconName) {
//       case "Lightbulb":
//         return (
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={common}>
//             <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
//             <path d="M9 18h6" />
//             <path d="M10 22h4" />
//           </svg>
//         )
//       case "Users":
//         return (
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={common}>
//             <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//             <circle cx="9" cy="7" r="4" />
//             <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//           </svg>
//         )
//       case "Award":
//         return (
//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={common}>
//             <circle cx="12" cy="8" r="6" />
//             <path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1" />
//           </svg>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <section className="w-full py-16 md:py-20 relative overflow-hidden">

//       {/* 🔥 Premium Background Glow */}
//       <div className="absolute inset-0 
//         bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.10),transparent_40%),
//             radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.10),transparent_40%)]
//         -z-10" />

//       <div className="mx-auto">

//         {/* Header */}
//         <div className="text-center mb-12 md:mb-16">
//           <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 border border-yellow-200 mb-4">
//             WHAT SETS US APART
//           </div>

//           <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
//             Why Choose Our NEET College Predictor
//           </h2>

//           <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-emerald-500 mx-auto mt-3 rounded-full"></div>
//         </div>

//         {/* Grid */}
//         <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-10">

//           {benefits.map((benefit, index) => (
//             <div key={index} className="relative">

//               {/* Gradient Layer */}
//               <div
//                 className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.color} 
//                 -z-10 transform -rotate-1 scale-[1.02] opacity-90 blur-[2px]`}
//               />

//               {/* Card */}
//               <div
//                 className="group flex gap-4 p-5 md:p-6 rounded-2xl 
//                 bg-white/80 backdrop-blur-sm
//                 border border-gray-100
//                 shadow-[0_10px_30px_rgba(0,0,0,0.05)]
//                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
//                 transition-all duration-300 
//                 hover:-translate-y-1 hover:scale-[1.01]"
//               >

//                 {/* Icon */}
//                 <div
//                   className={`${benefit.iconBg} h-12 w-12 md:h-14 md:w-14 rounded-xl 
//                   flex items-center justify-center flex-shrink-0 mt-1
//                   shadow-inner ring-1 ring-black/5
//                   group-hover:scale-110 transition`}
//                 >
//                   {renderIcon(benefit.icon, benefit.iconColor)}
//                 </div>

//                 {/* Content */}
//                 <div>
//                   <h3 className="text-[17px] md:text-[20px] font-semibold tracking-tight mb-2">
//                     {benefit.title}
//                   </h3>

//                   <p className="text-gray-600 text-[13.5px] md:text-[15px] leading-relaxed">
//                     {benefit.description}
//                   </p>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CTA */}
//         <div className="mt-14 md:mt-20 text-center">
//           <div className="relative inline-block">
//             <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-yellow-400 to-emerald-400 rounded-full"></div>

//             <a
//               href="#"
//               className="relative inline-flex items-center px-6 py-3 md:px-8 md:py-4 
//               rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 
//               text-white font-medium
//               shadow-lg hover:shadow-xl
//               transition-all duration-300
//               hover:scale-[1.03] active:scale-[0.98]"
//             >
//               Try Our College Predictor Now
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 h-5 w-5">
//                 <path d="M5 12h14" />
//                 <path d="m12 5 7 7-7 7" />
//               </svg>
//             </a>
//           </div>

//           <p className="text-gray-500 mt-4 text-sm md:text-base">
//             Join 30,000+ students who found their perfect medical college match
//           </p>
//         </div>

//       </div>
//     </section>
//   )
// }

// "use client"
// import { motion } from "framer-motion"
// import { ShieldCheck, Database, Headphones, Globe, Sparkles, TrendingUp } from "lucide-react"

// export default function WhyChooseUs() {
//   const benefits = [
//     {
//       title: "Private & Deemed Specialists",
//       desc: "Deep expertise in Management and NRI quota admissions across India.",
//       icon: <Sparkles className="text-yellow-600" />,
//     },
//     {
//       title: "Direct Official Sourcing",
//       desc: "Data pulled directly from MCC and state authorities—no guesswork involved.",
//       icon: <Database className="text-emerald-600" />,
//     },
//     {
//       title: "Verified Cutoff Accuracy",
//       desc: "Historical data analysis for NEET UG, PG, and MDS with 99% precision.",
//       icon: <ShieldCheck className="text-yellow-600" />,
//     },
//     {
//       title: "Personalized Paid Counseling",
//       desc: "One-on-one expert guidance via WhatsApp and Call for critical decisions.",
//       icon: <Headphones className="text-emerald-600" />,
//     },
//   ]

//   return (
//     <section className="w-full py-24 bg-gradient-to-b from-white to-yellow-50/30">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
          
//           {/* Left Side: Content */}
//           <div className="space-y-8">
//             <div>
//               <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
//                 Why Medical Aspirants Trust Us
//               </span>
//               <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1]">
//                 Your Future in Medicine, <br />
//                 <span className="text-yellow-500">Predicted with Precision.</span>
//               </h2>
//             </div>

//             <div className="space-y-6">
//               {benefits.map((item, index) => (
//                 <motion.div 
//                   key={index}
//                   whileHover={{ x: 10 }}
//                   className="flex gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all"
//                 >
//                   <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-xl flex items-center justify-center">
//                     {item.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
//                     <p className="text-gray-500 leading-relaxed mt-1">{item.desc}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Right Side: Visual Trust Card */}
//           <div className="relative">
//             <div className="absolute inset-0 bg-yellow-400 rounded-[3rem] rotate-3 opacity-10"></div>
//             <div className="relative bg-white border border-yellow-100 p-10 rounded-[3rem] shadow-xl">
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
//                     <TrendingUp />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 font-medium">Success Rate</p>
//                     <p className="text-2xl font-bold text-gray-900">98.4% Accuracy</p>
//                   </div>
//                 </div>
//                 <hr className="border-gray-50" />
//                 <p className="text-gray-600 italic leading-relaxed">
//                   "The predictor helped me understand that I had a chance in Deemed universities even when I thought my score was too low. Highly recommended!"
//                 </p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                   <div>
//                     <p className="font-bold text-gray-800">Aditya Verma</p>
//                     <p className="text-xs text-gray-500">NEET UG Aspirant 2025</p>
//                   </div>
//                 </div>
//                 <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-yellow-500 transition-colors shadow-lg">
//                   Get Started for Free
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }

"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Database, Headphones, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function WhyChooseUs() {
  const benefits = [
    {
      title: "Private & Deemed Specialists",
      desc: "Deep expertise in Management and NRI quota admissions across India.",
      icon: <Sparkles className="text-yellow-600" />,
    },
    {
      title: "Direct Official Sourcing",
      desc: "Data pulled directly from MCC and state authorities—no guesswork involved.",
      icon: <Database className="text-emerald-600" />,
    },
    {
      title: "Verified Cutoff Accuracy",
      desc: "Historical data analysis for NEET UG, PG, and MDS with 99% precision.",
      icon: <ShieldCheck className="text-yellow-600" />,
    },
    {
      title: "Personalized Paid Counseling",
      desc: "One-on-one expert guidance via WhatsApp and Call for critical decisions.",
      icon: <Headphones className="text-emerald-600" />,
    },
  ]

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-yellow-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                What Sets Us Apart
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.1]">
                Your Medical Career, <br />
                <span className="text-yellow-500">Planned with Data.</span>
              </h2>
            </div>

            <div className="space-y-6">
              {benefits.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ x: 10 }}
                  className="flex gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-100 shadow-sm rounded-xl flex items-center justify-center group-hover:border-yellow-200 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed mt-1 text-sm md:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Professional Trust & Accuracy Card */}
          <div className="relative">
            {/* Soft decorative glow */}
            <div className="absolute inset-0 bg-yellow-400 rounded-[3rem] rotate-2 opacity-5 blur-2xl"></div>
            
            <div className="relative bg-white border border-yellow-100 p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(234,179,8,0.12)]">
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Reliability Score</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tight">99.2% Accuracy</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 font-semibold text-lg">Comprehensive Data Coverage:</p>
                  <ul className="space-y-3">
                    {['All India Quota (AIQ) 15%', 'State Quota Counselling (85%)', 'Deemed & Central Universities', 'Management & NRI Quota Seats'].map((text, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-600">
                        <CheckCircle2 className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Link href="#predict">
                  <button className="w-full py-5 bg-gray-900 text-white rounded-[1.5rem] font-bold hover:bg-yellow-500 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-yellow-200/50 flex items-center justify-center gap-2">
                    Predict My Chances Now
                  </button>
                  </Link>
                  <p className="text-center text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">
                    Updated for 2026 Academic Session
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}