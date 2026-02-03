export default function WhyChooseUs() {
  const benefits = [
    {
      icon: "Lightbulb",
      title: "Focused on Private and Deemed Medical Colleges",
      description:
        "We specialize in providing accurate information exclusively for private and deemed medical colleges across India, helping you make informed decisions for both MBBS and MD/MS admissions.",
      color: "from-yellow-500/20 to-yellow-100/20",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: "Users",
      title: "Comprehensive Cutoff Data for MBBS and MD/MS",
      description:
        "Access last year's detailed cutoff information — college-wise and category-wise — for MBBS and across all MD/MS specializations. This gives you complete clarity to plan your medical admission journey with confidence.",
      color: "from-emerald-500/20 to-emerald-100/20",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: "Award",
      title: "Authentic Information Sourced from Official Authorities",
      description:
        "All our data is directly sourced from official counseling authority websites, ensuring it's genuine, verified, and completely up-to-date — no manipulation, no guesswork.",
      color: "from-yellow-500/20 to-yellow-100/20",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: "Users",
      title: "Personalized Counseling for Management and NRI Quota",
      description:
        "Private medical education is a significant investment, and a single mistake can cost a valuable seat. We offer paid personalized counseling (via phone, WhatsApp, and in-person) specifically for Management and NRI quota admissions — expert guidance that goes beyond what the portal alone can offer.",
      color: "from-emerald-500/20 to-emerald-100/20",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: "Award",
      title: "Simple, Transparent Process",
      description:
        "Our platform is clean and easy to use — check cutoff details instantly and reach out when you need one-on-one support. No confusing dashboards. No hidden steps.",
      color: "from-yellow-500/20 to-yellow-100/20",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: "Users",
      title: "Trusted by Medical Aspirants",
      description:
        "Every year, hundreds of MBBS and MD/MS aspirants rely on CollegeCutoff.net for accurate information and genuine support throughout their admission process.",
      color: "from-emerald-500/20 to-emerald-100/20",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ]

  // Function to render the appropriate icon
  const renderIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case "Lightbulb":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${colorClass} h-6 w-6`}
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        )
      case "Users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${colorClass} h-6 w-6`}
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      case "Award":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${colorClass} h-6 w-6`}
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <section className="w-full py-16 md:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.05)_0%,rgba(255,255,255,0)_50%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.05)_0%,rgba(255,255,255,0)_50%)] -z-10"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-yellow-200 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-emerald-200 opacity-10 blur-3xl -z-10"></div>

      <div className="mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4 ">
            WHAT SETS US APART
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Us</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-emerald-500 mx-auto mt-2"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative">
                <div
                  className={`absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br ${benefit.color} -z-10 transform -rotate-1 scale-[1.02] opacity-70`}
                ></div>
                <div className="flex gap-3 md:gap-5 p-4 md:p-6 rounded-xl">
                  <div
                    className={`${benefit.iconBg} h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm`}
                  >
                    {renderIcon(benefit.icon, benefit.iconColor)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 md:mt-20 text-center">
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-yellow-500 to-emerald-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Our College Predictor Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <p className="text-gray-500 mt-4">
              Join 30,000+ students who found their perfect medical college
              match
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

