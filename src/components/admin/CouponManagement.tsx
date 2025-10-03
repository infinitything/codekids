/**
 * Coupon Management - Create and manage discount codes
 */

import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Copy } from 'lucide-react';

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'WELCOME10', type: 'percentage', value: 10, uses: 25, maxUses: 100, active: true },
    { id: '2', code: 'SUMMER50', type: 'fixed', value: 50, uses: 5, maxUses: 50, active: true },
    { id: '3', code: 'STUDENT25', type: 'percentage', value: 25, uses: 100, maxUses: null, active: false },
  ]);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
          <p className="text-sm text-gray-600">Create and manage discount codes</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <span className="font-mono font-bold text-lg">{coupon.code}</span>
              </div>
              {coupon.active ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Inactive</span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uses:</span>
                <span className="font-semibold">
                  {coupon.uses} / {coupon.maxUses || '∞'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: coupon.maxUses ? `${(coupon.uses / coupon.maxUses) * 100}%` : '50%' }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => copyCoupon(coupon.code)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

