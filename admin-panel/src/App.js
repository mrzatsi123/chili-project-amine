import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:2099/chili';

function App() {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ title: '', price: '', image: '', imageType: 'url' });
    const [error, setError] = useState('');
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        // Fetch menu items on component mount
        fetchMenuItems().then(() => console.log('items found'));
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const validateInput = () => {
        if (!newItem.title.trim() || isNaN(newItem.price) || newItem.price <= 0 || !newItem.image) {
            setError('Please provide valid values for all fields.');
            return false;
        }
        return true;
    };

    const handleAddItem = async () => {
        setError(''); // Reset error state

        // Validate input fields
        if (!validateInput()) {
            return;
        }

        try {
            // Handle image file upload
            if (newItem.imageType === 'upload') {
                let formData = new FormData();
                formData.append('title', newItem.title);
                formData.append('price', newItem.price);
                formData.append('image', newItem.image);
                formData.append('imageType', newItem.imageType); // Make sure imageType is set

                await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else if (newItem.imageType === 'url') {
                // Handle image URL
                await axios.post(
                    `${API_BASE_URL}/upload-url`,
                    {
                        title: newItem.title,
                        price: newItem.price,
                        image: newItem.image,
                        imageType: newItem.imageType, // Make sure imageType is set
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            // Refresh the menu items after adding a new one
            await fetchMenuItems();
            setNewItem({ title: '', price: '', image: '', imageType: 'url' }); // Reset the form
        } catch (error) {
            console.error('Error adding menu item:', error);

            // Display user-friendly error message
            if (error.response) {
                setError(error.response.data.message || 'An error occurred while adding the menu item.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            // Refresh the menu items after deleting one
            await fetchMenuItems();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('An error occurred while deleting the menu item. Please try again.');
        }
    };

    const handleConfigureItem = (id) => {
        // Find the selected item by ID
        const selectedItem = menuItems.find((item) => item._id === id);
        if (selectedItem) {
            // Set the form data to the selected item's details
            setNewItem({
                title: selectedItem.title,
                price: selectedItem.price,
                image: selectedItem.image,
                imageType: selectedItem.imageType,
            });
            // Set the selected item ID for reference
            setSelectedItemId(id);
        }
    };

    const handleUpdateItem = async () => {
        setError(''); // Reset error state

        // Validate input fields
        if (!validateInput()) {
            return;
        }

        try {
            // Handle image file upload or URL update
            if (newItem.imageType === 'upload') {
                let formData = new FormData();
                formData.append('title', newItem.title);
                formData.append('price', newItem.price);
                formData.append('image', newItem.image);
                formData.append('imageType', newItem.imageType); // Make sure imageType is set

                await axios.put(`${API_BASE_URL}/update/${selectedItemId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else if (newItem.imageType === 'url') {
                await axios.put(
                    `${API_BASE_URL}/update/${selectedItemId}`,
                    {
                        title: newItem.title,
                        price: newItem.price,
                        image: newItem.image,
                        imageType: newItem.imageType, // Make sure imageType is set
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            // Reset the form and selected item ID
            setNewItem({ title: '', price: '', image: '', imageType: 'url' });
            setSelectedItemId(null);

            // Refresh the menu items after updating
            await fetchMenuItems();
        } catch (error) {
            console.error('Error updating menu item:', error);

            // Display user-friendly error message
            if (error.response) {
                setError(error.response.data.message || 'An error occurred while updating the menu item.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="App">
            <div className="admin-panel">
                <h1>Admin Panel</h1>

                {/* Add/Update Form */}
                <div className="form-container">
                    <h2>{selectedItemId ? 'Update Item' : 'Add New Item'}</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Title"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                    {newItem.imageType === 'url' ? (
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={newItem.image}
                            onChange={(e) => setNewItem({ ...newItem, image: e.target.value, imageType: 'url' })}
                        />
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                        />
                    )}
                    {selectedItemId ? (
                        <button onClick={handleUpdateItem}>Update Item</button>
                    ) : (
                        <button onClick={handleAddItem}>Add Item</button>
                    )}

                    {/* Toggle button for image input type */}
                    <button
                        onClick={() =>
                            setNewItem((prevItem) => ({
                                ...prevItem,
                                imageType: prevItem.imageType === 'url' ? 'upload' : 'url',
                            }))
                        }
                        className="toggle-image-type-button"
                    >
                        {newItem.imageType === 'url' ? 'Upload Image' : 'Image URL'}
                    </button>
                </div>

                <div>
                    <h2>Menu Items</h2>
                    {menuItems.map((item) => (
                        <div key={item._id} className="menu-item">
                            {/* Construct the URL for the image */}
                            {item.imageType === 'upload' ? (
                                <img src={`http://localhost:2099/uploads/${item.title}`} alt={item.title} />
                            ) : (
                                <img src={item.image} alt={item.title} />
                            )}

                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.price} DT</p>
                            </div>
                            <button className="delete-button" onClick={() => handleDeleteItem(item._id)}>
                                Delete
                            </button>
                            <button className="configure-button" onClick={() => handleConfigureItem(item._id)}>
                                Configure
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
