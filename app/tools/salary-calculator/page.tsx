// app/tools/salary-calculator/page.tsx
"use client";

import React, { useState } from 'react';

const SalaryCalculatorPage: React.FC = () => {
  const [annualSalary, setAnnualSalary] = useState<number>(0);
  const [currency, setCurrency] = useState('USD');
  const [monthlySalary, setMonthlySalary] = useState<number>(0);
  const [weeklySalary, setWeeklySalary] = useState<number>(0);
  const [hourlySalary, setHourlySalary] = useState<number>(0);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

  const calculateSalaries = (annual: number) => {
    setMonthlySalary(annual / 12);
    setWeeklySalary(annual / 52);
    setHourlySalary(annual / 2080); // Assuming 40 hours/week * 52 weeks
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAnnualSalary(value);
    calculateSalaries(value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Salary Calculator</h2>
      <p className="mb-6 text-gray-600">Calculate your salary breakdowns based on annual income.</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-1">
            Annual Salary
          </label>
          <div className="flex">
            <input
              type="number"
              id="annualSalary"
              value={annualSalary}
              onChange={handleSalaryChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter annual salary"
              min="0"
            />
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Monthly</h3>
            <p className="text-2xl font-bold text-blue-600">
              {currency} {monthlySalary.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Weekly</h3>
            <p className="text-2xl font-bold text-blue-600">
              {currency} {weeklySalary.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Hourly</h3>
            <p className="text-2xl font-bold text-blue-600">
              {currency} {hourlySalary.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>* Calculations assume 40 hours/week and 52 weeks/year.</p>
          <p>* This is a basic calculator. Consult a financial advisor for accurate tax and benefit calculations.</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculatorPage;