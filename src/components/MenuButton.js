import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function MenuButton() {
	return 	<Link to="/settings"> 
		<FontAwesomeIcon size="lg" icon={faBars} />
	</Link>
}
