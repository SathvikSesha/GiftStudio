"use client";
import React from "react";

function MainComponent() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailValidating, setEmailValidating] = useState(false);
  const { signUpWithCredentials, signInWithGoogle, signInWithFacebook } =
    useAuth();

  const validateEmail = async (email) => {
    try {
      setEmailValidating(true);
      const response = await fetch(
        `/integrations/email-check-2/v1/email/verify?email=${encodeURIComponent(
          email
        )}`
      );
      if (!response.ok) {
        throw new Error("Email validation failed");
      }
      const data = await response.json();
      return data.status === "deliverable";
    } catch (error) {
      console.error("Email validation error:", error);
      return true;
    } finally {
      setEmailValidating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    let newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.email && !(await validateEmail(formData.email))) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Failed to create account. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ submit: "Failed to sign up with Google. Please try again." });
    }
  };

  const handleFacebookSignup = async () => {
    try {
      await signInWithFacebook({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Facebook signup error:", error);
      setErrors({
        submit: "Failed to sign up with Facebook. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-blue-500 focus:outline-none`}
                />
                {emailValidating && (
                  <div className="absolute right-3 top-2.5">
                    <i className="fas fa-spinner fa-spin text-gray-400"></i>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:border-blue-500 focus:outline-none`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i className="fab fa-google text-[#4285f4] text-lg"></i>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookSignup}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <i className="fab fa-facebook text-[#3b5998] text-lg"></i>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;