const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Service = require('./models/Service');
const Request = require('./models/Request');
const authenticateToken = require('./middleware/auth');
const protectedRoutes = require('./ProtectedRoute');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend's origin
    credentials: true,
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/GardenDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// JWT Secret
const JWT_SECRET = 'HiGuys';

// Multer setup for file uploads (service images)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Admin Route Protection
function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Admin access only');
    }
    next();
}

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error signing up');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const role = (username === 'nsatyasaicharan@gmail.com') ? 'admin' : 'user';
        const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, message: `${role === 'admin' ? 'Admin' : 'Login'} successful` });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Handle Service Request (User)
app.post('/request-service', authenticateToken, async (req, res) => {
    const { serviceId, phoneNumber, email, area, specialRequests } = req.body;

    try {
        // Find the service to get the action fields and cost
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).send('Service not found');

        const newRequest = new Request({
            userId: req.user.id,
            serviceId: service._id,
            phoneNumber,
            email,
            area,
            specialRequests,
            actionOne: service.actionOne, // Pull from the found service
            actionTwo: service.actionTwo, // Pull from the found service
            cost: service.cost, // Pull from the found service
            Date: service.createdAt
        });

        await newRequest.save();
        sendNotification(req.user.id, 'Your service request has been received!');

        res.status(201).send('Request sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error requesting service');
    }
});

// Fetch All Requests (Admin Only)
app.get('/review-orders', authenticateToken, adminOnly, async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('userId', 'email username') // Populate user details
            .populate('serviceId', 'serviceName') // Populate service details
            .exec();

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).send('Error retrieving requests: ' + error.message);
    }
});

// Accept Order
// app.post('/accept-order/:orderId', authenticateToken, adminOnly, async (req, res) => {
//     const { orderId } = req.params;
//     try {
//         const request = await Request.findById(orderId);
//         if (!request) return res.status(404).send('Request not found');

//         request.status = 'Accepted';
//         await request.save();

//         sendNotification(request.userId, 'Your order has been accepted!');

//         res.status(200).json({ message: 'Order accepted successfully' });
//     } catch (error) {
//         console.error('Error accepting order:', error); // Log the detailed error
//         res.status(500).send('Error accepting order');
//     }
// });


// // Reject Order
// app.post('/reject-order/:orderId', authenticateToken, adminOnly, async (req, res) => {
//     const { orderId } = req.params;
//     try {
//         const request = await Request.findById(orderId);
//         if (!request) return res.status(404).send('Request not found');

//         request.status = 'Rejected';
//         await request.save();

//         sendNotification(request.userId, 'Your order has been rejected!');

//         res.status(200).json({ message: 'Order rejected successfully' });
//     } catch (error) {
//         res.status(500).send('Error rejecting order');
//     }
// });
app.post('/accept-order/:orderId', authenticateToken, adminOnly, async (req, res) => {
    const { orderId } = req.params;
    try {
        const request = await Request.findById(orderId);
        if (!request) return res.status(404).send('Request not found');

        request.status = 'Accepted'; // Change the status to 'Accepted'
        await request.save();

        sendNotification(request.userId, 'Your order has been accepted!');
        res.status(200).json({ message: 'Order accepted successfully' });
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).send('Error accepting order: ' + error.message);
    }
});

app.post('/reject-order/:orderId', authenticateToken, adminOnly, async (req, res) => {
    const { orderId } = req.params;
    try {
        const request = await Request.findById(orderId);
        if (!request) return res.status(404).send('Request not found');

        request.status = 'Rejected'; // Change the status to 'Rejected'
        await request.save();

        sendNotification(request.userId, 'Your order has been rejected!');
        res.status(200).json({ message: 'Order rejected successfully' });
    } catch (error) {
        console.error('Error rejecting order:', error);
        res.status(500).send('Error rejecting order: ' + error.message);
    }
});


// Fetch User Orders
app.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user.id); // Log the user ID
        const orders = await Request.find({ userId: req.user.id })
            .populate('serviceId') // Ensure this is the correct field
            .select('status createdAt serviceId')
            .exec();

        console.log('Fetched orders:', orders); // Log the fetched orders

        const formattedOrders = orders.map(order => ({
            serviceName: order.serviceId?.serviceName || 'Unknown Service',
            actionOne: order.serviceId?.actionOne || 'N/A',
            actionTwo: order.serviceId?.actionTwo || 'N/A',
            cost: order.serviceId?.cost || 'N/A',
            status: order.status || 'Pending',
            createdAt: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown Date',
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        console.error('Error retrieving orders:', error); // Log the error
        res.status(500).send('Error retrieving orders: ' + error.message);
    }
});

// Add Service (Admin Only)
app.post('/add-service', authenticateToken, adminOnly, upload.single('image'), async (req, res) => {
    const { serviceName, actionOne, actionTwo, cost } = req.body;
    const image = req.file ? req.file.filename : '';

    try {
        const newService = new Service({ serviceName, actionOne, actionTwo, image, cost });
        await newService.save();
        res.status(201).send('Service added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding service');
    }
});

app.post('/book-service', async (req, res) => {
    const { phoneNumber, email, area, specialRequests } = req.body;

    // Validation logic here if necessary

    const newBooking = new Booking({
        phoneNumber,
        email,
        area,
        specialRequests,
    });

    try {
        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        res.status(500).send('Error creating booking: ' + error.message);
    }
});

// Fetch All Services (For User)
app.get('/services', async (req, res) => { // Removed authenticateToken
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error retrieving services:', error); // Log the error
        res.status(500).send('Error retrieving services');
    }
});

// Include protected routes
app.use('/api', protectedRoutes);

// Notification Functionality (Placeholder)
function sendNotification(userId, message) {
    console.log(`Notification to User ${userId}: ${message}`);
    // Implement actual notification logic, such as sending an email or using a messaging service.
}

// Server Listening on Port
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
