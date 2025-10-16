import mongoose from "mongoose";
import Order from "../models/Order.js";

const uiStatus = (db) =>
  db === "completed"
    ? "Served"
    : db === "cancelled"
      ? "Cancelled"
      : "In Process";

const fallbackTimeFromId = (o) => {
  try {
    return new mongoose.Types.ObjectId(o._id).getTimestamp();
  } catch {
    return null;
  }
};

const computeTotal = (o) => {
  if (typeof o.totalPrice === "number") return o.totalPrice;
  const items = Array.isArray(o.items) ? o.items : [];
  return items.reduce((sum, it) => {
    if (typeof it.linePrice === "number") return sum + it.linePrice;
    const tops = (it.toppings || []).reduce(
      (a, t) => a + (Number(t.priceSnap) || 0),
      0,
    );
    const unit = Number(it.unitPriceSnap) || 0;
    const qty = Number(it.quantity) || 0;
    return sum + (unit + tops) * qty;
  }, 0);
};

const toView = (o) => {
  const created = o.createdAt ? new Date(o.createdAt) : fallbackTimeFromId(o);
  const updated = o.updatedAt ? new Date(o.updatedAt) : created;

  const time = created
    ? created.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const updatedAtText = updated
    ? updated.toLocaleString("th-TH", { hour12: false })
    : "-";

  const items = Array.isArray(o.items) ? o.items : [];
  const mappedItems = items.map((item) => {
    const toppings = (item.toppings || [])
      .map((t) => t?.nameSnap)
      .filter(Boolean);
    const rawDetails = (item.detailsSnap || "").toString().trim();
    const detailText = rawDetails && rawDetails !== "-"
      ? rawDetails
      : toppings.length
        ? toppings.join(" + ")
        : "-";

    return {
      name: item.nameSnap || "-",
      quantity: Number(item.quantity) || 1,
      detailText,
      toppingNames: toppings,
    };
  });

  const orderNote = (o.note || "").toString().trim();
  const orderCode =
    o.orderNumber != null ? String(o.orderNumber) : String(o._id).slice(-6);

  return {
    id: String(o._id),
    idShort: String(o._id).slice(-6),
    orderNumber: o.orderNumber ?? null,
    code: orderCode,
    time,
    updatedAtText,
    price: computeTotal(o),
    items: mappedItems,
    note: orderNote,
    status: uiStatus(o.status),
  };
};

export const listOrdersAdmin = async (req, res, next) => {
  console.log("[ordersAdmin] HIT /orders");
  try {
    const activeTab = ["all", "in", "served"].includes(req.query.status)
      ? req.query.status
      : "all";

    const match =
      activeTab === "served"
        ? { status: "completed" }
        : activeTab === "in"
          ? { status: { $in: ["pending", "paid", "preparing"] } }
          : {};

    const docs = await Order.find(match)
      .select("orderNumber createdAt updatedAt items totalPrice status note")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const [total, inProcess, served] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({
        status: { $in: ["pending", "paid", "preparing"] },
      }),
      Order.countDocuments({ status: "completed" }),
    ]);

    const orders = docs.map(toView);

    console.log("[ordersAdmin] docs:", docs.length, "counters:", {
      total,
      inProcess,
      served,
    });

    res.render("order-admin", {
      orders,
      counters: { total, inProcess, served },
      activeTab,
      activePath: "/orders",
      me: req.user || null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentUiStatus } = req.body; // 'In Process' | 'Served'
    const nextDb = currentUiStatus === "In Process" ? "completed" : "preparing";

    const updated = await Order.findByIdAndUpdate(
      id,
      { status: nextDb },
      { new: true },
    ).lean();
    if (!updated)
      return res.status(404).json({ ok: false, message: "Order not found" });

    res.json({ ok: true, id: String(updated._id), status: updated.status });
  } catch (err) {
    next(err);
  }
};
