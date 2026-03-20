import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { PiChefHatBold } from "react-icons/pi";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = data => console.log(data);

  console.log(watch('company'));

  return (
    <section className="px-20 py-10">
      <div className="flex justify-between items-center text-gray-800 min-w-3xl">
        {/* Feature Section */}
        <ul className="space-y-5 mb-10 list-none">
          <h2 className='text-4xl mt-2 mb-10 font-semibold'>Get In Touch</h2>
          <h3>We're here to help and answer any questions you might have. We look forward to hearing from you!</h3>
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <FaEnvelope className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Email Us</b>
                <p>hello@chefmate.com</p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <IoMdPerson className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Response Time</b>
                <p>Usually within 24 hours</p>
                <p>Mon-Fri, 9AM-6PM PST</p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex justify-start align-center gap-3">
              <div className="flex justify-center items-center p-3 rounded-full bg-amber-100">
                <PiChefHatBold className="m-auto text-gray-900/50 text-3xl" />
              </div>
              <div>
                <b>Live Chat</b>
                <p>Plan your meals and generate shopping lists automatically</p>
              </div>
            </div>
          </li>
        </ul>
        <div className="flex text-gray-800">

          <div className="rounded-lg shadow-lg border-2 border-gray-500/30 bg-white py-10 md:py-12 px-4 md:px-6">
            {/* Form Goes Here */}
            <h3 className="text-2xl font-bold mx-2">Send Us a Message</h3>
            <form
              action="submit"
              className="p-6 rounded-sm"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="font-medium"> Full Name</label>
              <br />
              <input
                label="Full Name"
                className="p-2 border border-gray-800/40 rounded-md"
                defaultValue={'Jane Somename'}
                {...register('fullName', { required: true, maxLength: 80 })}
              />
              <br />
              <label className="font-medium"> Company </label>
              <br />
              <input
                className="p-2 border border-gray-800/40 rounded-md"
                defaultValue={'Company A Inc'}
                {...register('company', { required: false, maxLength: 50 })}
              />
              <br />
              <label className="font-medium"> Email Address </label>
              <br />
              <input
                className="p-2 border border-gray-800/40 rounded-md"
                defaultValue={'thecooljane@companyainc.co'}
                {...register('email', { required: true, maxLength: 50 })}
              />
              <br />
              <label className="font-medium"> Message </label>
              <br />
              <textarea
                className="p-2 border border-gray-800/40 rounded-md"
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
      </div>
    </section>
  );
}