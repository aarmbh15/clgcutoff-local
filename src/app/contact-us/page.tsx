"use client"

import { Button } from "@/components/common/Button"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { CheckCircle, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { useState } from "react"

export default function ContactUsContent() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  })
  const [phoneError, setPhoneError] = useState("")

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (name === "phone") {
      // Allow only numbers and an optional + at the start
      const cleanedValue = value.replace(/[^0-9+]/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }))
      // Validate phone number length
      if (cleanedValue.startsWith("+")) {
        if (cleanedValue.length < 13) {
          setPhoneError("Phone number must be at least 10 digits")
        } else if (cleanedValue.length > 16) {
          setPhoneError("Phone number cannot exceed 15 digits")
        } else {
          setPhoneError("")
        }
      } else {
        if (cleanedValue.length < 10 && cleanedValue.length > 0) {
          setPhoneError("Phone number must be at least 10 digits")
        } else {
          setPhoneError("")
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Additional validation before submission
    if (formData.phone.replace(/\+/g, "").length < 10) {
      setPhoneError("Phone number must be at least 10 digits")
      return
    }

    // Construct mailto URL
    const emailBody = `Name: ${formData.name}\n\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    const mailtoUrl = `mailto:collegecutoff@gmail.com?subject=${encodeURIComponent(formData.phone)}&body=${encodeURIComponent(emailBody)}`

    // Open Gmail app or default email client
    window.location.href = mailtoUrl

    // Reset form
    setFormData({
      name: "",
      phone: "",
      message: "",
    })
    setPhoneError("")
  }

  return (
    <FELayout>
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-20 blur-3xl -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 blur-3xl -z-10"></div>

        <Container>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
              GET IN TOUCH
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-color-table-header">
              Contact Us
            </h1>
            <p className="text-gray-600 md:text-lg mb-8 max-w-2xl">
              {`Have questions about NEET counselling or need guidance for your
              medical career? We're here to help you every step of the way.`}
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Information & Urgent Help Section */}
      <section className="w-full py-12 md:py-16 px-3 bg-gray-50 dark:bg-color-form-background">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-8">
              {/* Contact Information */}
              <div className="relative pt-10 md:pt-0">
                <h2 className="text-2xl font-bold mb-6 absolute md:relative top-0 left-0">
                  Contact Information
                </h2>
                <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-gray-100 mt-4 md:mt-1">
                  <div className="space-y-6 md:space-y-8 py-3">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                        <Mail className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-gray-900">
                          Email Us
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                          For counselling:
                        </p>
                        <a
                          href="mailto:collegecutoff.net@gmail.com"
                          className="text-yellow-600 hover:underline font-medium text-sm md:text-base"
                        >
                          collegecutoff.net@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-base md:text-lg text-gray-900">
                          Call Us
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                          Counselling Helpline:
                        </p>
                        <a
                          href="tel:+919028009835"
                          className="text-yellow-600 hover:underline font-medium text-sm md:text-base"
                        >
                          +91 9028009835
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="bg-color-table-header text-white border-0 p-4">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      Send Us a Message
                    </CardTitle>
                    <p className="text-orange-100">
                      {`Fill out the form below and we'll get back to you as soon as possible.`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-white font-medium"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-white font-medium"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your Phone Number"
                          required
                          pattern="\+?[0-9]{10,15}"
                          title="Please enter a valid phone number"
                          className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500"
                        />
                        {phoneError && (
                          <p className="text-red-500 text-sm font-medium">
                            {phoneError}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        <Label
                          htmlFor="message"
                          className="text-white font-medium"
                        >
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Enter your message"
                          required
                          rows={4}
                          className="bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-color-accent text-white hover:bg-color-accent-dark hover:border-white border border-transparent font-semibold py-2 px-4 rounded-lg transition-colors translate-y-3 h-[50px]"
                      >
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="w-full py-12 md:py-16 bg-color-background px-3">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About CollegeCutoff
              </h2>
              <p className="text-gray-600 mb-4">
                {`CollegeCutoff is India's leading platform dedicated to helping
                NEET aspirants make informed decisions about their medical
                education journey. Founded in 2019, we have guided over 30,000
                students to secure admissions in their dream medical colleges.`}
              </p>
              <p className="text-gray-600 mb-4">
                Our team consists of experienced counsellors, medical
                professionals, and education experts who understand the
                complexities of NEET counselling and admission processes across
                India.
              </p>
              <p className="text-gray-600 mb-6">
                We pride ourselves on providing accurate, up-to-date information
                and personalized guidance to help students navigate the
                challenging path to becoming medical professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">8+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">30,000+ Students Guided</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">500+ Medical Colleges</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-yellow-100 to-emerald-100 rounded-3xl transform rotate-3 scale-105 opacity-70"></div>
              <div className="bg-color-form-background p-6 md:p-8 rounded-2xl">
                <img
                  src="/medical-education-counselling-team.png"
                  alt="CollegeCutoff Team"
                  className="w-full h-auto rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To simplify medical education choices and empower NEET
                  aspirants with accurate information and personalized guidance
                  to achieve their career goals.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </FELayout>
  )
}

// re-design /about page Contact Information create a form ask "Name" subject and Message "" on submit click mailto:collegecutoff@gmail.com" with subject and msg and redirect them to gmail app in phone.

// Custom Card components using divs
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
)

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
)

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
  >
    {children}
  </div>
)

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

const Label = ({
  children,
  htmlFor,
  className = "",
}: {
  children: React.ReactNode
  htmlFor?: string
  className?: string
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
)

const Input = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  pattern, // Add pattern prop
  title, // Add title prop
  className = "",
}: {
  id?: string
  name?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  pattern?: string
  title?: string
  required?: boolean
  className?: string
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    pattern={pattern}
    title={title}
    required={required}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
)

const Textarea = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = "",
}: {
  id?: string
  name?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
  className?: string
}) => (
  <textarea
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    rows={rows}
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
)

