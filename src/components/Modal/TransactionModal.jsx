import React, { memo } from 'react';
import { IoMdClose } from "react-icons/io";
import {useTheme} from '../../context/ThemeContext';

const TransactionModal = memo(({ transaction, onClose }) => {

  const {isDarkMode} = useTheme()
  if (!transaction) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <>
      <div className="fixed z-50 inset-0 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left shadow-xl transform transition-all sm:align-middle sm:max-w-4xl sm:w-full sm:my-8">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <IoMdClose className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Transaction Details
              </h3>
            </div>
            {/* Modal Body - Scrollable */}
            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto px-6 py-4">
              <div className="flex flex-col space-y-6">

                {/* Transaction Summary Card */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {transaction.transactionId}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                        {transaction.date}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`
                    mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-2`}>Customer Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-md">{transaction.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Feedback</p>
                        <div className="flex items-center">
                          {transaction.customerFeedback?.rating ? (
                            <>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-5 w-5 ${i < transaction.customerFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1 text-sm text-gray-500">({transaction.customerFeedback.rating}/5)</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">No rating provided</span>
                          )}
                        </div>
                        {transaction.customerFeedback?.comment && (
                          <p className="text-sm mt-1 italic">"{transaction.customerFeedback.comment}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-2`}>Product Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Product</span>
                        <span className="text-gray-700">{transaction.product}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Category</span>
                        <span className="text-gray-700">{transaction.productCategory}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Quantity</span>
                        <span className="text-gray-700">{transaction.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Unit Price</span>
                        <span className="text-gray-700">{formatCurrency(transaction.unitPrice)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-2`}>Store & Shipping</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-500">Store</p>
                        <p className="text-md">{transaction.store.name}</p>
                        <p className="text-sm text-gray-500">{transaction.store.location} (ID: {transaction.store.storeId})</p>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-500">Sales Representative</p>
                        <p className="text-md">{transaction.salesRepresentative.name}</p>
                        <p className="text-sm text-gray-500">{transaction.salesRepresentative.department} (ID: {transaction.salesRepresentative.id})</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Shipping Method</p>
                        <p className="text-md">{transaction.shippingMethod}</p>
                        <p className="text-sm text-gray-500">Delivery Date: {transaction.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-md font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-2`}>Payment Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Payment Method</span>
                        <span className="text-gray-700">{transaction.paymentMethod}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Subtotal</span>
                        <span className="text-gray-700">{formatCurrency(transaction.paymentDetails.subtotal)}</span>
                      </div>

                      {transaction.paymentDetails.discountAmount > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-500">Discount</span>
                            <span className="text-gray-700">{formatCurrency(transaction.paymentDetails.discountAmount)}</span>
                          </div>
                          {transaction.paymentDetails.discountCode && (
                            <div className="text-right text-xs text-gray-500">Code: {transaction.paymentDetails.discountCode}</div>
                          )}
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">
                          Tax ({(transaction.paymentDetails.taxRate * 100).toFixed(2)}%)
                        </span>
                        <span className="text-gray-700">{formatCurrency(transaction.paymentDetails.taxAmount)}</span>
                      </div>

                      <div className="flex justify-between text-sm border-t pt-2 mt-2">
                        <span className="font-semibold text-gray-700">Total</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(transaction.paymentDetails.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {transaction.notes && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Additional Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">{transaction.notes}</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
            {/* Modal Footer - Fixed */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default TransactionModal;




