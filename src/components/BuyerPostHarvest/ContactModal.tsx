"use client";
import { Crop } from "@/types/crop";
import { useEffect, useRef } from "react";

interface ContactModalProps {
  farmer: Crop;
  onClose: () => void;
}

const ContactModal = ({ farmer, onClose }: ContactModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50">
      <div className="fixed inset-0 overflow-y-auto pt-20">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="bg-emerald-500 text-white p-4">
              <h2 className="text-2xl font-bold">Farmer Contact Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Name:</span>{" "}
                  {farmer.farmer_name}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Location:</span>{" "}
                  {farmer.farmer_city}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Contact:</span> +91{" "}
                  {farmer.phone_number}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  You can contact the farmer directly to discuss the crop
                  details and contract terms.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
