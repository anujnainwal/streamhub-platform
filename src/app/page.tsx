"use client";

import { movieList, watchAnyDeviceContent } from "@/constant/images/image_list";
import { useTypewriter } from "@/hooks/useTypewriter";
import Image from "next/image";
import Link from "next/link";
import { PiArrowArcRightThin, PiDotOutlineFill } from "react-icons/pi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useCallback } from "react";
import HomePage from "@/pages/home/Home";

const page = () => {
  const handleNavigation = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Add any pre-navigation logic here if needed
  }, []);
  const words = [
    "Movies",
    "Series",
    "Blockbusters",
    "Award Winners",
    "Classics",
    "Trending Now",
    "Watch Anytime",
    "On-Demand",
    "Unlimited Streaming",
    "All in One Place",
  ];
  const typedText = useTypewriter(words);

  const FaqQuestionAnswerList = [
    {
      id: 1,
      question: "What devices are supported?",
      answer:
        "You can stream on TV, Android phones, iPhones, iPads, tablets, and desktops with no additional fees.",
    },
    {
      id: 2,
      question: "How do I cancel my subscription?",
      answer:
        'You can cancel anytime by going to Account Settings > Subscription & Billing and clicking "Cancel Plan".',
    },
    {
      id: 3,
      question: "Can I download content to watch offline?",
      answer:
        'Yes! Tap the "Download" icon next to any movie or episode to watch offline on mobile devices.',
    },
    {
      id: 4,
      question: "Is there a free trial available?",
      answer:
        "We offer a 7-day free trial for new users. Your card won’t be charged until the trial ends.",
    },
    {
      id: 5,
      question: "What video quality options are available?",
      answer:
        "Stream in SD, HD, or Ultra HD (4K), depending on your plan and internet speed.",
    },
  ];

  return (
    <>
      <div className="dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Banner Section */}
        <div className="relative">
          <Image
            src={movieList.BannerImage}
            alt="Movie Banner"
            width={1920}
            height={400}
            className="w-full h-[28rem] object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#DBDBDA]/90 via-[#DBDBDA]/50 to-transparent" />
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center px-4 sm:px-10">
            <div className="z-10 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#2C3238] font-bold mb-4 leading-snug">
                The Greatest <span>{typedText}</span>
                <br />
                All In One Place
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#615f5f] font-semibold mb-5">
                Watch unlimited movies, TV shows, and much more
              </p>
              <div className="text-[#615f5f] mb-5">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1919]">
                  $9.99
                </span>{" "}
                / per month
              </div>
              {/* Subscribe Button */}
              <Link
                href="/choose-a-plan"
                className="inline-block bg-[#CE3824] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-[#b8301f] transition"
              >
                Subscribe Now
              </Link>
              {/* Free Trial Note */}
              <div className="relative mt-6 sm:mt-8">
                <PiArrowArcRightThin className="absolute left-16 sm:left-20 text-2xl sm:text-3xl md:text-4xl text-[#636262] rotate-[230deg]" />
                <span className="absolute left-28 sm:left-36 text-[#535252] text-sm sm:text-base">
                  Start your 7 day free trial
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Below */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HomePage />
        </div>

        {/* Watch Any Device */}
        <div className="mt-15 bg-[#DDDDDD] ">
          <div className="max-w-4xl mx-auto pt-30 text-center space-y-6 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center">
              <PiDotOutlineFill className="text-[#CE3824]" fontSize={30} />
              Watch Any Device
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Watch on your TV, computer, phone, tablet, or streaming device,
              all for one low monthly price
            </p>
            <Image
              src={watchAnyDeviceContent.DeviceImage}
              alt="Watch Any Device"
              width={1920}
            />
          </div>
        </div>

        {/* Faq Question */}
        <div className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center mb-10">
              <PiDotOutlineFill className="text-[#CE3824]" fontSize={30} />
              Frequently Asked Questions
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {FaqQuestionAnswerList.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border rounded-lg px-4 bg-[#F8F7FC]"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#CE3824] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Subscription Banner */}
        <motion.div
          className="bg-[#CE3824] py-12"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <motion.h2
              className="text-3xl md:text-4xl text-white font-bold mb-6 md:mb-0"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Get Unlimited Movies & TV Access
            </motion.h2>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                href="/choose-a-plan"
                className="inline-block bg-[#1F2937] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#374151] transition-colors"
              >
                Choose a Plan
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default page;
