import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  FileQuestion,
  User,
  MessageSquare,
} from 'lucide-react';

interface ContactViewProps {
  language?: 'en' | 'hi';
}

export const ContactView: React.FC<ContactViewProps> = ({ language = 'en' }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    category: 'General Enquiry / Consumer Query',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        category: 'General Enquiry / Consumer Query',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Official Contact Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'मंत्रालय एवं सांख्यिकी कार्यालय संपर्क' : 'Ministry & Statistical Office Contact Directory'}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'आधिकारिक संपर्क एवं नागरिक सहायता केंद्र' : 'Official Contact, Public Grievance & NSO Helpdesk'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'मूल्य सांख्यिकी प्रभाग (PSD), राष्ट्रीय सांख्यिकी कार्यालय (NSO), सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)'
                : 'Price Statistics Division (PSD), National Statistical Office, Ministry of Statistics and Programme Implementation (MoSPI)'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'hi' ? 'आधिकारिक सरकारी संपर्क' : 'Verified Official Channel'}</span>
          </div>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Card 1: Official Ministry Address */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'मुख्यालय का पता' : 'Headquarters Address'}</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="block text-slate-900 dark:text-white">National Statistical Office (NSO)</strong>
              Price Statistics Division (PSD)<br />
              Sardar Patel Bhawan, Sansad Marg<br />
              New Delhi – 110001, Republic of India
            </div>
          </div>

          {/* Card 2: Email Contacts */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
              <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'ईमेल संपर्क' : 'Official Email Inquiries'}</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">CPI & Airfare Data:</span>
                <a href="mailto:cpi-nso@mospi.gov.in" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono">cpi-nso@mospi.gov.in</a>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">Public Statistics Cell:</span>
                <a href="mailto:apix-support@mospi.gov.in" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono">apix-support@mospi.gov.in</a>
              </div>
            </div>
          </div>

          {/* Card 3: Helplines */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
              <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'दूरभाष एवं हेल्पलाइन' : 'Telephone & National Helplines'}</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">MoSPI EPABX:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">+91 (11) 2374 2100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">National Consumer Helpline:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">1915 (Toll-Free)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grievance & Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Query / Feedback Form */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs transition-colors">
          <div className="pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'नागरिक सुझाव एवं पूछताछ फॉर्म' : 'Citizen Feedback & Statistical Query Form'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'हवाई किराया मूल्य सूचकांक, डेटा पद्धतियों अथवा उपभोक्ता प्रश्नों हेतु सीधे संपर्क करें'
                : 'Submit statistical data inquiries, route recommendations, or methodology questions directly to NSO Price Division.'}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {language === 'hi' ? 'आपकी पूछताछ सफलतापूर्वक दर्ज कर ली गई है!' : 'Inquiry Submitted Successfully!'}
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                {language === 'hi'
                  ? 'संदर्भ संख्या #APIX-2026-INQ उत्पन्न हो गई है। हमारी टीम 2-3 कार्य दिवसों के भीतर उत्तर देगी।'
                  : 'Acknowledgement #APIX-2026-INQ generated. The Price Statistics Division team will review and respond within 2-3 business days.'}
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                {language === 'hi' ? 'अन्य संदेश भेजें' : 'Submit Another Query'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'hi' ? 'ईमेल पता *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'पूछताछ श्रेणी *' : 'Inquiry Category *'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="General Enquiry / Consumer Query">General Citizen Enquiry / Airfare Pricing</option>
                  <option value="Macroeconomic & RBI MPC Data Request">Macroeconomic & RBI MPC Data Request</option>
                  <option value="Route Basket & PSD Weight Feedback">Route Basket & Weighting Methodology Feedback</option>
                  <option value="Media & Research Inquiry">Media, Academic & Research Inquiries</option>
                  <option value="Technical & API Support">Technical, OpenAPI & Data Pipeline Support</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'विषय *' : 'Subject *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of your query"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'संदेश / विवरण *' : 'Detailed Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your enquiry or feedback..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'संदेश भेजें' : 'Submit Official Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* National Portals & Citizen Links */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'महत्वपूर्ण सरकारी पोर्टल' : 'Related Government Portals'}</span>
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href="https://mospi.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex justify-between items-center font-medium text-slate-700 dark:text-slate-300"
              >
                <span>MoSPI Official Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://dgca.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex justify-between items-center font-medium text-slate-700 dark:text-slate-300"
              >
                <span>DGCA Civil Aviation Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex justify-between items-center font-medium text-slate-700 dark:text-slate-300"
              >
                <span>Reserve Bank of India (RBI)</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="https://pgportal.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex justify-between items-center font-medium text-slate-700 dark:text-slate-300"
              >
                <span>CPGRAMS Public Grievances</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Office Timings:</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Monday to Friday: 09:30 AM – 06:00 PM IST<br />
              Closed on National Holidays and Weekends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
