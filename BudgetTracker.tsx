'use client'

import { useState, useMemo } from 'react'
import { Transaction, Budget, EXPENSE_CATEGORIES } from '@/types'

interface BudgetTrackerProps {
  budgets: Budget[]
  transactions: Transaction[]
  onAddBudget: (budget: Omit<Budget, 'id'>) => void
  onDeleteBudget: (id: string) => void
}

export default function BudgetTracker({ budgets, transactions, onAddBudget, onDeleteBudget }: BudgetTrackerProps) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      let spent = 0
      
      transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .forEach(t => {
          const transactionDate = new Date(t.date)
          const isInPeriod = budget.period === 'monthly'
            ? transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
            : transactionDate.getFullYear() === currentYear

          if (isInPeriod) {
            spent += t.amount
          }
        })

      const percentage = (spent / budget.amount) * 100
      const remaining = budget.amount - spent

      return {
        ...budget,
        spent,
        remaining: remaining > 0 ? remaining : 0,
        percentage: Math.min(percentage, 100),
        isOverBudget: spent > budget.amount,
      }
    })
  }, [budgets, transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!category || !amount) {
      alert('Please fill in all fields')
      return
    }

    onAddBudget({
      category,
      amount: parseFloat(amount),
      period,
    })

    // Reset form
    setCategory('')
    setAmount('')
  }

  return (
    <div className="space-y-6">
      {/* Add Budget Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Set Budget</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="budget-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="budget-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budget-amount" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  id="budget-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="budget-period" className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                id="budget-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Set Budget
          </button>
        </form>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Budget Overview</h2>
        
        {budgetProgress.length > 0 ? (
          <div className="space-y-6">
            {budgetProgress.map((budget) => (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{budget.category}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.period} budget</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this budget?')) {
                        onDeleteBudget(budget.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Spent: <span className={budget.isOverBudget ? 'text-red-600 font-semibold' : 'text-gray-900 font-semibold'}>
                        ${budget.spent.toFixed(2)}
                      </span>
                    </span>
                    <span className="text-gray-600">
                      Budget: <span className="text-gray-900 font-semibold">${budget.amount.toFixed(2)}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budget.isOverBudget
                          ? 'bg-red-500'
                          : budget.percentage > 80
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${budget.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {budget.isOverBudget ? (
                        <span className="text-red-600 font-semibold">
                          Over budget by ${(budget.spent - budget.amount).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-green-600">
                          ${budget.remaining.toFixed(2)} remaining
                        </span>
                      )}
                    </span>
                    <span className={`text-sm font-semibold ${
                      budget.isOverBudget ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {budget.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No budgets set</p>
            <p className="text-gray-400 text-sm mt-2">Create your first budget to start tracking</p>
          </div>
        )}
      </div>
    </div>
  )
}
