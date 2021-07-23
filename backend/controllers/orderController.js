import Order from '../models/orderModel.js';

// @desc Create new order
// @route POST /api/orders
// @access Private
export const addOrderItems = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
        if (!orderItems || !orderItems.length) {
            console.error('There are no order items');
            res.status(400);
            next(new Error('No order items found'));
            return;
        }

        const order = new Order({
            orderItems, user: req.user._id, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice
        })

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
    catch (error) {
        console.error(error, 'DB Error, unable to add orders');
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// @desc Get order by Id
// @route GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            console.error('Order not found');
            res.status(404);
            next(new Error('Order not found'));
            return;
        }
        res.json(order);
    }
    catch (error) {
        console.error(error, 'DB Error, unable to find order');
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
export const updateOrderToPaid = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            console.error('Order not found');
            res.status(404);
            next(new Error('Order not found'));
            return;
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        console.error(error, 'DB Error, unable to update order');
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({user:req.user._id});
        res.json(orders)
    }
    catch (error) {
        console.error(error, 'DB Error, unable to update order');
        res.status(500).json({ message: "Internal Server Error" });
    }
}