// Pong Game Implementation
class PongGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.gameRunning = false;
        this.playerScore = 0;
        this.computerScore = 0;
        
        // Paddles
        this.paddleHeight = 80;
        this.paddleWidth = 10;
        this.paddleSpeed = 5;
        
        this.playerPaddle = {
            x: 20,
            y: this.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: this.paddleSpeed
        };
        
        this.computerPaddle = {
            x: this.width - 20 - this.paddleWidth,
            y: this.height / 2 - this.paddleHeight / 2,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: this.paddleSpeed * 0.8
        };
        
        // Ball
        this.ball = {
            x: this.width / 2,
            y: this.height / 2,
            radius: 8,
            speedX: 4,
            speedY: 4
        };
        
        // Input handling
        this.keys = {};
        this.setupInputs();
        
        // Start game loop
        this.gameLoop();
    }
    
    setupInputs() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Start game with spacebar
            if (e.code === 'Space' && !this.gameRunning) {
                this.startGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.updateGameStatus('Game Running!');
        this.resetBall();
    }
    
    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 4;
        this.ball.speedY = (Math.random() > 0.5 ? 1 : -1) * 2;
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // Update player paddle
        if (this.keys['w'] || this.keys['arrowup']) {
            this.playerPaddle.y = Math.max(0, this.playerPaddle.y - this.playerPaddle.speed);
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.playerPaddle.y = Math.min(this.height - this.paddleHeight, this.playerPaddle.y + this.playerPaddle.speed);
        }
        
        // Update computer paddle (simple AI)
        const paddleCenter = this.computerPaddle.y + this.paddleHeight / 2;
        const ballCenter = this.ball.y;
        
        if (paddleCenter < ballCenter - 10) {
            this.computerPaddle.y = Math.min(this.height - this.paddleHeight, this.computerPaddle.y + this.computerPaddle.speed);
        } else if (paddleCenter > ballCenter + 10) {
            this.computerPaddle.y = Math.max(0, this.computerPaddle.y - this.computerPaddle.speed);
        }
        
        // Update ball
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= this.height) {
            this.ball.speedY = -this.ball.speedY;
        }
        
        // Ball collision with paddles
        if (this.checkCollision(this.ball, this.playerPaddle) || this.checkCollision(this.ball, this.computerPaddle)) {
            this.ball.speedX = -this.ball.speedX;
            // Add some randomness to make it more interesting
            this.ball.speedY += (Math.random() - 0.5) * 2;
        }
        
        // Ball out of bounds
        if (this.ball.x <= 0) {
            this.computerScore++;
            this.updateScore();
            this.resetBall();
            this.gameRunning = false;
            this.updateGameStatus('Computer scores! Press SPACE to continue');
        } else if (this.ball.x >= this.width) {
            this.playerScore++;
            this.updateScore();
            this.resetBall();
            this.gameRunning = false;
            this.updateGameStatus('You score! Press SPACE to continue');
        }
    }
    
    checkCollision(ball, paddle) {
        return ball.x - ball.radius < paddle.x + paddle.width &&
               ball.x + ball.radius > paddle.x &&
               ball.y - ball.radius < paddle.y + paddle.height &&
               ball.y + ball.radius > paddle.y;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0e14';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw center line
        this.ctx.strokeStyle = 'rgba(43, 188, 138, 0.3)';
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw paddles
        this.ctx.fillStyle = '#2bbc8a';
        this.ctx.fillRect(this.playerPaddle.x, this.playerPaddle.y, this.playerPaddle.width, this.playerPaddle.height);
        this.ctx.fillRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.width, this.computerPaddle.height);
        
        // Draw ball
        this.ctx.fillStyle = '#64ffda';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add glow effect to ball
        this.ctx.shadowColor = '#64ffda';
        this.ctx.shadowBlur = 15;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateScore() {
        document.getElementById('playerScore').textContent = this.playerScore;
        document.getElementById('computerScore').textContent = this.computerScore;
    }
    
    updateGameStatus(status) {
        document.getElementById('gameStatus').textContent = status;
    }
}

// Modal functions
function startPong() {
    document.getElementById('pongModal').style.display = 'block';
    
    // Initialize game after modal is shown
    setTimeout(() => {
        const canvas = document.getElementById('pongCanvas');
        if (!window.pongGame) {
            window.pongGame = new PongGame(canvas);
        }
    }, 100);
}

function closePong() {
    document.getElementById('pongModal').style.display = 'none';
    if (window.pongGame) {
        window.pongGame.gameRunning = false;
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('pongModal');
    if (event.target === modal) {
        closePong();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePong();
    }
});
