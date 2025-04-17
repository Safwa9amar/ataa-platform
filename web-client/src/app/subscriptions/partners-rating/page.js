"use client";
import TestimonialCard from "@/components/UI/TestimonialCard";
import { useCredentials } from "@/context/CredentialsContext";
import {
  createTestimonial,
  getAllTestimonials,
} from "@/services/testimonialServices";
import { Rating, Spinner } from "@material-tailwind/react";
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import validator from "validator";

const MAX_COMMENT_LENGTH = 200;

export default function TestimonialsPage() {
  const { user, isLoggedIn, userToken ,checkAuthentication} = useCredentials();
  const [state, setState] = useState({
    comment: "",
    grade: "",
    rating: 0,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const testimonials = await getAllTestimonials();
      if (testimonials) {
        setData(testimonials.filter((testimonial) => testimonial.user.role === "charity"));
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      Swal.fire({
        title: "خطأ في جلب البيانات",
        text: "حدث خطأ أثناء محاولة جلب آراء العملاء. يرجى المحاولة مرة أخرى لاحقًا.",
        icon: "error"
      });
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTestimonials();
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchTestimonials]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setState(prev => ({ ...prev, [id]: value }));
  };

  const handleRatingChange = (value) => {
    setState(prev => ({ ...prev, rating: value }));
  };

  const resetForm = () => {
    setState({
      comment: "",
      grade: "",
      rating: 0,
    });
  };

  const submitTestimonial = async () => {
    await checkAuthentication(userToken)
    if (!isLoggedIn) {
      Swal.fire({ 
        text: "يجب عليك تسجيل الدخول إلى حسابك أولاً", 
        icon: "info" 
      });
      return;
    }

    if (user.testimonial) {
      Swal.fire("لقد قدمت طلبك بالفعل", "نشكرك على مشاركتك رأيك معنا", "success");
      return;
    }

    if (
      validator.isEmpty(state.grade) ||
      validator.isEmpty(state.comment) ||
      state.rating === 0
    ) {
      Swal.fire("جميع الحقول مطلوبة", "يرجى ملء جميع الحقول وإعطاء تقييمك", "warning");
      return;
    }

    setSubmitting(true);
    try {
      await createTestimonial(state, userToken);
      Swal.fire({
        title: "تم إرسال الشهادة بنجاح!",
        text: "شكراً لمشاركتك رأيك معنا.",
        icon: "success"
      });
      resetForm();
      await fetchTestimonials();
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      Swal.fire({
        title: "خطأ في الإرسال",
        text: "حدث خطأ أثناء محاولة إرسال شهادتك. يرجى المحاولة مرة أخرى.",
        icon: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const remainingChars = MAX_COMMENT_LENGTH - state.comment.length;

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Hero Section */}
      <section className="bg-teal-600 text-white text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-3">ماذا يقول عملاؤنا</h1>
        <p className="text-lg max-w-2xl mx-auto">آراء حقيقية من عملائنا الراضين عن خدماتنا</p>
      </section>

      {/* Testimonials Grid */}
      <main className="flex-grow">
        {loading ? (
          <div className="w-full h-60 flex justify-center items-center">
            <Spinner color="teal" className="w-16 h-16" />
          </div>
        ) : data.length > 0 ? (
          <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                comment={testimonial.comment}
                grade={testimonial.grade}
                name={testimonial?.user?.name}
                rating={testimonial.rating}
                photo={testimonial?.user?.photo}
              />
            ))}
          </section>
        ) : (
          <div className="w-full h-[50vh] flex flex-col justify-center items-center text-center px-4">
            <p className="text-2xl mb-4">لا توجد أي تعليقات حالياً</p>
            <p className="text-lg text-gray-600">نحن سعداء بمشاركتك رأيك وتجربتك معنا</p>
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">هل تريد مشاركة تجربتك؟</h2>
          <p className="mb-6 text-lg">نسعد بسماع رأيك وتقييمك لخدماتنا</p>
          
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
            <div dir="rtl" className="space-y-4 text-gray-800">
              <div>
                <label htmlFor="grade" className="block text-right mb-1 font-medium">
                  الرتبة/المنصب
                </label>
                <input
                  type="text"
                  id="grade"
                  value={state.grade}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="مثال: مدير، مسوق، إلخ..."
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="comment" className="block text-right mb-1 font-medium">
                  تعليقك
                </label>
                <textarea
                  id="comment"
                  value={state.comment}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="شاركنا تجربتك معنا..."
                  rows="4"
                  maxLength={MAX_COMMENT_LENGTH}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-gray-500 text-left mt-1">
                  {remainingChars} حرف متبقي
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <label className="block text-right mb-2 font-medium">
                  تقييمك
                </label>
                <Rating
                  value={state.rating}
                  onChange={handleRatingChange}
                  className="flex justify-center"
                />
              </div>
            </div>
            
            <button
              onClick={submitTestimonial}
              disabled={submitting}
              className={`mt-6 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-teal-700 transition-colors ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <Spinner className="h-5 w-5 mr-2" />
                  جاري الإرسال...
                </span>
              ) : (
                "أرسل شهادتك"
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}