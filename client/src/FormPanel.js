import React from 'react';
import './FormPanel.css';

const FormPanel = () => {
	return (
		<div className="contact-box">
			<div className="form-container">
				<h3>Prendre Contact</h3>
				<form action={""} method="post">

					<input type="text" name="fullname" placeholder="Nom complet" />
					<input type="email" name="email" placeholder="Adresse email" />
					<textarea name="message" placeholder="Votre message"></textarea>
					<button type="submit">Envoyer</button>
				</form>
			</div>
			<div className="restaurant-image">
				<img src={"./imgSrc/chilis-logo.png"} alt="Restaurant Name" />
			</div>
		</div>
	);
};

export default FormPanel;
