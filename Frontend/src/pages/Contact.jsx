import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export default function Contact() {
    return (
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Get in <span className="text-blue-600 italic">Touch</span></h1>
                <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                    Have questions about your booking or want to join as a professional?
                    Our dedicated support team is here to help you preserve your special moments.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Contact Information */}
                <div className="space-y-8 animate-slide-in-left">
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                        <h2 className="text-2xl font-black text-gray-900 mb-8">Direct Channels</h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-blue-100">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Terminal</p>
                                    <p className="text-lg font-bold text-gray-800">ahammednihad02@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-blue-100">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Line</p>
                                    <p className="text-lg font-bold text-gray-800">+91 9562489905</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-blue-100">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Operating Base</p>
                                    <p className="text-lg font-bold text-gray-800">Kerala, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-10 rounded-[40px] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4">Support Hours</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-2">
                                    <span className="text-gray-400">Monday — Friday</span>
                                    <span>9:00 AM - 8:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-gray-400">Weekend</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 animate-slide-in-right">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Send a Message</h2>
                    <p className="text-gray-500 text-sm font-medium mb-8">We usually respond within 24 hours.</p>

                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none appearance-none">
                                <option>General Inquiry</option>
                                <option>Booking Support</option>
                                <option>Photographer Verification</option>
                                <option>Billing & Payments</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Detail</label>
                            <textarea
                                rows="5"
                                placeholder="Tell us how we can assist you..."
                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                        >
                            <Send size={18} /> Broadcast Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
