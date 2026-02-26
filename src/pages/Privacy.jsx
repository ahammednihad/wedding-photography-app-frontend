import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Privacy() {
    return (
        <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-12">
                <div className="flex items-center gap-4 mb-10 text-blue-600">
                    <Shield size={48} />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
                </div>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> 1. Data Collection
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We collect information necessary to provide our wedding photography services, including your name, email address, phone number, and event details. For photographers, we also collect professional credentials and portfolio images.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> 2. How We Use Data
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Your data is used to facilitate bookings, manage payments, and ensure a seamless connection between clients and photographers. We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                        <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Lock size={20} className="text-blue-600" /> 3. Data Security
                        </h2>
                        <p className="text-blue-800 leading-relaxed font-medium text-sm">
                            WedLens employs industry-standard security measures to protect your data. All sensitive transactions are encrypted, and access to personal data is strictly limited to authorized personnel.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> 4. Your Rights
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            You have the right to access, update, or delete your personal information at any time through your dashboard profile settings.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 mt-12">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                            Last Updated: February 2026 • WedLens Legal Team
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
