import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  courseDuration: string;
  certificateId?: string;
  verifyUrl?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  studentName,
  courseName,
  completionDate,
  instructorName,
  courseDuration,
  certificateId = `CM-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
  verifyUrl,
}) => {
  const qrTarget = verifyUrl || (typeof window !== 'undefined' ? `${window.location.origin}/certificates/${certificateId}` : '');
  const qrSrc = qrTarget
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(qrTarget)}`
    : '';
  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      <div className="certificate-container w-full max-w-[1000px] mx-auto bg-white p-8 md:p-12 text-center relative overflow-hidden shadow-2xl print:shadow-none print:w-full print:h-[100vh] print:max-w-none print:p-12 print:flex print:flex-col print:justify-center print:m-0 print:border-0 print:box-border">
        {/* Decorative Border */}
        <div className="absolute inset-4 border-[12px] border-double border-yellow-600/30 pointer-events-none print:inset-8"></div>
        <div className="absolute inset-8 border-[2px] border-yellow-600/20 pointer-events-none print:inset-10"></div>

        {/* Corner Ornaments */}
        <div className="absolute top-4 left-4 w-24 h-24 border-t-[4px] border-l-[4px] border-yellow-600/40 rounded-tl-3xl pointer-events-none print:top-8 print:left-8 print:w-16 print:h-16"></div>
        <div className="absolute top-4 right-4 w-24 h-24 border-t-[4px] border-r-[4px] border-yellow-600/40 rounded-tr-3xl pointer-events-none print:top-8 print:right-8 print:w-16 print:h-16"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 border-b-[4px] border-l-[4px] border-yellow-600/40 rounded-bl-3xl pointer-events-none print:bottom-8 print:left-8 print:w-16 print:h-16"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 border-b-[4px] border-r-[4px] border-yellow-600/40 rounded-br-3xl pointer-events-none print:bottom-8 print:right-8 print:w-16 print:h-16"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid-pattern.svg')] pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 py-4 px-4 print:py-0 print:px-12">
          {/* Header */}
          <div className="mb-10 print:mb-4">
            <div className="flex items-center justify-center gap-3 mb-4 print:mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg print:shadow-none print:border-2 print:border-yellow-600 print:w-10 print:h-10">
                <Award className="w-6 h-6 text-white print:text-yellow-700 print:w-5 print:h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-widest uppercase print:text-xl">CodeMind</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-800 to-yellow-600 print:text-black print:bg-none print:text-5xl">
              Certificate
            </h1>
            <p className="text-xl md:text-2xl text-yellow-700 font-serif italic print:text-lg">of Completion</p>
          </div>

          {/* Body */}
          <div className="space-y-6 mb-12 print:mb-6 print:space-y-3">
            <p className="text-gray-600 text-lg uppercase tracking-widest print:text-sm">This is to certify that</p>
            
            <div className="py-2 print:py-0">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 border-b-2 border-gray-200 inline-block px-12 pb-2 min-w-[300px] print:text-4xl print:px-8">
                {studentName}
              </h2>
            </div>

            <p className="text-gray-600 text-lg print:text-sm">has successfully completed the course</p>

            <div className="py-2 print:py-0">
              <h3 className="text-3xl md:text-4xl font-bold text-indigo-900 print:text-2xl">
                {courseName}
              </h3>
            </div>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed print:text-xs">
              Demonstrating dedication and proficiency in the subject matter, completing {courseDuration} of intensive training and practical exercises.
            </p>
          </div>

          {/* Footer / Signatures */}
          <div className="flex flex-col md:flex-row justify-between items-end max-w-4xl mx-auto mt-10 gap-12 print:flex-row print:mt-4 print:gap-4 print:px-8">
            {/* Instructor Signature */}
            <div className="text-center flex-1 print:flex-none print:w-48">
              <div className="h-16 flex items-end justify-center mb-2 print:h-12">
                <span className="font-script text-3xl text-gray-800 transform -rotate-6 print:text-2xl">{instructorName}</span>
              </div>
              <div className="border-t border-gray-400 w-48 mx-auto pt-2 print:w-full">
                <p className="font-bold text-gray-900 print:text-xs">{instructorName}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider print:text-[9px]">Instructor</p>
              </div>
            </div>

            {/* Seal */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-yellow-600/30 flex items-center justify-center relative bg-white shadow-inner print:w-20 print:h-20 print:shadow-none print:border-yellow-600 print:border-2">
                <div className="absolute inset-1 border border-yellow-600/20 rounded-full print:border"></div>
                <div className="text-center">
                  <Award className="w-12 h-12 text-yellow-600 mx-auto mb-1 print:w-6 print:h-6 print:mb-0.5" />
                  <div className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest print:text-[6px] print:leading-tight">Official<br/>Certified</div>
                </div>
              </div>
            </div>

            {/* Date & ID */}
            <div className="text-center flex-1 print:flex-none print:w-48">
              <div className="h-16 flex items-end justify-center mb-2 print:h-12">
                <span className="text-xl text-gray-800 print:text-base">{completionDate}</span>
              </div>
              <div className="border-t border-gray-400 w-48 mx-auto pt-2 print:w-full">
                <p className="font-bold text-gray-900 print:text-xs">Date Issued</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono break-all print:text-[8px] print:line-clamp-2">
                  ID: {certificateId}
                </p>
              </div>
            </div>
          </div>

          {/* Verify Block */}
          {qrSrc && (
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-center gap-4 max-w-3xl mx-auto print:flex-row print:mt-4 print:pt-3 print:gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSrc}
                alt="Xác thực chứng chỉ"
                className="w-24 h-24 rounded-lg border border-gray-200 bg-white p-1 print:w-14 print:h-14"
                loading="lazy"
              />
              <div className="text-center md:text-left print:text-left">
                <div className="inline-flex items-center gap-1.5 text-emerald-700 text-xs uppercase tracking-wider font-semibold mb-1 print:text-[9px]">
                  <ShieldCheck className="w-3.5 h-3.5 print:w-3 print:h-3" /> Verified by CodeMind
                </div>
                <p className="text-xs text-gray-600 max-w-xs print:text-[9px] print:leading-snug">
                  Quét mã QR hoặc truy cập liên kết dưới đây để xác minh
                  tính hợp lệ của chứng chỉ này.
                </p>
                <p className="mt-1 text-[10px] text-gray-500 font-mono break-all max-w-xs print:hidden">
                  {qrTarget}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Certificate;
