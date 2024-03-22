import React, { useEffect, useRef, useState } from 'react';

const BilliardsGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [balls, setBalls] = useState<Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }>>([]);
    const [selectedBallIndex, setSelectedBallIndex] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawBall = (x: number, y: number, radius: number, color: string) => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            balls.forEach(ball => drawBall(ball.x, ball.y, ball.radius, ball.color));
        };

        const update = () => {
            balls.forEach((ball) => {
                ball.x += ball.vx;
                ball.y += ball.vy;

                if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
                    ball.vx *= -0.9;
                }
                if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                    ball.vy *= -0.9;
                }

                balls.forEach((otherBall) => {
                    if (ball !== otherBall) {
                        const dx = otherBall.x - ball.x;
                        const dy = otherBall.y - ball.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const minDistance = ball.radius + otherBall.radius;

                        if (distance < minDistance) {
                            const angle = Math.atan2(dy, dx);
                            const targetX = ball.x + Math.cos(angle) * minDistance;
                            const targetY = ball.y + Math.sin(angle) * minDistance;
                            const ax = (targetX - otherBall.x) * 0.1;
                            const ay = (targetY - otherBall.y) * 0.1;
                            ball.vx -= ax;
                            ball.vy -= ay;
                            ball.vx *= 0.9;
                            ball.vy *= 0.9;
                        }
                    }
                });
            });

            draw();
            requestAnimationFrame(update);
        };

        update();
    }, [balls]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const initialBalls = [
            { x: 100, y: 100, vx: 0.5, vy: 0.5, radius: 20, color: 'red' },
            { x: 200, y: 200, vx: 0.3, vy: -0.3, radius: 30, color: 'blue' },
            { x: 300, y: 300, vx: -0.2, vy: 0.2, radius: 25, color: 'green' },
        ];

        setBalls(initialBalls);
    }, []);

    const handleBallClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;

        const clickedBallIndex = balls.findIndex(ball => {
            const dx = ball.x - mouseX;
            const dy = ball.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= ball.radius;
        });

        if (clickedBallIndex !== -1) {
            setSelectedBallIndex(clickedBallIndex);
            setMenuPosition({ x: mouseX, y: mouseY });
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const mouseX = event.nativeEvent.offsetX;
        const mouseY = event.nativeEvent.offsetY;

        balls.forEach(ball => {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ball.vx -= dx * 0.003;
                ball.vy -= dy * 0.003;
            }

            if (ball.x + ball.vx < ball.radius || ball.x + ball.vx > canvasRef.current!.width - ball.radius) {
                ball.vx *= -1;
            }
            if (ball.y + ball.vy < ball.radius || ball.y + ball.vy > canvasRef.current!.height - ball.radius) {
                ball.vy *= -1;
            }
        });
    };

    const handleColorChange = (color: string) => {
        if (selectedBallIndex !== null) {
            const newBalls = [...balls];
            newBalls[selectedBallIndex].color = color;
            setBalls(newBalls);
            setSelectedBallIndex(null);
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{ border: '1px solid black' }}
                width={800}
                height={600}
                onMouseDown={handleBallClick}
                onMouseMove={handleMouseMove}
            />
            {selectedBallIndex !== null && (
                <BallMenu
                    onColorChange={handleColorChange}
                    position={{ left: menuPosition.x, top: menuPosition.y }}
                />
            )}
        </div>
    );
};

const BallMenu: React.FC<{ onColorChange: (color: string) => void; position: { left: number; top: number } }> = ({ onColorChange, position }) => {
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

export default BilliardsGame;