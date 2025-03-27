"use client";
import TestimonialCard from "@/components/UI/TestimonialCard";
import { useCredentials } from "@/context/CredentialsContext";
import {
  createTestimonial,
  getAllTestimonials,
} from "@/services/testimonialServices";
import { Rating, Spinner } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import validator from "validator";

export default function page() {
  const { user, isLoggedIn, userToken } = useCredentials();
  const [state, setState] = useState({
    comment: "",
    grade: "",
    rating: 0,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    let data = await getAllTestimonials();
    if (data) {
      setData(data);
    }
  };
  useEffect(() => {
    getData().finally(() => setLoading(false));
  }, []);

  const submitTestimonial = async () => {
    if (
      validator.isEmpty(state.grade) ||
      validator.isEmpty(state.comment) ||
      state.rating === 0
    ) {
      Swal.fire("جميع الحقول مطلوبة");
      return false;
    }
    if (user.testimonial)
      return Swal.fire("لقد قدمت طلبك بالفعل نشكرك على وفائك", "", "success");
    if (!isLoggedIn)
      Swal.fire({ text: "يجب عليك تسجيل الدخول الى حسابك أولا", icon: "info" });
    await createTestimonial(state, userToken);
    Swal.fire("تم إرسال الشهادة!", "شكراً لمشاركتك رأيك.", "success");
    setLoading(true);
    getData().finally(() => setLoading(false));
  };

  return (
    <div className="" dir="rtl">
      {/* القسم الرئيسي */}
      <section className="bg-teal-600 text-white text-center py-10">
        <h1 className="text-4xl font-bold mb-2">ماذا يقول عملاؤنا</h1>
        <p className="text-lg">آراء حقيقية من عملائنا الراضين</p>
      </section>

      {/* بطاقات الشهادات */}
      {loading ? (
        <div className="w-full h-60 flex justify-center items-center">
          <Spinner color="teal" className="w-16 h-16" />
        </div>
      ) : data.length > 0 ? (
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center place-content-center gap-8">
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
        <div className="w-full h-[50vh] flex justify-center items-center">
          <p className="text-2xl">
            لا توجد اي تعليقات حاليا نحن سعداء بمشاركتك
          </p>
        </div>
      )}

      {/* الدعوة إلى العمل */}
      <section className="bg-teal-600 text-white flex flex-col items-center py-8">
        <h2 className="text-3xl font-bold">هل تريد مشاركة تجربتك؟</h2>
        <p className="mb-4">نسعد بسماع رأيك!</p>
        <div
          dir="rtl"
          className="space-y-4 w-1/3 bg-teal-200 text-black placeholder:text-black p-4 rounded-xl mb-5"
        >
          <input
            type="text"
            id="grade"
            value={state.grade}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="الرتبة : مدير ،مسوق ..."
            onChange={(e) =>
              setState({
                ...state,
                grade: e.target.value,
              })
            }
          />
          <textarea
            id="comment"
            value={state.comment}
            className="w-full p-2 rounded border border-gray-300"
            placeholder="تعليقك"
            rows="4"
            maxLength={200}
            onChange={(e) =>
              setState({
                ...state,
                comment: e.target.value,
              })
            }
          />
          <Rating
            value={state.rating}
            onChange={(val) =>
              setState({
                ...state,
                rating: val,
              })
            }
            id="rating"
          />
        </div>
        <button
          onClick={submitTestimonial}
          className="bg-white text-blue-600 font-bold py-2 px-6 rounded shadow-md hover:bg-gray-100"
        >
          أرسل شهادتك
        </button>
      </section>
    </div>
  );
}
