import { FileText, Scale, AlertCircle, CheckCircle } from "lucide-react";

export default function Terms() {
    return (
        <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-12">
                <div className="flex items-center gap-4 mb-10 text-blue-600">
                    <FileText size={48} />
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Terms of Service</h1>
                </div>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Scale size={20} className="text-blue-600" /> 1. Acceptance of Terms
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            By accessing or using the WedLens platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
                        </p>
                    </section>

                    <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
                        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-amber-600" /> 2. Booking & Cancellation
                        </h2>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-amber-800 text-sm font-medium">
                                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                <span>Bookings are only confirmed once approved by the photographer and the advance payment is received.</span>
                            </li>
                            <li className="flex gap-3 text-amber-800 text-sm font-medium">
                                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                <span>Cancellation policies are set individually by photographers and must be reviewed before booking.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> 3. User Conduct
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Users agree to provide accurate information and refrain from any activity that disrupts the platform or infringes on the rights of others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> 4. Limitation of Liability
                        </h2>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            WedLens acts as a platform connecting clients and photographers. We are not responsible for the quality of final sessions or disputes arising between parties beyond our standard resolution process.
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-100 mt-12 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            Legal jurisdiction: Kerala, India • Effective Date: Feb 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
