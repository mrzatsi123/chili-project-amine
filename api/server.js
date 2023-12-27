const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const PORT = 2099;

const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chili', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to the database'))
    .catch((error) => console.error('Error connecting to the database:', error));



// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        // Use the title + original extension as the filename
        cb(null, req.body.title + fileExtension);
    },
});
const upload = multer({ storage: storage });

// Serve images statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Define the MenuItem model
const MenuItem = require('./models/MenuItem');

// Routes
app.get('/chili', async (req, res) => {
    try {
        const chili = await MenuItem.find();
        res.json(chili);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/chili/upload-url', async (req, res) => {
    try {
        const chili = new MenuItem({
            title: req.body.title,
            price: req.body.price,
            image: req.body.image,
            imageType: 'url', // Indicate that it's a URL
        });
        await chili.save();
        res.json(chili);
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/chili/upload', upload.single('image'), async (req, res) => {
    try {
        let imageSource;

        if (req.file) {
            // If a file is uploaded, construct the URL
            imageSource = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            // If a URL is provided, use it directly
            imageSource = req.body.image;
        } else {
            throw new Error('No image or URL provided');
        }

        const chili = new MenuItem({
            title: req.body.title,
            price: req.body.price,
            image: imageSource,
            imageType: 'url', // Indicate that it's a URL
        });
        await chili.save();
        res.json(chili);
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/chili/delete/:id', async (req, res) => {
    try {
        const result = await MenuItem.findByIdAndDelete(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/chili/update/:id', async (req, res) => {
    try {
        const result = await MenuItem.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                price: req.body.price,
                image: req.body.image,
                imageType: 'url', // Indicate that it's a URL
            },
            { new: true }
        );
        res.json(result);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
