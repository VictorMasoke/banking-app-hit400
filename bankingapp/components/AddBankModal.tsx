"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CreateAccountForm from "@/components/CreateAccountForm";

export default function AddBankModal({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Link
        href="#"
        className="flex gap-2 items-center"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <Image
          src="/icons/plus.svg"
          width={20}
          height={20}
          alt="plus"
          className="filter-blue-500"
        />
        <h2 className="text-14 font-semibold text-gray-600">Add Bank</h2>
      </Link>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreateAccountForm onSuccess={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
