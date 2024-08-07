"use client";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CiCalendar } from "react-icons/ci";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import jobTypes from "@/data/jobTypes.json";
import minEducation from "@/data/minEducation.json";
import yearsOfExperience from "@/data/yearsOfExperience.json";
import workSettings from "@/data/workSettings.json"
import { postJobSchema } from "@/validations/validationSchema";
import InputField from "@/components/InputField/InputField";
import Selection from "@/components/Selection/Selection";
import * as Yup from "yup";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { postJob } from "@/services/jobServices";

const initialValues = {
  title: "",
  jobType: "",
  workSetting: "",
  category: "",
  wage: "",
  description: "",
  name: "",
  linkedin: "",
  twitter: "",
  website: "",
  companyDescription: "",
  educationalLevel: "",
  yearsOfExperience: "",
  certifications: [""],
  skills: [""],
  location: "",
  deadline: "",
  method: "",
};

function JobPostingForm({categories}) {
  const [date, setDate] = useState();
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
      console.log(token)
    }
  }, []);

  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    const jobData = {
      ...values,
      requirements: {
        educationalLevel: values.educationalLevel,
        yearsOfExperience: values.yearsOfExperience,
        certifications: values.certifications,
        skills: values.skills
      },
      applicationDetails: {
        deadline: values.deadline,
        method: values.method
      }
    }

    try{
      const response = await postJob(jobData, accessToken)
      const jobId = response._id
      router.push(`/jobs/${jobId}`)
    }catch(err){
      console.error("Error:", err.message);
    }
  }

  return (
    <div className="container py-10">
      <div className="text-4xl font-poppins font-semibold mb-10  place-content-center">
        Post your job listing
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={postJobSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched, isSubmitting }) => (
          <Form>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 space-x-3 ">
              <Label
                htmlFor="jobDetails"
                className="lg:col-span-2 ml-3 text-xl  font-semibold mb-2"
              >
                job details
              </Label>
              <div className="flex flex-col space-y-2 ">
                {/* Job title */}
                <InputField
                  id="title"
                  name="title"
                  placeholder="Job Title*"
                  style="bg-[#F8FAFC]"
                />
                {/* Select Job Type */}
                <Selection
                  id="jobType"
                  name="jobType"
                  placeholder="Job Type*"
                  options={jobTypes.map((jobType) => ({
                    value: jobType.name,
                    label: jobType.name,
                  }))}
                  label="Select a Job Type"
                />
                {/* Work Setting */}
                <Selection
                  id="workSetting"
                  name="workSetting"
                  placeholder="On-site/Remote*"
                  options={workSettings.map((workSetting) => ({
                    value: workSetting.name,
                    label: workSetting.name
                  }))}
                  label="Select a Work Setting"
                />
                {/* Job Category */}
                <Selection
                  id="category"
                  name="category"
                  placeholder="Job Category*"
                  options={categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                  label="Select a Job Category"
                />
              </div>
              <div className="flex flex-col space-y-2">
                {/* Job Wage */}
                <InputField
                  id="wage"
                  name="wage"
                  placeholder="Job Wage*"
                  style="bg-[#F8FAFC]"
                />
                {/* job Description */}
                <InputField
                  id="description"
                  name="description"
                  placeholder="Job Description*"
                  as="textarea"
                  style="resize-none pb-[70px] bg-[#F8FAFC]"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 space-y-3 space-x-3 my-5">
              <Label htmlFor="jobRequirements" className="lg:col-span-2 ml-3">
                <h3 className="text-lg font-semibold">Job Requirements</h3>
              </Label>
              <div className="flex flex-col space-y-2">
                {/* Minimum Educational Requirements */}
                <Selection
                  id="educationalLevel"
                  name="educationalLevel"
                  placeholder="Minimum Educational Requirement"
                  options={minEducation.map((education) => ({
                    value: education.name,
                    label: education.name
                  }))}
                  label="Select a Minimum Educational Requirement"
                />
                {/* Years of Experience */}
                <Selection
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  placeholder="Years of Experience"
                  options={yearsOfExperience.map((years) => ({
                    value: years.years,
                    label: years.years
                  }))}
                  label="Select required Years of Experience"
                />
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:space-x-3">
                {/* Certifications */}
                <div>
                  <FieldArray name="certifications">
                    {({ push, remove, form }) => (
                      <>
                        {form.values.certifications.map(
                          (certification, index) => (
                            <div key={index} className="flex space-x-1">
                              <InputField
                                id={`certifications.${index}`}
                                name={`certifications.${index}`}
                                placeholder="Required Certification"
                                style="bg-[#F8FAFC] mb-10 w-4/5"
                              />
                              {index ===
                                form.values.certifications.length - 1 &&
                              certification.trim() !== "" ? (
                                <Button
                                  type="button"
                                  onClick={() => push("")}
                                  variant="ghost"
                                >
                                  <AiOutlinePlus />
                                </Button>
                              ) : null}
                              {index !==
                              form.values.certifications.length - 1 ? (
                                <Button
                                  type="button"
                                  onClick={() => remove(index)}
                                  variant="ghost"
                                >
                                  <AiOutlineMinus />
                                </Button>
                              ) : null}
                            </div>
                          )
                        )}
                      </>
                    )}
                  </FieldArray>
                </div>

                {/* Skills */}
                <div>
                  <FieldArray name="skills">
                    {({ push, remove, form }) => (
                      <div>
                        {form.values.skills.map((skill, index) => (
                          <div key={index} className="flex space-x-1">
                            <InputField
                              id={`skills.${index}`}
                              name={`skills.${index}`}
                              placeholder="Required Skills"
                              style="bg-[#F8FAFC] mb-10 w-4/5"
                            />
                            {index === form.values.skills.length - 1 &&
                            skill.trim() !== "" ? (
                              <Button
                                type="button"
                                onClick={() => push("")}
                                variant="ghost"
                              >
                                <AiOutlinePlus />
                              </Button>
                            ) : null}
                            {index !== form.values.skills.length - 1 ? (
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="ghost"
                              >
                                <AiOutlineMinus />
                              </Button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>
            </div>
            {/* Location and Application */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 space-y-3 space-x-3 my-5">
              <Label
                htmlFor="locationAndApplication"
                className="lg:col-span-2 ml-3"
              >
                <h3 className="text-lg font-semibold">
                  Location & Application
                </h3>
              </Label>
              <div className="flex flex-col space-y-2">
                {/* Job Location */}
                <InputField
                  id="location"
                  name="location"
                  placeholder="Job Location*"
                  style="bg-[#F8FAFC]"
                />
                {/* Application Deadline */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal bg-[#F8FAFC]",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CiCalendar className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Application Deadline*</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setFieldValue("deadline", selectedDate);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <div className="min-h-6">
                  {errors.deadline && touched.deadline && (
                    <div className="text-red-600 text-sm pt-1">
                      <ErrorMessage name="deadline" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                {/* Application Method */}
                <InputField
                  id="method"
                  name="method"
                  placeholder="Application Method"
                  style="bg-[#F8FAFC]"
                />
              </div>
            </div>
            <Button
              className="ml-3 bg-[#263238] hover:bg-[#3f4f56] px-8 mb-10 w-[150px] font-lato font-semibold "
              type="submit"
            >{isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Post Job"
            )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default JobPostingForm;
