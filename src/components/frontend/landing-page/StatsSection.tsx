// import { Award, BookMarked, Building, Users } from "lucide-react"

// import { Container } from "../Container"

// export function StatsSection() {
//   return (
//     <section className="w-full py-16 md:py-24 relative">
//       <Container>
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold">Our Impact in Numbers</h2>
//           <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
//             Helping thousands of medical aspirants achieve their dreams
//           </p>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
//             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-color-accent/30 flex items-center justify-center">
//               <Award className="h-6 w-6 text-color-accent-dark" />
//             </div>
//             <h3 className="text-3xl font-bold text-color-accent">8+</h3>
//             <p className="text-sm text-gray-500 mt-1">Years of experience</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
//             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-color-accent/30 flex items-center justify-center">
//               <Users className="h-6 w-6 text-color-accent-dark" />
//             </div>
//             <h3 className="text-3xl font-bold text-color-accent">30k+</h3>
//             <p className="text-sm text-gray-500 mt-1">Students Registered</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
//             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-color-accent/30 flex items-center justify-center">
//               <Building className="h-6 w-6 text-color-accent-dark" />
//             </div>
//             <h3 className="text-3xl font-bold text-color-accent">500+</h3>
//             <p className="text-sm text-gray-500 mt-1">Colleges Covered</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
//             <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-color-accent/30 flex items-center justify-center">
//               <BookMarked className="h-6 w-6 text-color-accent-dark" />
//             </div>
//             <h3 className="text-3xl font-bold text-color-accent">25k+</h3>
//             <p className="text-sm text-gray-500 mt-1">Queries Answered</p>
//           </div>
//         </div>
//       </Container>
//     </section>
//   )
// }

// import { Award, BookMarked, Building, Users } from "lucide-react"
// import { Container } from "../Container"

// export function StatsSection() {
//   return (
//     <section className="w-full py-16 md:py-24 relative overflow-hidden">

//       {/* 🔥 Soft Background Glow */}
//       <div className="absolute inset-0 
//         bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.12),transparent_40%),
//             radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.10),transparent_40%)]
//       " />

//       <Container>
//         <div className="relative">

//           {/* Heading */}
//           <div className="text-center mb-14">
//             <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
//               Our Impact in Numbers
//             </h2>
//             <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm md:text-base">
//               Helping thousands of medical aspirants achieve their dreams
//             </p>
//           </div>

//           {/* Cards */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

//             {/* CARD */}
//             {[{
//               icon: <Award className="h-6 w-6 text-color-accent-dark" />,
//               value: "8+",
//               label: "Years of experience"
//             },{
//               icon: <Users className="h-6 w-6 text-color-accent-dark" />,
//               value: "30k+",
//               label: "Students Registered"
//             },{
//               icon: <Building className="h-6 w-6 text-color-accent-dark" />,
//               value: "500+",
//               label: "Colleges Covered"
//             },{
//               icon: <BookMarked className="h-6 w-6 text-color-accent-dark" />,
//               value: "25k+",
//               label: "Queries Answered"
//             }].map((item, i) => (

//               <div
//                 key={i}
//                 className="group bg-white/90 backdrop-blur-sm 
//                 p-6 rounded-2xl border border-gray-100
//                 shadow-[0_10px_30px_rgba(0,0,0,0.06)]
//                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
//                 transition-all duration-300 
//                 hover:-translate-y-1 hover:scale-[1.02]"
//               >

//                 {/* Icon */}
//                 <div className="w-14 h-14 mx-auto mb-4 rounded-full 
//                 bg-color-accent/20 
//                 flex items-center justify-center
//                 shadow-inner ring-1 ring-color-accent/30
//                 group-hover:scale-110 transition">
//                   {item.icon}
//                 </div>

//                 {/* Number */}
//                 <h3 className="text-3xl md:text-[32px] font-bold 
//                 text-color-accent tracking-tight">
//                   {item.value}
//                 </h3>

//                 {/* Label */}
//                 <p className="text-sm text-gray-600 mt-1 leading-relaxed">
//                   {item.label}
//                 </p>

//               </div>
//             ))}

//           </div>
//         </div>
//       </Container>
//     </section>
//   )
// }

import { Award, Users, Building, BookMarked } from "lucide-react"
import { Container } from "../Container"

export function StatsSection() {
  const stats = [
    { icon: <Award className="h-6 w-6" />, value: "8+", label: "Years of Expertise" },
    { icon: <Users className="h-6 w-6" />, value: "30k+", label: "Students Registered" },
    { icon: <Building className="h-6 w-6" />, value: "500+", label: "Colleges Covered" },
    { icon: <BookMarked className="h-6 w-6" />, value: "25k+", label: "Queries Answered" },
  ];

  return (
    <section className="w-full py-20 relative overflow-hidden ">
      {/* Refined Background: Soft Yellow Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.08),transparent_70%)]" />

      <Container>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Our Impact in Numbers
            </h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* The "Professional Bar" Layout */}
          <div className="bg-white border border-yellow-100 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(234,179,8,0.1)] grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-yellow-100">
            {stats.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4 group">
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-4xl font-bold text-gray-900 tabular-nums leading-none">
                  {item.value}
                </span>
                <span className="text-sm font-medium text-gray-500 mt-3 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}