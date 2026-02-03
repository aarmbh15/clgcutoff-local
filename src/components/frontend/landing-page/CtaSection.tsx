"use client"

import { Button } from "@/components/common/Button"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
} from "lucide-react"
import { useState } from "react"

export default function CtaSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-emerald-50 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.1)_0%,rgba(255,255,255,0)_60%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.1)_0%,rgba(255,255,255,0)_60%)] -z-10"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-yellow-200 opacity-20 blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-200 opacity-20 blur-3xl -z-10"></div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-4 border-dashed border-yellow-200 opacity-30 -z-10"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full border-4 border-dashed border-emerald-200 opacity-30 -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-yellow-300 opacity-30 -z-10"></div>
      <div className="absolute bottom-1/3 left-1/3 w-6 h-6 rounded-full bg-emerald-300 opacity-30 -z-10"></div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid md:grid-cols-5 relative">
              {/* Left Content - 3 columns on md+ */}
              <div className="md:col-span-3 p-6 sm:p-8 md:p-12 lg:p-16 relative z-10">
                <div className="inline-block rounded-full bg-yellow-100 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4 sm:mb-6">
                  LIMITED TIME OFFER
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                  Start Your Medical College Journey With Confidence
                </h2>
                <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                  {`Join thousands of successful medical students who found their
                  perfect college match with College CutOff's premium tools and
                  expert guidance.`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Personalized Predictions
                      </h4>
                      <p className="text-sm text-gray-500">
                        Based on your rank and preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Expert Counselling
                      </h4>
                      <p className="text-sm text-gray-500">
                        One-on-one guidance sessions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        College Comparisons
                      </h4>
                      <p className="text-sm text-gray-500">
                        Detailed insights on 500+ colleges
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Career Roadmap
                      </h4>
                      <p className="text-sm text-gray-500">
                        Plan your medical career path
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
                  <motion.div
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="relative w-full sm:w-auto"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Button className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-6 h-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium shadow-lg rounded-xl">
                      Get Started Now
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    {hovered && (
                      <motion.div
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.div>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-8 py-3 sm:py-6 h-auto border-yellow-500 text-yellow-600 hover:bg-yellow-50 rounded-xl"
                  >
                    Learn More
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>30,000+ Students</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>95% Success Rate</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Content - 2 columns on md+ */}
              <div className="md:col-span-2 bg-gradient-to-br from-yellow-400 to-emerald-500 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/20">
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
                      Premium Plan
                    </h3>
                    <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
                      <span className="text-white text-2xl sm:text-3xl font-bold">
                        ₹1,999
                      </span>
                      <span className="text-white/70 text-sm sm:text-base line-through">
                        ₹3,999
                      </span>
                      <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                        50% OFF
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Full college database access",
                        "Personalized counselling",
                        "Mock counselling sessions",
                        "Career planning tools",
                      ].map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-white/90 text-xs sm:text-sm"
                        >
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2 text-white text-xs sm:text-sm border border-white/20">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline-block mr-1" />
                      <span>Offer ends in 2 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            className="mt-8 sm:mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-gray-600 italic text-sm sm:text-base max-w-2xl mx-auto px-4">
              {`"College CutOff helped me secure admission to my dream medical
              college. Their predictions were spot on, and the counselling
              support was invaluable throughout my journey."`}
            </p>
            <div className="mt-3 sm:mt-4 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2 sm:mr-3">
                <span className="font-medium text-gray-600 text-xs sm:text-sm">
                  AV
                </span>
              </div>
              <div className="text-left">
                <p className="font-medium text-sm sm:text-base">
                  Aakaanksha Vashisht
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  AIIMS Delhi, Batch of 2023
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
