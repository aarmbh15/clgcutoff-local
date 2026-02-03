"use client"

export default function TrustedBy() {
  return (
    <section className="w-full mt-20 relative overflow-hidden">
      {/* Background Elements */}

      <div className="container px-4 md:px-6 mx-auto py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">
            TRUSTED BY LEADING MEDICAL INSTITUTIONS
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our college predictor is trusted by students who are now studying at
            these prestigious institutions
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500"></div>
            <span className="font-medium">AIIMS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500"></div>
            <span className="font-medium">JIPMER</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500"></div>
            <span className="font-medium">CMC Vellore</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
            <span className="font-medium">KGMU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-sky-500"></div>
            <span className="font-medium">MAMC</span>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 italic">
            {`"College CutOff has been instrumental in helping our students make
            informed decisions about their medical education journey."`}
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">
            — Dr. Rajesh Kumar, Medical Education Advisor
          </p>
        </div>
      </div>
    </section>
  )
}
