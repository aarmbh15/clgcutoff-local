import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      institution: "AIIMS Delhi, Batch of 2023",
      rating: 5,
      testimonial:
        "College CutOff's college predictor was spot on! I got into my dream college thanks to their accurate predictions and counselling support. The detailed college information helped me make an informed decision.",
      gradient: "from-white to-yellow-50",
    },
    {
      name: "Rahul Verma",
      institution: "KGMU, Batch of 2022",
      rating: 5,
      testimonial:
        "The college comparison feature was incredibly helpful. I could easily see the pros and cons of different colleges and make the right choice. Their expert counsellors guided me throughout the admission process.",
      gradient: "from-white to-emerald-50",
    },
    {
      name: "Ananya Patel",
      institution: "GMC Nagpur, Batch of 2023",
      rating: 5,
      testimonial:
        "As a first-generation doctor in my family, I had no guidance. College CutOff became my mentor throughout the NEET counselling process. Their resources and predictions were invaluable for my success.",
      gradient: "from-white to-yellow-50",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
            STUDENT TESTIMONIALS
          </div>
          <h2 className="text-3xl font-bold">What Our Students Say</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Hear from students who achieved their medical college dreams with
            College CutOff
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border-0 shadow-lg bg-gradient-to-br ${testimonial.gradient} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.institution}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute -top-2 -left-2 text-4xl text-yellow-200 font-serif">
                    {`"`}
                  </div>
                  <p className="text-gray-600 italic relative z-10 pl-4">
                    {testimonial.testimonial}
                  </p>
                  <div className="absolute -bottom-4 -right-2 text-4xl text-yellow-200 font-serif">
                    {`"`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
