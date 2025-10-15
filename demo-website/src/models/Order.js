import mongoose from "mongoose";

// Lightweight counter model defined inline to auto-increment order numbers
const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // sequence name, e.g. 'orderNumber'
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

// Reuse existing model if already compiled (helps during hot reloads)
const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

const OrderToppingSchema = new mongoose.Schema(
  {
    toppingId: { type: mongoose.Schema.Types.ObjectId, ref: "Topping" },
    nameSnap: { type: String, required: true },
    priceSnap: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: false,
    },
    nameSnap: { type: String, required: true },
    unitPriceSnap: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    toppings: { type: [OrderToppingSchema], default: [] },
    detailsSnap: { type: String },
    linePrice: { type: Number, required: true, min: 0 }, // คำนวณรวม
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Sequential visible order number (1,2,3,...) assigned at creation time
  // Keep schema permissive for existing documents; we enforce uniqueness via a partial index below
  orderNumber: { type: Number, index: true },
    items: { type: [OrderItemSchema], default: [] },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "preparing", "completed"],
      default: "pending",
    },
    note: String,
  },
  { timestamps: true }
);

// Assign next sequence number on first save
OrderSchema.pre("save", async function (next) {
  try {
    if (this.isNew && (this.orderNumber === undefined || this.orderNumber === null)) {
      const updated = await Counter.findByIdAndUpdate(
        "orderNumber",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.orderNumber = updated.seq;
    }
    next();
  } catch (err) {
    next(err);
  }
});

OrderSchema.index({ userId: 1, createdAt: -1 });
// Ensure uniqueness only for documents that already have orderNumber
OrderSchema.index(
  { orderNumber: 1 },
  { unique: true, partialFilterExpression: { orderNumber: { $exists: true } } }
);
export default mongoose.model("Order", OrderSchema);
