"use client"

import SearchAndSelect from "@/components/common/SearchAndSelect"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import { IOption } from "@/types/GlobalTypes"
import { autoComplete, isEmpty } from "@/utils/utils"
import { ArrowRight, MapPin, Search, Users } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import Breadcrumbs from "@/components/common/Breadcrumbs";

const STATES: { name: string; slug: string; code: string; popular?: boolean }[] = [
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

const ALLOWED_PREDICTORS = ["NEET UG", "NEET PG", "NEET MDS", "AIAPGET (Ayurveda)", ""]

export default function ClosingRanks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<IOption>()
  const [selectedCourse, setSelectedCourse] = useState<IOption>()
  const [predictorTypeList, setPredictorTypeList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const courseType = searchParams.get("courseType")
  const course = searchParams.get("course")
  const router = useRouter()
  const { showToast } = useAppState()
  const { setValue, setError, clearErrors, control, formState: { errors } } = useForm()

  const updateURL = useCallback((params: Record<string, string>, replace = true) => {
    const query = new URLSearchParams(params).toString()
    const url = `/closing-ranks?${query}`
    if (replace) {
      router.replace(url, { scroll: false })
    } else {
      router.push(url)
    }
  }, [router])

  // Fetch predictor types
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/get-courses-types")
        const json = await res.json()
        if (Array.isArray(json?.data)) {
          setPredictorTypeList(json.data.map((q: any) => ({ id: q.id, text: q.type })))
        }
      } catch (err) {
        console.error("Error fetching course types:", err)
      }
    })()
  }, [])

  // Fetch courses by type (only when needed)
  const getCoursesByType = useCallback(async (type: string) => {
    setIsCourseLoading(true)
    try {
      const res = await fetch(`/api/get-courses?type=${encodeURIComponent(type)}`)
      const { data } = await res.json()
      setCoursesList(Array.isArray(data) ? data.map((c: any) => ({ id: c.id, text: c.text })) : [])
    } catch (err) {
      console.error("Error fetching courses:", err)
    } finally {
      setIsCourseLoading(false)
    }
  }, [])

  // Show states only when proper selections are made
  const canShowStates = useMemo(() => {
    if (!selectedType?.text) return false
    if (selectedType.text === "NEET UG" && !selectedCourse?.text) return false
    return true
  }, [selectedType, selectedCourse])

  // Filtered states
  const filteredStates = useMemo(() => {
    return STATES.filter(
      s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const buildRedirectURL = (state: { name: string; code: string }) => {
    if (!selectedType?.text) return ""
    const courseParam = selectedType.text === "NEET UG" ? selectedCourse?.text || "" : ""
    const stateParam = state.code === "all" ? "All India" : state.name
    return `/closing-ranks/${state.code}?state=${encodeURIComponent(stateParam)}&courseType=${encodeURIComponent(selectedType.text)}&course=${encodeURIComponent(courseParam)}`
  }

  const validateSelection = () => {
    if (!selectedType?.text) {
      setError("courseType", { type: "manual", message: "Please select Course Type" })
      showToast("error", "Please select Course Type")
      return false
    }
    if (selectedType.text === "NEET UG" && !selectedCourse?.text) {
      setError("course", { type: "manual", message: "Please select Course" })
      showToast("error", "Please select Course")
      return false
    }
    return true
  }

  return (
    <FELayout>
      <section className="w-full px-3 py-10 md:py-14 bg-gradient-to-br from-yellow-50 via-emerald-50 to-white">
        <div className="md:text-right">
                        <Breadcrumbs />
                      </div>
        <Container className="text-center">
          {selectedType?.text && (
            <div className="inline-block rounded-full bg-yellow-100 px-5 py-2 text-sm font-semibold text-yellow-800 border border-yellow-200 mb-6">
              {selectedType.text}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 md:mb-6 text-[#165dc4] leading-tight">
            Closing Ranks for<br className="hidden md:block" /> Medical, Dental & Ayurveda
          </h1>

          <p className="text-gray-700 md:text-lg max-w-4xl mx-auto leading-relaxed">
            Check college-wise NEET closing ranks, cut-offs and last round allotment details from All India & State counselling.
          </p>
        </Container>
      </section>

      <section className="w-full px-3 py-8 md:py-10">
        <Container>
          {/* Selection Area */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
              Find Your College Closing Ranks
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8">
              Select course type {selectedType?.text === "NEET UG" ? "and specific course " : ""}to see available states
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl">
              {/* Course Type */}
              <SearchAndSelect
                name="courseType"
                setValue={setValue}
                placeholder="Select Course Type"
                label="Course Type"
                value={selectedType}
                onChange={({ selectedValue }) => {
                  setSelectedType(selectedValue)
                  setSelectedCourse(undefined)
                  clearErrors("courseType")
                  clearErrors("course")
                  if (selectedValue?.text === "NEET UG") {
                    getCoursesByType(selectedValue.text)
                  }
                  updateURL({ courseType: selectedValue?.text || "", course: "" })
                }}
                control={control}
                defaultOption={{ id: courseType || "", text: courseType || "" }}
                options={predictorTypeList}
                searchAPI={(txt, set) => autoComplete(txt, predictorTypeList, set)}
                wrapperClass="w-full"
                errors={errors}
              />

              {/* Course – only for NEET UG */}
              {selectedType?.text === "NEET UG" && (
                <SearchAndSelect
                setValue={setValue}
                  name="course"
                  label="Course"
                  placeholder="Select Course (MBBS / BDS / BAMS...)"
                  value={selectedCourse}
                  onChange={({ selectedValue }) => {
                    setSelectedCourse(selectedValue)
                    clearErrors("course")
                    updateURL({
                      courseType: selectedType?.text || "",
                      course: selectedValue?.text || ""
                    })
                  }}
                  control={control}
                  defaultOption={{ id: course || "", text: course || "" }}
                  options={coursesList}
                  loading={isCourseLoading}
                  searchAPI={(txt, set) => autoComplete(txt, coursesList, set)}
                  wrapperClass="w-full"
                  errors={errors}
                />
              )}
            </div>
          </div>

          {/* Conditional States Section */}
          {canShowStates ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    States & Union Territories
                  </h2>
                  <p className="text-gray-600">
                    Choose a region to view {selectedType?.text} closing ranks
                    {selectedType?.text === "NEET UG" ? ` (${selectedCourse?.text})` : ""}
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-md mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search state or union territory..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filteredStates.map(state => (
                  <Link
                    key={state.slug}
                    href={buildRedirectURL(state)}
                    onClick={e => !validateSelection() && e.preventDefault()}
                    className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-yellow-400 transition-all duration-200 flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-yellow-700">
                          {state.name}
                        </h3>
                      </div>
                      {state.popular && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-5 flex-1">
                      View {selectedType?.text} closing ranks • {state.name === "All India" ? "All India Quota" : "State Counselling"}
                    </p>

                    <div className="flex items-center text-yellow-600 font-medium text-sm group-hover:text-yellow-700">
                      View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </Link>
                ))}
              </div>

              {!filteredStates.length && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-600 text-lg font-medium">
                    No states match <span className="font-semibold">{searchQuery}</span>
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Guidance when nothing selected */
            <div className="text-center py-16 px-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-dashed border-gray-300">
              <div className="max-w-lg mx-auto">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Ready to explore closing ranks?
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Start by selecting a <strong>Course Type</strong> above 
                  {selectedType?.text === "NEET UG" ? " and then choose a specific course" : ""}.
                </p>
                <p className="text-gray-500">
                  Popular options: NEET UG, NEET PG, NEET MDS, AIAPGET (Ayurveda)...
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 md:mt-20 border border-yellow-200 bg-yellow-50/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                Need help choosing the right college?
              </h3>
              <p className="text-gray-700">
                Get personalized guidance from expert counsellors.
              </p>
            </div>
            <Link
              href="https://wa.me/919028009835"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-7 py-4 rounded-xl shadow-lg flex items-center gap-3 font-semibold whitespace-nowrap transition"
            >
              <Users className="h-5 w-5" /> Book Free Counselling
            </Link>
          </div>
        </Container>
      </section>

      <SignInPopup />
    </FELayout>
  )
}