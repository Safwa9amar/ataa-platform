"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Input,
  Typography,
  Alert,
  Textarea,
  Spinner,
  Checkbox,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import CustomStepper from "@/components/layouts/CustomStepper";
import { useRouter } from "next/navigation";
import { useCredentials } from "@/context/CredentialsContext";
import { useFieldCategoryContext } from "@/context/FieldCategoryContext";
import { FileUploader } from "react-drag-drop-files";
import Swal from "sweetalert2";
import CONSTANTS from "@/config/constants";
import { useAddress } from "@/hooks/useAddress";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { getCategoryById } from "@/services/fieldService";
import useImageUpload from "@/hooks/useImageUpload";

import FileDisplay from "@/components/UI/FileDisplay";
import Cookies from "js-cookie";
import { createDonationOpportunity } from "@/services/donationOpportunityService";
import { IoClose } from "react-icons/io5";
import MarkdownGuide from "@/components/UI/MarkDownGuid";

const COOKIE_NAME = "create_oppertunity_form_data";

export default function Page() {
  const router = useRouter();
  const [openGuide, setGuideOpen] = useState();
  const { userToken } = useCredentials();
  const {
    fields,
    selectedField,
    loading: loadingFields,
    setSelectedField,
    categories,
  } = useFieldCategoryContext();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState(null);
  const { wilayas, dairas, communes, setSelectedWilaya, setSelectedDaira } =
    useAddress();
  const { loading: loadingCities } = useAlgeriaCitiesContext();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [targetType, setTargetType] = useState(null);
  const { uploadImage } = useImageUpload();

  // Watch form changes and save to cookies
  const formValues = watch();

  const fetchCat = async (e) => {
    let val = e?.target.value || getValues("category");
    let data = await getCategoryById(val, userToken);
    setSelectedCategory(data);
    setValue("category", val);
  };
  const validateStep = useCallback(
    async (step) => {
      clearErrors();
      switch (step) {
        case 0:
          if (!getValues("field")) {
            setError("field", {
              type: "required",
              message: "الرجاء اختيار الصنف",
            });
            return false;
          }

          if (!getValues("category") && categories.length) {
            setError("category", {
              type: "required",
              message: "الرجاء تحديد الفئة",
            });
            return false;
          }

          if (!getValues("donationScoop")) {
            setError("donationScoop", {
              type: "required",
              message: "الرجاء تحديد المجال",
            });
            return false;
          }
          if (!getValues("type")) {
            setError("type", {
              type: "required",
              message: "الرجاء تحديد نوع الفرصة",
            });
            return false;
          }
          return true;
        case 1:
          if (!getValues("title")) {
            setError("title", {
              type: "required",
              message: "غنوان الفرصة مطلوب",
            });
            return false;
          }
          if (!getValues("description")) {
            setError("description", {
              type: "required",
              message: "الوصف مطلوب",
            });
            return false;
          }
          if (!getValues("overview")) {
            setError("overview", {
              type: "required",
              message: "يرجى كتابة وصف تفصيلي.",
            });
            return false;
          }
          if (!getValues("wilaya")) {
            setError("wilaya", {
              type: "required",
              message: "الرجاء تحديد الولاية",
            });
            return false;
          }
          if (!getValues("daira")) {
            setError("daira", {
              type: "required",
              message: "الرجاء تحديد الدائرة",
            });
            return false;
          }
          if (!getValues("commune")) {
            setError("commune", {
              type: "required",
              message: "الرجاء تحديد البلدية",
            });
            return false;
          }
          return true;

        case 2:
          if (categories.length > 0) {
            let cc = CONSTANTS.subcategoryMap[selectedCategory?.type];
            for (let i = 0; i < cc.length; i++) {
              if (!getValues(cc[i].name)) {
                setError(cc[i].name, {
                  type: "required",
                  message: `${cc[i].label} مطلوب`,
                });
                return false;
              }
            }
          }
          return true;
        case 3:
          if (!getValues("targetType")) {
            setError("targetType", {
              type: "required",
              message: "الرجاء تحديد المبلغ المطلوب",
            });
            return false;
          }
          if (!getValues("targetAmount")) {
            setError("targetAmount", {
              type: "required",
              message: "الرجاء تحديد المبلغ المطلوب",
            });
            return false;
          }
          if (getValues("targetType") === "GOODS" && !getValues("unitPrice")) {
            setError("unitPrice", {
              type: "required",
              message: "سعر الوحدة مطلوب",
            });
            return false;
          }
          return true;
        case 4:
          if (!getValues("numOfBeneficiaries")) {
            setError("numOfBeneficiaries", {
              type: "required",
              message: "عدد المستفيدين مطلوب",
            });
            return false;
          }
          if (!getValues("needs")) {
            setError("needs", {
              type: "required",
              message: "الاحتياجات مطلوبة",
            });
            return false;
          }
          return true;
        case 5:
          if (!getValues("images")) {
            setError("images", {
              type: "required",
              message: "الرجاء إرفاق صورة",
            });
            return false;
          }
          return true;
        case 6:
          if (!getValues("proofFiles")) {
            setError("proofFiles", {
              type: "required",
              message: "الرجاء إرفاق وثائق الإثبات",
            });
            return false;
          }
          return true;
        case 7:
          return true;
          if (!getValues("partner_name")) {
            setError("partner_name", {
              type: "required",
              message: "الرجاء تحديد الجهة الشريكة",
            });
            return false;
          }
          if (!getValues("partner_role")) {
            setError("partner_role", {
              type: "required",
              message: "الرجاء تحديد دور الشريك في تنفيذ الفرصة",
            });
            return false;
          }
          if (!getValues("partnershipContract")) {
            setError("partnershipContract", {
              type: "required",
              message: "الرجاء إرفاق عقد الشراكة",
            });
            return false;
          }
          return true;
      }
      return true;
    },
    [getValues, setError, errors, categories, formValues, reset]
  );

  // Load form data from cookies on mount
  useEffect(() => {
    const savedData = Cookies.get(COOKIE_NAME);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset(parsedData); // Prefill the form with saved data
    }
  }, [reset]);

  useEffect(() => {
    fetchCat();
    setSelectedDaira(getValues("daira"));
    setSelectedWilaya(getValues("wilaya"));
    setTargetType(getValues("targetType"));
  }, []);

  useEffect(() => {
    Cookies.set(COOKIE_NAME, JSON.stringify(formValues), { expires: 7 });
  }, [formValues]);
  const onSubmit = useCallback(
    async (data) => {
      const updatedData = {
        ...data,
        partner_name: data.partner_name,
        partner_role: data.partner_role,
        commitmentTransparency: data.commitmentTransparency,
        selectedCategoryType: selectedCategory.type,
      };

      // Clean up subcategory fields from main data object
      if (selectedCategory?.type) {
        // Process subcategories and remove them from main data
        const subcategoryData = CONSTANTS.subcategoryMap[
          selectedCategory.type
        ]?.reduce((acc, curr) => {
          if (data.hasOwnProperty(curr.name)) {
            acc[curr.name] = data[curr.name];
          }
          return acc;
        }, {});

        // Add structured category data if subcategories exist
        if (subcategoryData && Object.keys(subcategoryData).length > 0) {
          updatedData.category = {
            id: updatedData.category,
            [selectedCategory.type]: subcategoryData,
          };
        }
      }

      setLoading(true);
      setErrorState(null);

      try {
        await createDonationOpportunity(updatedData, userToken);

        Swal.fire({
          title: "Success!",
          text: "تم انشاء البرنامج بنجاح",
          icon: "success",
        });
        Cookies.remove(COOKIE_NAME);
        reset();
      } catch (error) {
        setErrorState(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [router, selectedCategory, categories, userToken, reset]
  );

  const steps = [
    {
      title: "التصنيف ومجال التبرع",
      content: (
        <div className="space-y-4">
          <Controller
            key={"field"}
            name="field"
            control={control}
            rules={{ required: "الرجاء اختيار الصنف" }}
            render={({ field }) => (
              <div>
                <select
                  className={`w-full border p-2 rounded-md ${
                    errors.field && "border-red-500"
                  }`}
                  {...field}
                  onChange={(e) => {
                    setValue("field", e.target.value);
                    setSelectedField(e.target.value);
                  }}
                >
                  <option value="">اختر الصنف</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.ar_title}
                    </option>
                  ))}
                </select>
                {errors.field && (
                  <p className="text-red-500 text-sm">{errors.field.message}</p>
                )}
              </div>
            )}
          />
          {loadingFields ? (
            <Spinner className="w-5 h-5" color="teal" />
          ) : (
            categories.length > 0 && (
              <Controller
                key={"category"}
                name="category"
                control={control}
                rules={{ required: "الرجاء تحديد الفئة" }}
                render={({ field }) => (
                  <div>
                    <select
                      className={`w-full border p-2 rounded-md ${
                        errors.category && "border-red-500"
                      }`}
                      onChange={fetchCat}
                      ref={field.ref}
                      value={field.value}
                      name={field.name}
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.ar_title}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )
          )}
          <Controller
            key="donationScoop"
            name="donationScoop"
            control={control}
            rules={{ required: "الرجاء تحديد المجال" }}
            render={({ field }) => (
              <div>
                <select
                  className={`w-full border p-2 rounded-md ${
                    errors.donationScoop && "border-red-500"
                  }`}
                  {...field}
                >
                  <option value="">اختر المجال</option>

                  {CONSTANTS.DONATION_SCOOP.map((scoop) => (
                    <option key={scoop.value} value={scoop.value}>
                      {scoop.name}
                    </option>
                  ))}
                </select>
                {errors.donationScoop && (
                  <p className="text-red-500 text-sm">
                    {errors.donationScoop.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            key="type"
            name="type"
            control={control}
            rules={{ required: "الرجاء تحديد نوع الفرصة" }}
            render={({ field }) => (
              <div>
                <select
                  className={`w-full border p-2 rounded-md ${
                    errors.type && "border-red-500"
                  }`}
                  {...field}
                >
                  <option value="">اختر نوع الفرصة</option>

                  <option value={"storeOpportunity"}>فرصة متجر التبرع</option>
                  <option value={"normalOpportunity"}>فرصة تبرع المنصة</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>
            )}
          />
        </div>
      ),
    },
    {
      title: "معلومات عامة عن الفرصة",
      content: (
        <div className="space-y-4">
          <Controller
            key="title"
            name="title"
            control={control}
            rules={{ required: "عنوان الفرصة مطلوب", maxLength: 50 }}
            render={({ field }) => (
              <Input
                variant="standard"
                color={errors.title ? "red" : "teal"}
                placeholder="أدخل عنوانًا مختصر وجذاب يعبر عن الفرصة ويجذب انتباه المتبرعين"
                label="عنوان الفرصة"
                {...field}
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
          <div className="pt-5">
            <Controller
              key="description"
              name="description"
              control={control}
              rules={{
                required: "يرجى إدخال وصف قصير.",
                minLength: {
                  value: 10,
                  message: "يجب أن يكون الوصف أطول قليلاً (10 أحرف على الأقل).",
                },
                maxLength: {
                  value: 500,
                  message: "يرجى تقليل عدد الأحرف ليكون أقل من 500.",
                },
              }}
              render={({ field }) => (
                <>
                  <Textarea
                    placeholder="اكتب وصفًا يوضح طبيعة الفرصة، ما الذي تريد تحقيقه، وكيف ستؤثر التبرعات إيجابيًا. حاول أن تجعله موجزًا وواضحًا قدر الإمكان."
                    label="وصف قصير"
                    {...field}
                    variant="static"
                    resize
                    cols={30}
                    color={errors.description ? "red" : "teal"}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <Button
            onClick={() => setGuideOpen(true)}
            className="text-lg bg-teal-300 dark:bg-teal-800 font-ReemKufi w-full"
          >
            تدعم منصة عطاء خاصية Markdown لتنسيق النصوص، يمكنك الاطلاع على
            الدليل من هنا
          </Button>
          <Dialog
            className="h-[560px] overflow-y-auto"
            dir="rtl"
            handler={setGuideOpen}
            open={openGuide}
          >
            <DialogHeader>تنسيق النصوص في منصة عطاء</DialogHeader>
            <DialogBody>
              <MarkdownGuide />
            </DialogBody>
          </Dialog>
          <div className="pt-5">
            <Controller
              key="overview"
              name="overview"
              control={control}
              rules={{
                required: "يرجى كتابة وصف تفصيلي.",
                minLength: {
                  value: 10,
                  message: "يجب أن يحتوي الوصف على 10 أحرف على الأقل.",
                },
              }}
              render={({ field }) => (
                <>
                  <Textarea
                    placeholder="اكتب وصفًا تفصيليًا يحتوي على الأهداف، الأسباب، والفئات المستفيدة من هذه الفرصة. حاول أن يكون شاملاً وواضحًا."
                    label="الوصف التفصيلي"
                    {...field}
                    variant="static"
                    resize
                    cols={500}
                    color={errors.overview ? "red" : "teal"}
                  />
                  {errors.overview && (
                    <p className="text-red-500 text-sm">
                      {errors.overview.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="relative space-y-4">
            {/* {(loadingCities.wilayas ||
              loadingCities.dairas ||
              loadingCities.communes ||
              loadingCities.cities) && (
              <div className="w-full h-full absolute flex justify-center items-center bg-white opacity-75 rounded-md">
                <Spinner className="w-5 h-5" color="teal" />
              </div>
            )} */}
            {/* قائمة منسدلة للولاية */}

            <Controller
              key="wilaya"
              name="wilaya"
              control={control}
              rules={{ required: "الرجاء تحديد الولاية" }}
              render={({ field }) => (
                <div>
                  <select
                    className={`w-full border p-2 rounded-md ${
                      errors.wilaya && "border-red-500"
                    }`}
                    {...field}
                    onChange={(e) => {
                      let val = e.target.value;
                      setValue("wilaya", val);
                      setValue("daira", "");
                      setSelectedWilaya(val);
                    }}
                    disabled={loadingCities.wilayas}
                  >
                    <option value="">اختر الولاية</option>

                    {wilayas.map((wilaya) => (
                      <option
                        key={wilaya.wilaya_code}
                        value={wilaya.wilaya_code}
                      >
                        {wilaya.wilaya_name}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <p className="text-red-500 text-sm">
                      {errors.wilaya.message}
                    </p>
                  )}
                </div>
              )}
            />
            {/* قائمة منسدلة للدائرة */}

            <Controller
              key="daira"
              name="daira"
              control={control}
              rules={{ required: "الرجاء تحديد الدائرة" }}
              render={({ field }) => (
                <div>
                  <select
                    className={`w-full border p-2 rounded-md ${
                      errors.daira && "border-red-500"
                    }`}
                    {...field}
                    onChange={(e) => {
                      let val = e.target.value;
                      setValue("daira", val);
                      setSelectedDaira(val);
                    }}
                    disabled={loadingCities.dairas}
                  >
                    <option value="">اختر الدائرة</option>

                    {dairas?.map((daira) => (
                      <option
                        key={daira.daira_name_ascii}
                        value={daira.daira_name_ascii}
                      >
                        {daira.daira_name}
                      </option>
                    ))}
                  </select>
                  {errors.daira && (
                    <p className="text-red-500 text-sm">
                      {errors.daira.message}
                    </p>
                  )}
                </div>
              )}
            />
            {/* قائمة منسدلة للبلدية */}
            {getValues("daira") && (
              <Controller
                key="commune"
                name="commune"
                control={control}
                rules={{ required: "الرجاء تحديد البلدية" }}
                render={({ field }) => (
                  <div>
                    <select
                      className={`w-full border p-2 rounded-md ${
                        errors.commune && "border-red-500"
                      }`}
                      {...field}
                      onChange={(e) => {
                        let val = e.target.value;
                        setValue("commune", val);
                      }}
                      disabled={loadingCities.dairas}
                    >
                      <option value="">اختر البلدية</option>

                      {communes.map((commune) => (
                        <option key={commune.id} value={commune.id}>
                          {commune.commune_name}
                        </option>
                      ))}
                    </select>
                    {errors.commune && (
                      <p className="text-red-500 text-sm">
                        {errors.commune.message}
                      </p>
                    )}
                  </div>
                )}
              />
            )}
          </div>
        </div>
      ),
    },
    categories.length > 0
      ? {
          title: "معلومات خاصة عن الفرصة",
          content: (
            <div className="space-y-5">
              {selectedCategory &&
                CONSTANTS.subcategoryMap[selectedCategory?.type]?.map(
                  (subcat) => (
                    <Controller
                      key={subcat.name}
                      name={subcat.name}
                      control={control}
                      render={({ field }) => {
                        // Dynamic rendering based on the field type
                        switch (subcat.type) {
                          case "select":
                            return (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  {subcat.label}
                                </label>
                                <select
                                  {...field}
                                  className={`form-select mt-1 block w-full border rounded-md p-2 ${
                                    errors[subcat.name]
                                      ? "border-red-500"
                                      : "border-borderColor"
                                  }`}
                                >
                                  <option value="">اختر</option>
                                  {subcat.data.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                                {errors[subcat.name] && (
                                  <span className="text-red-500 text-sm">
                                    {errors[subcat.name]?.message}
                                  </span>
                                )}
                              </div>
                            );
                          case "textarea":
                            return (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  {subcat.label}
                                </label>
                                <textarea
                                  {...field}
                                  className={`form-textarea mt-1 block w-full ${
                                    errors[subcat.name]
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  }`}
                                  placeholder={`أدخل ${subcat.label}`}
                                />
                                {errors[subcat.name] && (
                                  <span className="text-red-500 text-sm">
                                    {errors[subcat.name]?.message}
                                  </span>
                                )}
                              </div>
                            );
                          default:
                            // Render for "text" and "number" inputs
                            return (
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  {subcat.label}
                                </label>
                                <Input
                                  {...field}
                                  type={subcat.type}
                                  variant="standard"
                                  color={errors[subcat.name] ? "red" : "teal"}
                                  placeholder={`أدخل ${subcat.label}`}
                                  className={`mt-1 block w-full ${
                                    errors[subcat.name]
                                      ? "border-ared-500"
                                      : "border-gray-300"
                                  }`}
                                />
                                {errors[subcat.name] && (
                                  <span className="text-red-500 text-sm">
                                    {errors[subcat.name]?.message}
                                  </span>
                                )}
                              </div>
                            );
                        }
                      }}
                    />
                  )
                )}
            </div>
          ),
        }
      : {
          title: "",
          content: (
            <div className="space-y-5">
              <p className="text-center">الخطوة التالية</p>
            </div>
          ),
        },
    {
      title: "المعلومات المالية",
      content: (
        <div className="space-y-5">
          <Controller
            key="targetType"
            name="targetType"
            control={control}
            rules={{ required: "الرجاء تحديد المبلغ المطلوب" }}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  مبلغ مالي أو عدد وحداث مستهدف
                </label>
                <select
                  ref={field.ref}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => {
                    setValue("targetType", e.target.value);
                    setTargetType(e.target.value);
                  }}
                  color={errors.targetType ? "red" : "teal"}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    errors.targetType ? "border-red-500" : "border-borderColor"
                  }`}
                >
                  <option value="">اختر</option>
                  <option value="MONEY">المبلغ المالي المستهدف جمعها</option>
                  <option value="GOODS">عدد الوحدات المستهدف جمعها</option>
                </select>
                {errors.targetType && (
                  <span className="text-red-500 text-sm">
                    {errors.targetType?.message}
                  </span>
                )}
              </div>
            )}
          />
          {targetType === "MONEY" && (
            <>
              <Controller
                key="targetAmount"
                name="targetAmount"
                control={control}
                rules={{ required: "الرجاء تحديد المبلغ المطلوب" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="standard"
                    color={errors.targetAmount ? "red" : "teal"}
                    placeholder="أدخل المبلغ المطلوب"
                    label="المبلغ المطلوب"
                  />
                )}
              />
              {errors.targetAmount && (
                <p className="text-red-500 text-sm">
                  {errors.targetAmount.message}
                </p>
              )}
            </>
          )}
          {targetType === "GOODS" && (
            <>
              <Controller
                key="targetAmount"
                name="targetAmount"
                control={control}
                rules={{ required: "الرجاء تحديد عدد الوحدات المطلوب جمعها" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="standard"
                    color={errors.targetAmount ? "red" : "teal"}
                    placeholder="أدخل عدد الوحدات المطلوب جمعها"
                    label="عدد الوحدات المطلوب جمعها"
                  />
                )}
              />
              {errors.targetAmount && (
                <p className="text-red-500 text-sm">
                  {errors.targetAmount.message}
                </p>
              )}
              <Controller
                key="unitPrice"
                name="unitPrice"
                control={control}
                rules={{ required: "سعر الوحدة مطلوب" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    variant="standard"
                    className=""
                    color={errors.unitPrice ? "red" : "teal"}
                    placeholder="أدخل سعر الوحدة بــ (دج)"
                    label="سعر الوحدة بــ (دج)"
                  />
                )}
              />
              {errors.unitPrice && (
                <p className="text-red-500 text-sm">
                  {errors.unitPrice.message}
                </p>
              )}
              {/* <Input
                disabled
                label="المبلغ الكلي لعدد الوحدات المطلوبة"
                type="text"
                value={getValues("targetAmount") * getValues("unitPrice") || 0}
              /> */}
            </>
          )}
        </div>
      ),
    },
    {
      title: "المستفيدون والاحتياجات",
      content: (
        <div className="space-y-4">
          <p>
            عدد المستفيدين : حدد عدد المستفيدين من الفرصة في حالة عدم توفر
            المعلومة يمكن تحديد عدد مستفيدين محتمل شرط أن يتوافق مع المبلغ
            المالي المستهدف جمعه
          </p>
          <Controller
            key="numOfBeneficiaries"
            name="numOfBeneficiaries"
            control={control}
            rules={{ required: "عدد المستفيدين مطلوب" }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                variant="standard"
                color={errors.numOfBeneficiaries ? "red" : "teal"}
                placeholder="أدخل عدد المستفيدين"
                label="عدد المستفيدين"
              />
            )}
          />
          {errors.numOfBeneficiaries && (
            <p className="text-red-500 text-sm">
              {errors.numOfBeneficiaries.message}
            </p>
          )}
          <p>
            قدم وصفًا للموارد التي ستستخدمها الجمعية والاحتياجات الخاصة لتحقيق
            أهداف الفرصة (معلومة لن تعرض على المنصة)
          </p>
          <Controller
            key="needs"
            name="needs"
            control={control}
            rules={{ required: "الاحتياجات مطلوبة" }}
            render={({ field }) => (
              <Textarea
                resize
                {...field}
                variant="static"
                color={errors.needs ? "red" : "teal"}
                placeholder="أدخل الاحتياجات"
                label="الاحتياجات"
              />
            )}
          />
          {errors.needs && (
            <p className="text-red-500 text-sm">{errors.needs.message}</p>
          )}
        </div>
      ),
    },
    {
      title: "الوسائط المرفقة",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <FileUploader
              handleChange={async (files) => {
                let resFile = await uploadImage(files);
                setValue(
                  "images",
                  getValues("images")
                    ? [...getValues("images"), resFile]
                    : [resFile]
                );
              }}
              name="file"
              multiple
              types={["JPG", "PNG", "JPEG", "MP4"]}
              label="قم باختيار أو اسقاط صورة"
              uploadedLabel="تم رفم الصورة بنجاح يمكنك رفم المزيد"
              hoverTitle="قم باسقاط الصورة هنا"
            />
            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images.message}</p>
            )}
            {getValues("images")?.length > 0 && (
              <div className=" flex flex-wrap gap-4">
                {/* Display images from state.images */}
                {getValues("images").map((image, index) => (
                  <div key={index} className="relative">
                    <IconButton
                      className="absolute "
                      variant="gradient"
                      size="sm"
                      color="red"
                      onClick={(e) => {
                        let newImages = getValues("images").filter(
                          (img, i) => i !== index
                        );
                        setValue("images", newImages);
                      }}
                    >
                      <IoClose size={20} />
                    </IconButton>
                    <img
                      className="rounded-md w-40 h-40 object-cover"
                      alt={`Uploaded image ${index + 1}`}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${image?.filename}`} // TODO: Add thumbs to the database for images
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "وثائق الإثبات",
      content: (
        <div className="flex flex-col gap-4">
          <p>
            خطة عمل أو دراسة جدوى : إذا كان المشروع المرد تنفيذه يصنف من
            المشاريع الكبرى يرجى إرفاق ملف pdf حول كيفية تنفيذ المشروع، المراحل
            الزمنية، الموارد المطلوبة، تقارير ميدانية توضح الحاجة أو المشاكل
            التي سيتم معالجتها من خلال المشروع، والمخاطر المحتملة...إلخ
          </p>
          <p>
            إثبات ملكية أو تصريح استخدام الأرض أو المبنى : إذا كانت الفرصة تتعلق
            بمشروع بناء أو تطوير مثل المنازل أو المساجد. ، فإن إثبات ملكية الأرض
            أو تصريح استخدامها ضروري لضمان قانونية المشروع.
          </p>
          <p>
            التراخيص الطبية: إذا كانت الفرصة تتعلق بتقديم خدمات طبية (عمليات
            جراحية، تصفية دم، العلاج بالكيماوي...إلخ) يرجى إرفاق أي تراخيص
            متوفرة للأطباء أو المستشفيات المشاركة في المشروع.
          </p>
          <p>
            - وصفات الدواء: إذا كانت الفرصة تتعلق بشراء أدوية يرجى إرفاق الوصفة
            الطبية
          </p>
          <p>
            * فرص تيسرت : - إثبات الديون: يرجى إرفاق وثائق تثبت وجود الديون
            المستحقة على المستفيدين لضمان الشفافية
          </p>
          <p>
            * فرص فرجت :- إثبات الحكم القضائي : يرجى إرفاق الوثيقة التي تأكد
            الحكم القضائي و توضح سببه
          </p>
          <div className="flex flex-col items-center gap-4">
            <Controller
              name="proofFiles"
              rules={{ required: "الرجاء إرفاق وثائق الإثبات" }}
              control={control}
              render={({ field }) => (
                <FileUploader
                  handleChange={async (files) => {
                    let resFile = await uploadImage(files);
                    setValue(
                      "proofFiles",
                      getValues("proofFiles")
                        ? [...getValues("proofFiles"), resFile]
                        : [resFile]
                    );
                  }}
                  {...field}
                  multiple
                  types={["PDF"]}
                  label="قم باختيار أو اسقاط ملف"
                  uploadedLabel="تم رفم الملف بنجاح يمكنك رفم المزيد"
                  hoverTitle="قم باسقاط الملف هنا"
                />
              )}
            />
            {errors.proofFiles && (
              <p className="text-red-500 text-sm">
                {errors.proofFiles.message}
              </p>
            )}
            {getValues("proofFiles")?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {getValues("proofFiles")?.map((file, index) => (
                  <FileDisplay
                    key={index}
                    filename={file?.filename}
                    mimetype={file?.mimetype}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "الشركاء والموافقات",
      content: (
        <div className="space-y-4">
          {/* Partner's Full Name */}
          <Controller
            key="partner_name"
            name="partner_name"
            control={control}
            rules={{ required: "الرجاء تحديد الجهة الشريكة" }}
            render={({ field }) => (
              <Textarea
                resize
                {...field}
                variant="static"
                color={errors.partner_name ? "red" : "teal"}
                placeholder="أدخل الشركاء"
                label="الإسم الكامل للجهة الشريكة"
              />
            )}
          />
          {errors.partner_name && (
            <p className="text-red-500 text-sm">
              {errors.partner_name.message}
            </p>
          )}
          {/* Partner's Role */}
          <Controller
            key="partner_role"
            name="partner_role"
            control={control}
            rules={{ required: "الرجاء تحديد دور الشريك في تنفيذ الفرصة" }}
            render={({ field }) => (
              <Textarea
                resize
                {...field}
                variant="static"
                color={errors.partner_role ? "red" : "teal"}
                placeholder="أدخل دور الشريك"
                label="دور الشريك في تنفيذ الفرصة"
              />
            )}
          />
          {errors.partner_role && (
            <p className="text-red-500 text-sm">
              {errors.partner_role.message}
            </p>
          )}
          {/* Partnership Contract */}
          {getValues("partnershipContract") ? (
            <FileDisplay
              filename={getValues("partnershipContract")?.filename}
              mimetype={getValues("partnershipContract")?.mimetype}
            />
          ) : (
            <Controller
              key="partnershipContract"
              name="partnershipContract"
              control={control}
              rules={{
                required: "الرجاء إرفاق نسخة من عقد الشراكة إذا كان متوفرًا",
              }}
              render={({ field }) => (
                <FileUploader
                  {...field}
                  color={errors.partnershipContract ? "red" : "teal"}
                  handleChange={async (files) => {
                    let resFile = await uploadImage(files);
                    console.log(resFile);
                    setValue("partnershipContract", resFile);
                  }}
                  multiple
                  types={["PDF"]}
                  label="الرجاء إرفاق نسخة من عقد الشراكة"
                  uploadedLabel="تم رفم الملف بنجاح   "
                  hoverTitle="الرجاء إرفاق نسخة من عقد الشراكة"
                />
              )}
            />
          )}
          {errors.partnershipContract && (
            <p className="text-red-500 text-sm">
              {errors.partnershipContract.message}
            </p>
          )}

          {/* Official Approval Letter */}
          {getValues("approvalLetter") ? (
            <FileDisplay
              filename={getValues("approvalLetter")?.filename}
              mimetype={getValues("approvalLetter")?.mimetype}
            />
          ) : (
            <Controller
              key="approvalLetter"
              name="approvalLetter"
              control={control}
              rules={{
                required:
                  "الرجاء إرفاق نسخة من خطاب اعتماد أو موافقة رسمية إذا كان متوفرًا",
              }}
              render={({ field }) => (
                <FileUploader
                  {...field}
                  color={errors.approvalLetter ? "red" : "teal"}
                  handleChange={async (files) => {
                    let resFile = await uploadImage(files);
                    setValue("approvalLetter", resFile);
                  }}
                  multiple
                  types={["PDF"]}
                  label="الرجاء إرفاق نسخة من خطاب اعتماد أو موافقة رسمية"
                  uploadedLabel="تم رفم الملف بنجاح   "
                  hoverTitle="الرجاء إرفاق نسخة من خطاب اعتماد أو موافقة رسمية"
                />
              )}
            />
          )}
          {errors.approvalLetter && (
            <p className="text-red-500 text-sm">
              {errors.approvalLetter.message}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "الالتزام بالشفافية والمعلومات الاختيارية",
      content: (
        <div className="space-y-4">
          {/* Commitment to Transparency */}
          <Controller
            key="commitmentTransparency"
            name="commitmentTransparency"
            control={control}
            rules={{
              required: "الرجاء الإقرار بالالتزام بالشفافية",
            }}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                color={errors.commitmentTransparency ? "red" : "teal"}
                label="الالتزام بالشفافية"
              />
            )}
          />
          {errors.commitmentTransparency && (
            <p className="text-red-500 text-sm">
              {errors.commitmentTransparency.message}
            </p>
          )}

          {/* Periodic Reporting Commitment */}
          <Controller
            key="commitmentReporting"
            name="commitmentReporting"
            control={control}
            rules={{
              required:
                "الرجاء التعهد بتقديم تقارير دورية حول استخدام الأموال وأثرها",
            }}
            render={({ field }) => (
              <Checkbox
                {...field}
                checked={field.value}
                color={errors.commitmentReporting ? "red" : "teal"}
                label="التعهد بتقديم تقارير دورية حول استخدام الأموال وأثرها"
              />
            )}
          />
          {errors.commitmentReporting && (
            <p className="text-red-500 text-sm">
              {errors.commitmentReporting.message}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-8 grid place-items-center">
      <div className="flex flex-col w-full max-w-3xl gap-3 items-center justify-center">
        <Typography variant="h3" className="text-center">
          انشاء فرص تبرع
        </Typography>
        {error && (
          <Alert
            className="text-right"
            color="red"
            dismissible
            onClose={() => setErrorState(null)}
          >
            {error}
          </Alert>
        )}
      </div>
      <CustomStepper
        steps={steps}
        validateStep={validateStep}
        loading={loading}
        handleSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
