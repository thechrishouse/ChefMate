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
      <section class="flex" className="inline-grid text-gray-800 min-w-3xl">
        <div className="space-y-5 mt-20 mb-5">
          <h3 className="text-2xl font-bold">Contact Us</h3>
        </div>
        <div className="px-5 sm:w-2/3 lg:w-1/2 mx-auto">
          <div className="rounded-lg shadow-lg bg-white -mt-24 -mb-5 py-10 md:py-12 px-4 md:px-6">
            {/* Form Goes Here */}
            <form
              action="submit"
              className="p-6 border-1 border-gray-900/30 rounded-sm"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                label="Full Name"
                className="border-1"
                defaultValue={'Full Name'}
                {...register('fullName', { required: true, maxLength: 80 })}
              />
              <input
                className="border-1"
                defaultValue={'Company'}
                {...register('company', { required: false, maxLength: 50 })}
              />
              <input
                className="border-1"
                defaultValue={'Email Address'}
                {...register('email', { required: true, maxLength: 50 })}
              />
              <input
                className="border-1"
                defaultValue={'Message'}
                {...register('message', { required: true, maxLength: 500 })}
              />
              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <p>This field is required</p>}
              <input className="border-1" type="button" value="submit" />
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
