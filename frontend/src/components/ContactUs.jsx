import React from 'react';
import { ReactDOM } from 'react-dom';
import { useForm } from 'react-hook-form';

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);

  console.log(watch('company'));

  return (
    <div class="flex content-center justify-center row-span-1 grid-cols-2">
      <section class="flex" className="text-gray-800 min-w-3xl">
        <div className="space-y-5 mt-20 mb-1">
          <h3 className="text-2xl font-bold">Get in Touch</h3>
          <p>
            We're here to help and answer any questions you might have.
            <br />
            We look forward to hearing from you!
          </p>
          <h4 className="text-xl mt-5 mb-1 font-bold ">Email Us</h4>
          <p>
            hello@cookmate.com
            <br />
            support@cookmate.com
          </p>
          <h4 className="text-xl mt-5 mb-1 font-bold ">Response Time</h4>
          <p>Usually within 24 hours, Mon-Fri, 9AM-6PM PST</p>
          <h4 className="text-xl mt-5 mb-1 font-bold ">Live Chat</h4>
          <p>Available in the app for, for quick questions.</p>
        </div>
      </section>
      <section class="flex" className=" text-gray-800 min-w-3xl">
        <div className="space-y-5 mt-20 mb-5">
          <h3 className="text-2xl font-bold">Contact Us</h3>
        </div>
        <div className="px-5 sm:w-2/3 lg:w-1/2 mx-auto">
          <div className="rounded-lg shadow-lg bg-white -mt-24 -mb-5 py-10 md:py-12 px-4 md:px-6">
            {/* Form Goes Here */}
            <form
              action="submit"
              className="p-6 border-gray-900/30 rounded-sm"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="font-medium"> Full Name</label>
              <br />
              <input
                label="Full Name"
                className="p-2 border-1 border-gray-800/40 rounded-md"
                defaultValue={'Jane Somename'}
                {...register('fullName', { required: true, maxLength: 80 })}
              />
              <br />
              <label className="font-medium"> Company </label>
              <br />
              <input
                className="p-2 border-1 border-gray-800/40 rounded-md"
                defaultValue={'Company A Inc'}
                {...register('company', { required: false, maxLength: 50 })}
              />
              <br />
              <label className="font-medium"> Email Address </label>
              <br />
              <input
                className="p-2 border-1 border-gray-800/40 rounded-md"
                defaultValue={'thecooljane@companyainc.co'}
                {...register('email', { required: true, maxLength: 50 })}
              />
              <br />
              <label className="font-medium"> Message </label>
              <br />
              <textarea
                className="p-2 border-1 border-gray-800/40 rounded-md"
                defaultValue={"I'd like to reach out to you because..."}
                {...register('message', { required: true, maxLength: 500 })}
              />
              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <p>This field is required</p>}
              <br />
              <button
                type="button"
                value="submit"
                className="px-5 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}