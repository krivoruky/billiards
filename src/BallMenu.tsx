import React from 'react';

interface BallMenuProps {
	onColorChange: (color: string) => void;
	position: { left: number; top: number };
}

const BallMenu: React.FC<BallMenuProps> = ({ onColorChange, position }) => {
	const handleColorChange = (color: string) => {
		onColorChange(color);
	};

	return (
		<div style={{ position: 'absolute', left: position.left, top: position.top }}>
			<button onClick={() => handleColorChange('red')}>Red</button>
			<button onClick={() => handleColorChange('green')}>Green</button>
			<button onClick={() => handleColorChange('blue')}>Blue</button>
		</div>
	);
};

export default BallMenu;
