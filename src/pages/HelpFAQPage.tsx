import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface HelpFAQPageProps {
  onNavigate: (path: string) => void;
}

export const HelpFAQPage: React.FC<HelpFAQPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is borrowing tools on CommunityCloset completely free?',
      a: 'Yes! CommunityCloset is non-profit and community-driven ("For the people, by the people"). Borrowing items from neighbors is free, though some lenders may request a temporary refundable security deposit.'
    },
    {
      q: 'How does item pickup work in Katraj, Pune?',
      a: 'After a lender approves your borrow request, you can use the live Katraj Messages hub to arrange a safe pickup point (e.g. Rajiv Gandhi Zoological Park circle or Katraj Lake view).'
    },
    {
      q: 'What happens if a tool gets damaged during borrowing?',
      a: 'Borrowers are expected to handle items with care and return them clean. If accidental damage occurs, discuss resolution with the lender or file a dispute ticket on our Complaints page for Katraj admin assistance.'
    },
    {
      q: 'What is the Material Exchange section?',
      a: 'The Material Exchange allows neighbors to give away or trade leftover renovation materials like plywood sheets, ceramic tiles, PVC pipes, or bricks that would otherwise end up in Pune landfills.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#900C3F] flex items-center justify-center mx-auto shadow-sm border border-[#FFC0CB]">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Frequently Asked Questions</h1>
        <p className="text-xs text-gray-500">Everything you need to know about borrowing and lending in Katraj.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#FFC0CB]/80 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left font-extrabold text-sm text-gray-900 flex items-center justify-between hover:bg-[#FFF0F5]/50 transition-all"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-[#900C3F]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#FFF0F5] p-6 rounded-3xl border border-[#FFC0CB] text-center space-y-3">
        <h3 className="font-extrabold text-gray-900 text-sm">Still have questions or need assistance?</h3>
        <p className="text-xs text-gray-500">Submit a dispute or contact Katraj community admin moderators.</p>
        <button
          onClick={() => onNavigate('#complaints')}
          className="bg-[#900C3F] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow hover:bg-[#700931] transition-all"
        >
          Submit Complaint / Support Ticket
        </button>
      </div>
    </div>
  );
};
