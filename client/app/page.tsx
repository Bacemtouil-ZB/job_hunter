"use client";
import Header from "@/components/header";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building,
  CheckCircle,
  Search,
  Users,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Footer from "@/components/footer";

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Diverse Opportunities",
      description:
        "Access thousands of job listings across various industries and experience levels.",
      benefits: [
        "100,000+ active job listings",
        "50+ job categories",
        "Remote and on-site options",
      ],
      cta: "Explore Jobs",
      ctaLink: "/findwork",
      gradient: "from-indigo-500 to-purple-600",
    },
    
    {
      icon: <Users className="w-6 h-6" />,
      title: "Talent Pool",
      description:
        "Employers can access a diverse pool of qualified candidates for their open positions.",
      benefits: [
        "1M+ registered job seekers",
        "Advanced search filters",
        "AI-powered matching",
      ],
      cta: "Post a Job",
      ctaLink: "/post",
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  const stats = [
    { icon: <Briefcase size={24} />, value: "100K+", label: "Active Jobs" },
    { icon: <Building size={24} />, value: "10K+", label: "Companies" },
    { icon: <Users size={24} />, value: "1M+", label: "Job Seekers" },
    { icon: <Target size={24} />, value: "95%", label: "Success Rate" },
  ];

  return (
    <main className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 border border-indigo-100">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">
                #1 Job Platform of 2024
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dream Job
              </span>
              <br />
              or Perfect Candidate
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Connect with thousands of employers and talented professionals on
              the most innovative job platform
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-2xl border border-gray-100">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Job title, keyword, or company"
                    className="pl-12 pr-4 py-6 border-0 focus-visible:ring-0 text-base bg-transparent"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Popular:</span>
              {["Remote", "Full-time", "Design", "Engineering", "Marketing"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-600 transition-all duration-200 hover:shadow-md"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-sm border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Job Hunter
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find your next opportunity or hire the
              perfect talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 rounded-2xl"
              >
                {/* Gradient border on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}></div>
                <div className="absolute inset-[2px] bg-white rounded-2xl -z-5"></div>

                <CardHeader className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="relative">
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-lg transition-all duration-200 group/btn`}
                  >
                    <Link href={feature.ctaLink} className="flex items-center justify-center">
                      {feature.cta}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
              <Zap size={20} className="text-indigo-600" />
              <span className="font-semibold text-gray-700">
                Trusted by 10,000+ companies worldwide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <TrendingUp size={18} className="text-white" />
            <span className="text-sm font-semibold text-white">
              Join thousands of success stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Take the first step towards your next career opportunity or find
            your ideal candidate today
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <Link href="/findwork" className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Work
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              <Link href="/post" className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Post a Job
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}