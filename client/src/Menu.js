import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu = ({ menuRef }) => {
	const [menuItems, setMenuItems] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch('http://localhost:2099/chili');
				if (!response.ok) {
					throw new Error('Failed to fetch menu items');
				}

				const data = await response.json();
				setMenuItems(data);
			} catch (error) {
				console.error('Error fetching menu items:', error);
			}
		})();
	}, []);

	return (
		<section id="menu" ref={menuRef}>
			<h1 className="notre-menu">Notre Menu</h1>
			<hr className="line" />
			<ul>
				{menuItems.map((item) => (
					<li key={item._id}>
						<div className="menu-item">
							{/* Check the imageType property to determine how to construct the image source */}
							{item.imageType === 'upload' ? (
								<img src={item.image} alt={item.title} />
							) : (
								<img src={item.image} alt={item.title} />
							)}
							<h3 id={"item-name"}>{item.title}</h3>
							<p id={"item-price"}>{item.price} DT</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};

export default Menu;
