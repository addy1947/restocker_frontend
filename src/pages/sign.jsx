import React, { useState } from "react";
import axios from "axios";

const Sign = () => {
    const [step, setStep] = useState("email"); // email → otp → password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Submit email → send OTP
    const handleEmailSubmit = async () => {
        setError("");
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Enter a valid email.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/api/send-otp", { email }); // backend: send OTP
            setStep("otp");
        } catch (err) {
            setError("Failed to send OTP. Try again.");
        }
        setLoading(false);
    };

    // Step 2: Submit OTP → verify
    const handleOtpSubmit = async () => {
        setError("");
        if (otp.length !== 6) {
            setError("Enter a valid 6-digit OTP.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/api/verify-otp", { email, otp }); // backend: check OTP
            setStep("password");
        } catch (err) {
            setError("Invalid OTP. Try again.");
        }
        setLoading(false);
    };

    // Step 3: Submit password → save it
    const handlePasswordSubmit = async () => {
        setError("");
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await axios.post("/api/save-password", { email, password }); // backend: save password
            alert("Signup/Login successful!");
            setStep("email");
            setEmail("");
            setOtp("");
            setPassword("");
        } catch (err) {
            setError("Failed to save password. Try again.");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Login / Signup</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">{error}</div>
                )}

                {step === "email" && (
                    <>
                        <input
                            type="email"
                            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            onClick={handleEmailSubmit}
                            disabled={loading}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            {loading ? "Sending..." : "Next"}
                        </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                            onClick={handleOtpSubmit}
                            disabled={loading}
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}

                {step === "password" && (
                    <>
                        <input
                            type="password"
                            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            onClick={handlePasswordSubmit}
                            disabled={loading}
                            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
                        >
                            {loading ? "Saving..." : "Save Password"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sign;
