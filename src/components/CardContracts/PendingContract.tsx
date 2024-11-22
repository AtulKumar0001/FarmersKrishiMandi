"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import MaximizedContract from "./MaximizedContract";
import { Contracts } from "@/types/contracts";

interface PendingContractProps {
  pendingCount: number;
  totalAmount: number;
  contracts: Contracts[];
}

const PendingContract: React.FC<PendingContractProps> = ({ pendingCount, totalAmount, contracts }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      <Card
        className="relative overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsMaximized(true)}
      >
        <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <CardHeader className="relative pb-2 pt-4">
          <CardTitle className="text-xl font-bold">Pending Contracts</CardTitle>
          <CardDescription className="text-yellow-100 text-sm">Awaiting approval or initiation</CardDescription>
          <Clock
            className={`absolute top-3 right-3 w-6 h-6 transition-all duration-300 ${
              isHovered ? "rotate-180 text-yellow-200" : "text-yellow-100"
            }`}
          />
        </CardHeader>
        <CardContent className="text-center py-3">
          <p className="text-4xl font-bold mb-1 transition-all duration-300 group-hover:scale-110">{pendingCount}</p>
          <p className="text-sm font-medium uppercase tracking-wide">Contracts Pending</p>
        </CardContent>
        <CardFooter className="justify-between items-center bg-yellow-500/20 py-2 px-4">
          <p className="text-sm font-medium">Total Value:</p>
          <p className="text-lg font-bold transition-all duration-300 group-hover:scale-105">₹{totalAmount.toLocaleString()}</p>
        </CardFooter>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </Card>
      {isMaximized && (
        <MaximizedContract
          contracts={contracts}
          onClose={() => setIsMaximized(false)}
          title="Pending Contracts"
          theme="yellow"
        />
      )}
    </>
  );
};

export default PendingContract;
