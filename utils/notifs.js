exports.messages = {
  PENDING: order_no =>
    `Your order with order no: ${order_no}, is being assessed.`,
  FOR_DELIVERY: order_no =>
    `Your order with order no: ${order_no}, is being delivered.`,
  DELIVERED: order_no =>
    `Your order with order no: ${order_no}, is already delivered. Thank you for patronizing Jollibeee.`,
  REJECTED: order_no =>
    `Your order with order no: ${order_no}, has been cancelled.`
};
