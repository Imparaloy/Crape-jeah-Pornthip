import Order from "../models/Order.js";
import Menu from "../models/Menu.js";
import Topping from "../models/Topping.js";

export async function getSalesData() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const orders = await Order.find({ status: "completed" }).lean();

  let totalSales = 0;
  let todaySales = 0;
  let totalOrders = 0;
  let totalOrdersToday = 0;

  const menuMap = {};
  const toppingMap = {};
  const details = [];

  orders.forEach((order) => {
    totalSales += order.totalPrice;
    totalOrders++;

    if (order.createdAt >= todayStart) {
      todaySales += order.totalPrice;
      totalOrdersToday++;
    }

    order.items.forEach((item) => {
      // รวมเมนู
      if (!menuMap[item.nameSnap]) menuMap[item.nameSnap] = 0;
      menuMap[item.nameSnap] += item.linePrice;

      // รายละเอียดเมนู
      details.push({
        category: "แป้ง",
        name: item.nameSnap,
        amount: item.quantity,
        price: item.linePrice,
      });

      // รวม topping
      item.toppings.forEach((top) => {
        if (!toppingMap[top.nameSnap]) toppingMap[top.nameSnap] = 0;
        toppingMap[top.nameSnap] += top.priceSnap;

        // รายละเอียด topping
        details.push({
          category: "ท้อปปิ้ง",
          name: top.nameSnap,
          amount: 1,
          price: top.priceSnap,
        });
      });
    });
  });

  const bestMenus = Object.entries(menuMap)
    .map(([name, total_price]) => ({ name, total_price }))
    .sort((a, b) => b.total_price - a.total_price);

  const bestToppings = Object.entries(toppingMap)
    .map(([name, total_price]) => ({ name, total_price }))
    .sort((a, b) => b.total_price - a.total_price);

  return {
    summary: {
      total_sales: totalSales,
      today_sales: todaySales,
      total_orders: totalOrders,
      total_orders_today: totalOrdersToday,
    },
    bestMenus,
    bestToppings,
    details,
  };
}
