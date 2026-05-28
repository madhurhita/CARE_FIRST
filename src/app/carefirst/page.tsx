"use client";

import { useState, useRef } from "react";
import { submitCareFirstForm } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Loader2,
  CheckCircle2,
  Stethoscope,
  Activity,
  Shield,
  Clock,
  Mail,
  Sparkles,
  Brain,
  Bone,
  SmilePlus,
  ArrowRight,
  Phone,
  MapPin,
  Users,
  Star,
  CalendarCheck,
  FileText,
  Send,
} from "lucide-react";

const floatingIcons = [
  { Icon: HeartPulse, x: "10%", y: "15%", delay: 0, size: 28 },
  { Icon: Stethoscope, x: "85%", y: "20%", delay: 0.5, size: 24 },
  { Icon: Activity, x: "75%", y: "60%", delay: 1, size: 22 },
  { Icon: Shield, x: "15%", y: "70%", delay: 1.5, size: 26 },
  { Icon: Brain, x: "90%", y: "80%", delay: 2, size: 20 },
  { Icon: Bone, x: "5%", y: "45%", delay: 0.8, size: 22 },
  { Icon: SmilePlus, x: "50%", y: "10%", delay: 1.2, size: 24 },
];

const concernIcons: Record<string, typeof HeartPulse> = {
  "General Checkup": Stethoscope,
  Dental: SmilePlus,
  Ortho: Bone,
  "Mental Health": Brain,
};

const steps = [
  {
    icon: FileText,
    title: "Fill Your Details",
    desc: "Complete the quick intake form with your information and medical concern.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Personalized Pre-visit Email",
    desc: "Our system instantly generates a personalized confirmation with pre-visit instructions.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Send,
    title: "Confirmation Sent",
    desc: "The email is dispatched to your inbox via our automated n8n workflow.",
    color: "from-cyan-500 to-blue-500",
  },
];

const stats = [
  { value: "12,400+", label: "Patients Served", icon: Users },
  { value: "98.7%", label: "Satisfaction Rate", icon: Star },
  { value: "< 2min", label: "Booking Time", icon: Clock },
  { value: "4", label: "Specializations", icon: CalendarCheck },
];

export default function CareFirstPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [selectedConcern, setSelectedConcern] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedConcern) {
      setResult({ success: false, error: "Please select your primary concern." });
      return;
    }
    setIsSubmitting(true);
    setResult(null);
    const formData = new FormData(e.currentTarget);
    const response = await submitCareFirstForm(null, formData);
    setResult(response);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setResult(null);
    setSelectedConcern("");
    formRef.current?.reset();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      {/* Floating Background Icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingIcons.map(({ Icon, x, y, delay, size }, i) => (
          <motion.div
            key={i}
            className="absolute text-emerald-200/40"
            style={{ left: x, top: y }}
            animate={{
              y: [0, -20, 0, 20, 0],
              rotate: [0, 5, -5, 5, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-emerald-100/50 bg-white/70 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-emerald-900 tracking-tight">
              CareFirst <span className="text-emerald-600">Health</span>
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-6 text-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button onClick={() => scrollToSection("how-it-works")} className="hidden md:block text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              How It Works
            </button>
            <button onClick={() => scrollToSection("book")} className="hidden md:block text-slate-600 hover:text-emerald-700 transition-colors font-medium">
              Book Now
            </button>
            <div className="flex items-center gap-2 text-emerald-700">
              <Phone className="h-4 w-4" />
              <span className="font-medium">(415) 555-0192</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-sm font-semibold border border-emerald-200/50 backdrop-blur-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Sparkles className="h-4 w-4" />
              Streamlined Patient Intake
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Your Health Journey{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Book your appointment in under 2 minutes. Our system instantly prepares
              personalized pre-visit instructions tailored to your specific needs.
            </p>

            <motion.div
              className="flex flex-wrap justify-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button onClick={() => scrollToSection("book")} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-12 px-8 rounded-full font-semibold text-base shadow-lg shadow-emerald-200/50 transition-all hover:shadow-xl hover:shadow-emerald-200/60 hover:-translate-y-0.5">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={() => scrollToSection("how-it-works")} variant="outline" className="h-12 px-8 rounded-full font-semibold text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                Learn How It Works
              </Button>
            </motion.div>
            
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-12 border-y border-emerald-100/50 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <stat.icon className="h-6 w-6 text-emerald-500 mx-auto" />
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              How It Works
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              Three simple steps to a fully personalized appointment experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-xs font-bold text-emerald-500 mb-2 tracking-widest uppercase">
                      Step {i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="book" className="relative z-10 py-20 md:py-28 bg-gradient-to-b from-transparent via-emerald-50/30 to-white/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left Info Panel */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=800&q=80" alt="Doctor Consultation" className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-md mb-8" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                  Book Your{" "}
                  <span className="text-emerald-600">Appointment</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Fill out the form and receive an customized confirmation email
                  with pre-visit instructions specific to your medical concern.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Stethoscope, label: "General Checkup", desc: "Comprehensive wellness exams" },
                  { icon: SmilePlus, label: "Dental Care", desc: "Cosmetic & general dentistry" },
                  { icon: Bone, label: "Orthopedics", desc: "Joint & musculoskeletal care" },
                  { icon: Brain, label: "Mental Health", desc: "Therapy & behavioral wellness" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/80 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{item.label}</div>
                      <div className="text-slate-500 text-sm">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                  <MapPin className="h-4 w-4" />
                  Visit Us
                </div>
                <p className="text-sm text-slate-600">
                  1200 Wellness Boulevard, Suite 300<br />
                  San Francisco, CA 94102
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Mon-Fri: 8AM - 6PM | Sat: 9AM - 2PM
                </div>
              </div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-2xl shadow-emerald-100/40 border-0 ring-1 ring-slate-200/60 bg-white/90 backdrop-blur-xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white pb-8 pt-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <CardTitle className="text-2xl font-bold text-white">Patient Intake Form</CardTitle>
                    <CardDescription className="text-emerald-100 mt-1">
                      All fields are required to confirm your appointment.
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {result?.success ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                          <motion.div
                            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                          >
                            <CheckCircle2 className="h-10 w-10 text-white" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-emerald-900">
                            Appointment Confirmed!
                          </h3>
                          <p className="text-emerald-700 leading-relaxed">
                            {result.message}
                          </p>
                        </div>

                        <Button
                          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold"
                          onClick={resetForm}
                        >
                          Book Another Appointment
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="carefirst-name" className="text-slate-700 font-semibold text-sm">
                            Full Name
                          </Label>
                          <Input
                            id="carefirst-name"
                            name="name"
                            placeholder="e.g. Jane Doe"
                            required
                            disabled={isSubmitting}
                            className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="carefirst-email" className="text-slate-700 font-semibold text-sm">
                              Email Address
                            </Label>
                            <Input
                              id="carefirst-email"
                              name="email"
                              type="email"
                              placeholder="jane@example.com"
                              required
                              disabled={isSubmitting}
                              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="carefirst-age" className="text-slate-700 font-semibold text-sm">
                              Age
                            </Label>
                            <Input
                              id="carefirst-age"
                              name="age"
                              type="number"
                              min={1}
                              max={120}
                              placeholder="32"
                              required
                              disabled={isSubmitting}
                              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="carefirst-concern" className="text-slate-700 font-semibold text-sm">
                            Primary Concern
                          </Label>
                          <input type="hidden" name="concern" value={selectedConcern} />
                          <Select
                            value={selectedConcern}
                            onValueChange={setSelectedConcern}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="carefirst-concern" className="h-11 w-full bg-slate-50/50 border-slate-200 rounded-xl">
                              <SelectValue placeholder="Select your concern" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="General Checkup">
                                <Stethoscope className="h-4 w-4 inline mr-2 text-emerald-500" />
                                General Checkup
                              </SelectItem>
                              <SelectItem value="Dental">
                                <SmilePlus className="h-4 w-4 inline mr-2 text-blue-500" />
                                Dental
                              </SelectItem>
                              <SelectItem value="Ortho">
                                <Bone className="h-4 w-4 inline mr-2 text-orange-500" />
                                Orthopedics
                              </SelectItem>
                              <SelectItem value="Mental Health">
                                <Brain className="h-4 w-4 inline mr-2 text-purple-500" />
                                Mental Health
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="carefirst-slot" className="text-slate-700 font-semibold text-sm">
                            Preferred Appointment Slot
                          </Label>
                          <Input
                            id="carefirst-slot"
                            name="preferredSlot"
                            type="datetime-local"
                            required
                            disabled={isSubmitting}
                            className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                          />
                        </div>

                        <AnimatePresence>
                          {result?.error && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-600 text-sm font-medium bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              {result.error}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-emerald-200/50 transition-all hover:shadow-xl disabled:opacity-60"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Sending Booking Request...
                            </>
                          ) : (
                            <>
                              Book Appointment
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-center text-slate-400 pt-1">
                          Your data is encrypted and protected under HIPAA guidelines.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 flex items-center justify-center text-center">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=80" alt="Medical Team" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/95 mix-blend-multiply" />
            <div className="relative z-10 p-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready for world-class care?</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">Join thousands of patients who trust CareFirst Health for their wellness journey.</p>
              <Button onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })} className="bg-white text-emerald-900 hover:bg-emerald-50 h-12 px-8 rounded-full font-semibold shadow-lg">
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <HeartPulse className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-white">CareFirst Health</span>
              </div>
              <p className="text-sm leading-relaxed">
                Delivering compassionate, digital healthcare experiences since 2020.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  (415) 555-0192
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  madhurhita.ganguly@codeclouds.in
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  San Francisco, CA 94102
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>General Checkups</li>
                <li>Dental Care</li>
                <li>Orthopedics</li>
                <li>Mental Health</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
            &copy; 2026 CareFirst Health. All rights reserved. Demo application.
          </div>
        </div>
      </footer>
    </div>
  );
}


