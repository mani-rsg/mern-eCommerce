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