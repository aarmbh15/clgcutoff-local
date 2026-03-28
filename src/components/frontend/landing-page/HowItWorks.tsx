// "use client"

// import { motion } from "framer-motion"
// import {
//   ArrowRight,
//   Award,
//   BarChart,
//   BookOpen,
//   Building,
//   CheckSquare,
//   ClipboardList,
//   Compass,
//   FileText,
//   GraduationCap,
//   Lightbulb,
//   Search,
//   Users,
// } from "lucide-react"

// import WhyChooseUs from "./WhyChooseUS"
// import {Edit, MapPin, BarChart3 } from "lucide-react";

// const steps = [
//   {
//     title: "Select the Course Type",
//     desc: "Start by selecting whether you're applying for UG or PG medical admissions.",
//     icon: <ClipboardList className="text-yellow-600" size={28} />,
//     iconBg: "bg-yellow-100"
//   },
//   {
//     title: "Select Rank/Score Type",
//     desc: "Choose Rank, Marks or Percentile using radio buttons.",
//     icon: <Search className="text-green-600" size={28} />,
//     iconBg: "bg-green-100"
//   },
//   {
//     title: "Enter Your Details",
//     desc: "Enter your NEET rank, marks, or percentile based on selection.",
//     icon: <Edit className="text-yellow-600" size={28} />,
//     iconBg: "bg-yellow-100"
//   },
//   {
//     title: "Select Your Domicile State",
//     desc: "Choose your state to filter colleges under quota.",
//     icon: <MapPin className="text-green-600" size={28} />,
//     iconBg: "bg-green-100"
//   },
//   {
//     title: "Choose Your Course",
//     desc: "Select course like MBBS, BDS, MD, MS etc.",
//     icon: <CheckSquare className="text-yellow-600" size={28} />,
//     iconBg: "bg-yellow-100"
//   },
//   {
//     title: "Predict Your College",
//     desc: "Get list of colleges based on your score and cutoff data.",
//     icon: <BarChart3 className="text-green-600" size={28} />,
//     iconBg: "bg-green-100"
//   }
// ];

// export default function HowItWorks() {
//   return (
//     // <section id="how-it-works"  className="w-full py-20 md:py-28 relative overflow-hidden">
//     //   <div className="container px-4 md:px-6 mx-auto">
//     //     <div className="text-center mb-12">
//     //       <h2 className="text-3xl font-bold text-color-table-header">
//     //         {/* How It Works */}
//     //         How NEET College Predictor 2026 Works
//     //       </h2>
//     //       <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
//     //         {/* Simple steps to find your perfect medical college match */}
//     //         Simple steps to predict colleges based on NEET rank, marks or percentile
//     //       </p>
//     //     </div>

//     //     {/* Desktop Timeline */}
//     //     <div className="relative mb-20">
//     //       <div className="grid pc:grid-cols-3 gap-8 gap-y-24 text-black">
//     //         {/* Step 1 */}
//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.1 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               1
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
//     //                   <ClipboardList className="h-10 w-10 text-yellow-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 Select the Course Type
//     //               </h3>
//     //               <p className="text-gray-600 text-center mb-6">
//     //                 {`Start by selecting whether you're applying for UG or PG
//     //                 medical admissions.`}
//     //               </p>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <FileText className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Step 2 */}
//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.3 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               2
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
//     //                   <Search className="h-10 w-10 text-emerald-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 Select Rank/Score Type (Radio Button)
//     //               </h3>
//     //               <div className="mb-6 text-gray-600 ">
//     //                 <p className="text-center ">
//     //                   Choose the appropriate option using the radio buttons:
//     //                 </p>
//     //                 <ul className="list-disc list-inside pl-4 space-y-2 mt-2">
//     //                   <li>For UG, pick either Rank or Marks</li>
//     //                   <li>For PG, pick either Rank or Percentile</li>
//     //                 </ul>
//     //               </div>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <BarChart className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Step 3 */}
//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.5 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               3
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
//     //                   <CheckSquare className="h-10 w-10 text-yellow-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 Enter Your Details
//     //               </h3>
//     //               <p className="text-gray-600 text-center mb-6">
//     //                 {`Based on your radio selection, enter your valid NEET Rank, Marks, or Percentile in the input field.`}
//     //               </p>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <Compass className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Step 4 */}

//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.3 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               4
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
//     //                   <Search className="h-10 w-10 text-emerald-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 Select Your Domicile State
//     //               </h3>
//     //               <p className="text-gray-600 text-center mb-6">
//     //                 Choose the state you belong to (your domicile). This helps
//     //                 filter colleges under state-specific quotas.
//     //               </p>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <BarChart className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Step 5 */}
//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.5 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               5
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
//     //                   <CheckSquare className="h-10 w-10 text-yellow-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 {`Choose Your Course`}
//     //               </h3>
//     //               <p className="text-gray-600 text-center mb-6">
//     //                 {`Select the medical course you're interested in — like MBBS, BDS, BAMS, BHMS, MD, MS, etc.`}
//     //               </p>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <Compass className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Step 6 */}
//     //         <div className="relative">
//     //           <motion.div
//     //             className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10 h-full min-h-[24rem]"
//     //             initial={{ opacity: 0, y: 50 }}
//     //             whileInView={{ opacity: 1, y: 0 }}
//     //             transition={{ duration: 0.5, delay: 0.3 }}
//     //             viewport={{ once: true, margin: "-100px" }}
//     //           >
//     //             <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white">
//     //               6
//     //             </div>
//     //             <div className="pt-6">
//     //               <div className="flex justify-center mb-6">
//     //                 <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
//     //                   <Search className="h-10 w-10 text-emerald-600" />
//     //                 </div>
//     //               </div>
//     //               <h3 className="text-xl font-bold text-center mb-4">
//     //                 Predict Your College
//     //               </h3>
//     //               <p className="text-gray-600 text-center mb-6">
//     //                 {`Click on “Predict My College” to get a list of private and deemed medical colleges you are eligible for, based on the most updated and accurate cutoff data.`}
//     //               </p>
//     //             </div>
//     //           </motion.div>
//     //           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
//     //             <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-4 border-white">
//     //               <BarChart className="h-10 w-10 text-white" />
//     //             </div>
//     //           </div>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </section>
//     <section id="how-it-works" className="relative py-16 px-4 tab:px-10">

//   {/* Heading */}
//   <div className="text-center mb-14">
//     <h2 className="text-[26px] tab:text-[32px] font-semibold text-color-table-header">
//       How NEET College Predictor 2026 Works
//     </h2>
//     <p className="text-gray-500 mt-2 text-sm tab:text-base">
//       Simple steps to predict colleges based on NEET rank, marks or percentile
//     </p>
//   </div>

//   {/* Grid */}
//   <div className="relative max-w-6xl mx-auto grid grid-cols-1 tab:grid-cols-2 pc:grid-cols-3 gap-8">

//     {steps.map((step, index) => (
//       <div
//         key={index}
//         className="relative bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
//       >

//         {/* Step Number */}
//         <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-green-500 text-white text-sm font-bold w-9 h-9 flex items-center justify-center rounded-full shadow">
//           {index + 1}
//         </div>

//         {/* Icon */}
//         <div className={`mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full ${step.iconBg}`}>
//           {step.icon}
//         </div>

//         {/* Title */}
//         <h3 className="font-semibold text-lg text-gray-800 mb-2">
//           {step.title}
//         </h3>

//         {/* Description */}
//         <p className="text-sm text-gray-500 leading-relaxed">
//           {step.desc}
//         </p>

//       </div>
//     ))}

//   </div>
// </section>
//   )
// }

"use client"
import { motion } from "framer-motion";
import { ClipboardList, Search, Edit, MapPin, CheckSquare, BarChart3,BookOpen,Globe,Filter } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { title: "Select Your Exam", desc: "Choose your exam such as NEET UG, NEET PG, NEET MDS, NEET SS, DNB, or AIAPGET (Ayurveda) to start predicting your college.", icon: <ClipboardList className="text-yellow-600"/> },
    { title: "Enter Your Rank, Marks or Percentile", desc: "Provide your NEET rank, marks, or percentile to get accurate college predictions based on your performance.", icon: <Search className="text-emerald-600"/> },
    { title: "Choose Your Course", desc: "Select your preferred course like MBBS, BDS, BAMS, BHMS (NEET UG) or relevant PG courses depending on your exam.", icon: <BookOpen className="text-yellow-600"/> },
    { title: "Select Counselling Type (AIQ or State Quota)", desc: "Choose between All India Quota (AIQ) or State Counselling to see college options based on your eligibility.", icon: <Globe className="text-emerald-600"/> },
    { title: "Apply Category & Quota Filters (UG Only)", desc: "For NEET UG, refine results using category, reservation, and quota filters for more accurate predictions.", icon: <Filter className="text-yellow-600"/> },
    { title: "Get Your Eligible Colleges", desc: "View a list of government, private, and deemed medical colleges based on official closing rank cutoff data (2024 & 2025).", icon: <BarChart3 className="text-emerald-600"/> },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How Predictor 2026 Works</h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group relative bg-white/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(234,179,8,0.15)] transition-all duration-300"
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-yellow-500 font-bold border border-yellow-500">
              {i + 1}
            </div>
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}