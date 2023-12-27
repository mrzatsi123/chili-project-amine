
import './WelcomingPanel.css';
import React, { useRef } from 'react';
import Menu from "./Menu";

const FirstPanel = () => {
	const menuRef = useRef(null);

	const handleSeeMoreClick = () => {
		if (menuRef.current) {
			menuRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	return (
		<div>
		<div id="mainContainer">
			<div id="textContent">
				<p id="restaurantName">Chili's Tunisie</p>
				<p id="frontDescription">
					Découvrez les<br />
					meilleures recettes<br />
					syriennes<br />
				</p>
				<button id="seeMoreButton" className="menuButton" onClick={handleSeeMoreClick}>
					See More
				</button>
			</div>

			{/* Pass the menuRef to the Menu component */}

		</div>
			<Menu menuRef={menuRef} />
		</div>

	);
};

export default FirstPanel;