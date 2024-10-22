"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";
import MaximizedContract from "./MaximizedContract";
import { Contract } from "@/types/contracts";

interface CancelledContractProps {
  cancelledCount: number;
  totalAmount: number;
  contracts: Contract[];
}

const CancelledContract: React.FC<CancelledContractProps> = ({
  cancelledCount,
  totalAmount,
  contracts,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      <Card
        className="relative overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl bg-gradient-to-br from-red-400 to-red-600 text-white cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsMaximized(true)}
      >
        <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <CardHeader className="relative pb-2 pt-4">
          <CardTitle className="text-xl font-bold">Cancelled Contracts</CardTitle>
          <CardDescription className="text-red-100 text-sm">Terminated agreements</CardDescription>
          <XCircle
            className={`absolute top-3 right-3 w-6 h-6 transition-all duration-300 ${
              isHovered ? "rotate-180 text-red-200" : "text-red-100"
            }`}
          />
        </CardHeader>
        <CardContent className="text-center py-3">
          <p className="text-4xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">{cancelledCount}</p>
          <p className="text-sm font-medium uppercase tracking-wide">Contracts Cancelled</p>
        </CardContent>
        <CardFooter className="justify-between items-center bg-red-500/20 py-2 px-4">
          <p className="text-sm font-medium">Total Value:</p>
          <p className="text-lg font-bold transition-all duration-300 group-hover:scale-105">₹{totalAmount.toLocaleString()}</p>
        </CardFooter>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </Card>
      {isMaximized && (
        <MaximizedContract
          contracts={contracts}
          onClose={() => setIsMaximized(false)}
          title="Cancelled Contracts"
          theme="red"
        />
      )}
    </>
  );
};

export default CancelledContract;
