"use client";
import CancelledContract from "@/components/CardContracts/CancelledContract";
import CompletedContract from "@/components/CardContracts/CompletedContract";
import OngoingContract from "@/components/CardContracts/OngoingContract";
import PendingContract from "@/components/CardContracts/PendingContract";
import { useState, useEffect } from "react";
import { Contracts } from "@/types/contracts";

interface ContractState {
  count: number;
  totalAmount: number;
  contracts: Contracts[];
}

export default function Home() {
  const [completedContracts, setCompletedContracts] = useState<ContractState>({
    count: 0,
    totalAmount: 0,
    contracts: [],
  });

  const [cancelledContracts, setCancelledContracts] = useState<ContractState>({
    count: 0,
    totalAmount: 0,
    contracts: [],
  });

  const [ongoingContracts, setOngoingContracts] = useState<ContractState>({
    count: 0,
    totalAmount: 0,
    contracts: [],
  });

  const [pendingContracts, setPendingContracts] = useState<ContractState>({
    count: 0,
    totalAmount: 0,
    contracts: [],
  });

  useEffect(() => {
    // Fetch completed contracts data here
    setCompletedContracts({
      count: 15,
      totalAmount: 250000,
      contracts: [
        {
          id: "1",
          title: "Wheat Supply",
          amount: 50000,
          completionDate: "2023-03-15",
        },
        {
          id: "2",
          title: "Rice Delivery",
          amount: 75000,
          completionDate: "2023-04-22",
        },
      ],
    });

    // Fetch cancelled contracts data here
    setCancelledContracts({
      count: 3,
      totalAmount: 80000,
      contracts: [
        {
          id: "3",
          title: "Corn Supply",
          amount: 30000,
          completionDate: "2023-05-10",
        },
        {
          id: "4",
          title: "Soybean Delivery",
          amount: 50000,
          completionDate: "2023-06-05",
        },
      ],
    });

    // Fetch ongoing contracts data here
    setOngoingContracts({
      count: 5,
      totalAmount: 150000,
      contracts: [
        {
          id: "5",
          title: "Potato Supply",
          amount: 60000,
          startDate: "2023-05-01",
          expectedCompletionDate: "2023-07-15",
        },
        {
          id: "6",
          title: "Tomato Delivery",
          amount: 90000,
          startDate: "2023-05-10",
          expectedCompletionDate: "2023-08-01",
        },
      ],
    });

    // Fetch pending contracts data here
    setPendingContracts({
      count: 4,
      totalAmount: 120000,
      contracts: [
        {
          id: "7",
          title: "Carrot Supply",
          amount: 40000,
        },
        {
          id: "8",
          title: "Onion Delivery",
          amount: 80000,
        },
      ],
    });
  }, []);

  return (
    <div className="flex flex-col h-[80vh] bg-gray-100 dark:bg-gray-900 text-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CompletedContract
            completedCount={completedContracts.count}
            totalAmount={completedContracts.totalAmount}
            contracts={completedContracts.contracts}
          />
          <OngoingContract
            ongoingCount={ongoingContracts.count}
            totalAmount={ongoingContracts.totalAmount}
            contracts={ongoingContracts.contracts}
          />
          <CancelledContract
            cancelledCount={cancelledContracts.count}
            totalAmount={cancelledContracts.totalAmount}
            contracts={cancelledContracts.contracts}
          />
          <PendingContract
            pendingCount={pendingContracts.count}
            totalAmount={pendingContracts.totalAmount}
            contracts={pendingContracts.contracts}
          />
        </div>
      </div>
    </div>
  );
}
