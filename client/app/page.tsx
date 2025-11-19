"use client";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { useGlobalContext } from "@/context/globalContext";
import {
  Briefcase,
  Building,
  CheckCircleIcon,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-[#7263f3]" />,
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
    },
    {
      icon: <Building className="w-6 h-6 text-[#7263f3]" />,
      title: "Top Companies",
      description:
        "Connect with leading companies, from innovative startups to Fortune 500 corporations.",
      benefits: [
        "500+ verified employers",
        "Exclusive partnerships",
        "Direct application process",
      ],
      cta: "View Companies",
      ctaLink: "/findwork",
    },
    {
      icon: <Users className="w-6 h-6 text-[#7263f3]" />,
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
    },
  ];

  return (
    <main>
      <Header />

      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#7263f3] md:text-5xl font-bold mb-6">
            Find Your Dream Job or Perfect Candidate
          </h1>
          <p className="text-xl mb-8">
            Connect with thousands of employers and job seekers on our platform
          </p>
          <div className="max-w-2xl mx-auto flex gap-4">
            <input
              type="text"
              placeholder="Job title or keyword"
              className="flex-grow bg-white text-black p-2 rounded"
            />
            <button className="bg-[#7263f3] text-white px-4 rounded">
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose{" "}
            <span className="text-[#7263f3] font-extrabold">JobFindr</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col h-full rounded-xl border p-4 bg-white shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl mb-2">{feature.title}</h3>
                <p className="mb-4">{feature.description}</p>
                <ul className="space-y-2 mb-4">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={feature.ctaLink}
                  className="text-white bg-[#7263f3] px-4 py-2 rounded text-center"
                >
                  {feature.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[7rem] bg-[#d7dedc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Get Started?</h2>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href={"/findwork"}
              className="bg-[#7263f3] text-white px-6 py-3 rounded"
            >
              Find Work
            </Link>
            <Link
              href={"/post"}
              className="border border-[#7263f3] text-[#7263f3] px-6 py-3 rounded"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
