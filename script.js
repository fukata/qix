// Qix Game Implementation
class QixGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.territoryPercentage = 0;
        
        // Player
        this.player = {
            x: 50,
            y: this.height - 50,
            size: 8,
            speed: 3,
            drawing: false,
            onBorder: true
        };
        
        // Drawing line
        this.currentLine = [];
        this.drawnLines = [];
        
        // Territory (claimed areas)
        this.territory = [];
        this.borders = this.initializeBorders();
        
        // Qix enemy
        this.qix = {
            x: this.width / 2,
            y: this.height / 2,
            vx: 2,
            vy: 1.5,
            size: 15,
            trail: []
        };
        
        // Sparks (border enemies)
        this.sparks = [
            { x: 100, y: 50, direction: 1, speed: 1, onBorder: true },
            { x: this.width - 100, y: this.height - 50, direction: -1, speed: 1.2, onBorder: true }
        ];
        
        this.initializeEventListeners();
        this.initializeUI();
    }
    
    initializeBorders() {
        const borders = [];
        // Top border
        for (let x = 0; x < this.width; x += 5) {
            borders.push({ x, y: 50 });
        }
        // Bottom border
        for (let x = 0; x < this.width; x += 5) {
            borders.push({ x, y: this.height - 50 });
        }
        // Left border
        for (let y = 50; y < this.height - 50; y += 5) {
            borders.push({ x: 50, y });
        }
        // Right border
        for (let y = 50; y < this.height - 50; y += 5) {
            borders.push({ x: this.width - 50, y });
        }
        return borders;
    }
    
    initializeEventListeners() {
        // Keyboard controls
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleDrawing();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button controls
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
    }
    
    initializeUI() {
        this.updateUI();
    }
    
    startGame() {
        this.gameRunning = true;
        this.gamePaused = false;
        document.getElementById('startButton').disabled = true;
        document.getElementById('pauseButton').disabled = false;
        this.gameLoop();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseButton').textContent = this.gamePaused ? '再開' : '一時停止';
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.territoryPercentage = 0;
        this.player.x = 50;
        this.player.y = this.height - 50;
        this.player.drawing = false;
        this.player.onBorder = true;
        this.currentLine = [];
        this.drawnLines = [];
        this.territory = [];
        this.qix.x = this.width / 2;
        this.qix.y = this.height / 2;
        this.qix.vx = 2;
        this.qix.vy = 1.5;
        this.qix.trail = [];
        
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
        document.getElementById('pauseButton').textContent = '一時停止';
        document.getElementById('gameOver').style.display = 'none';
        
        this.updateUI();
        this.draw();
    }
    
    toggleDrawing() {
        if (!this.gameRunning || this.gamePaused) return;
        
        if (this.player.onBorder && !this.player.drawing) {
            // Start drawing
            this.player.drawing = true;
            this.currentLine = [{ x: this.player.x, y: this.player.y }];
        } else if (this.player.drawing && this.player.onBorder) {
            // Complete the line and claim territory
            this.currentLine.push({ x: this.player.x, y: this.player.y });
            this.completeLine();
            this.player.drawing = false;
        }
    }
    
    completeLine() {
        if (this.currentLine.length < 2) return;
        
        this.drawnLines.push([...this.currentLine]);
        this.claimTerritory();
        this.currentLine = [];
        
        // Award points based on line length and risk
        const lineLength = this.calculateLineLength(this.currentLine);
        const points = Math.floor(lineLength * 10);
        this.score += points;
    }
    
    calculateLineLength(line) {
        let length = 0;
        for (let i = 1; i < line.length; i++) {
            const dx = line[i].x - line[i-1].x;
            const dy = line[i].y - line[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }
    
    claimTerritory() {
        // Simple territory claiming: add rectangular areas
        // In a full implementation, this would use flood fill algorithms
        const area = {
            x: Math.min(...this.currentLine.map(p => p.x)),
            y: Math.min(...this.currentLine.map(p => p.y)),
            width: Math.max(...this.currentLine.map(p => p.x)) - Math.min(...this.currentLine.map(p => p.x)),
            height: Math.max(...this.currentLine.map(p => p.y)) - Math.min(...this.currentLine.map(p => p.y))
        };
        
        if (area.width > 20 && area.height > 20) {
            this.territory.push(area);
            this.calculateTerritoryPercentage();
        }
    }
    
    calculateTerritoryPercentage() {
        const totalArea = (this.width - 100) * (this.height - 100);
        const claimedArea = this.territory.reduce((sum, area) => sum + (area.width * area.height), 0);
        this.territoryPercentage = Math.min(Math.floor((claimedArea / totalArea) * 100), 100);
        
        // Bonus points for territory percentage milestones
        if (this.territoryPercentage >= 75 && this.territoryPercentage < 80) {
            this.score += 1000;
        }
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.updatePlayer();
        this.updateQix();
        this.updateSparks();
        this.checkCollisions();
        this.updateUI();
    }
    
    updatePlayer() {
        const prevX = this.player.x;
        const prevY = this.player.y;
        
        // Player movement
        if (this.keys['ArrowLeft']) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight']) {
            this.player.x += this.player.speed;
        }
        if (this.keys['ArrowUp']) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown']) {
            this.player.y += this.player.speed;
        }
        
        // Boundary checking
        this.player.x = Math.max(50, Math.min(this.width - 50, this.player.x));
        this.player.y = Math.max(50, Math.min(this.height - 50, this.player.y));
        
        // Check if player is on border
        const onBorder = (
            this.player.x <= 55 || this.player.x >= this.width - 55 ||
            this.player.y <= 55 || this.player.y >= this.height - 55
        );
        
        this.player.onBorder = onBorder;
        
        // Add to current line if drawing
        if (this.player.drawing && (this.player.x !== prevX || this.player.y !== prevY)) {
            this.currentLine.push({ x: this.player.x, y: this.player.y });
        }
    }
    
    updateQix() {
        // Move Qix
        this.qix.x += this.qix.vx;
        this.qix.y += this.qix.vy;
        
        // Bounce off boundaries (inside the play area)
        if (this.qix.x <= 70 || this.qix.x >= this.width - 70) {
            this.qix.vx *= -1;
        }
        if (this.qix.y <= 70 || this.qix.y >= this.height - 70) {
            this.qix.vy *= -1;
        }
        
        // Add to trail
        this.qix.trail.push({ x: this.qix.x, y: this.qix.y });
        if (this.qix.trail.length > 20) {
            this.qix.trail.shift();
        }
        
        // Occasionally change direction
        if (Math.random() < 0.02) {
            this.qix.vx += (Math.random() - 0.5) * 0.5;
            this.qix.vy += (Math.random() - 0.5) * 0.5;
            // Limit speed
            const speed = Math.sqrt(this.qix.vx * this.qix.vx + this.qix.vy * this.qix.vy);
            if (speed > 3) {
                this.qix.vx = (this.qix.vx / speed) * 3;
                this.qix.vy = (this.qix.vy / speed) * 3;
            }
        }
    }
    
    updateSparks() {
        this.sparks.forEach(spark => {
            // Move along borders
            if (spark.y <= 55) {
                // Top border
                spark.x += spark.direction * spark.speed;
                if (spark.x <= 50 || spark.x >= this.width - 50) {
                    spark.direction *= -1;
                }
            } else {
                // Bottom border
                spark.x += spark.direction * spark.speed;
                if (spark.x <= 50 || spark.x >= this.width - 50) {
                    spark.direction *= -1;
                }
            }
        });
    }
    
    checkCollisions() {
        // Check collision with Qix
        const qixDist = Math.sqrt(
            (this.player.x - this.qix.x) ** 2 + (this.player.y - this.qix.y) ** 2
        );
        
        if (qixDist < this.player.size + this.qix.size) {
            this.loseLife();
            return;
        }
        
        // Check collision with Qix trail while drawing
        if (this.player.drawing) {
            for (const trailPoint of this.qix.trail) {
                const dist = Math.sqrt(
                    (this.player.x - trailPoint.x) ** 2 + (this.player.y - trailPoint.y) ** 2
                );
                if (dist < this.player.size + 5) {
                    this.loseLife();
                    return;
                }
            }
        }
        
        // Check collision with sparks
        for (const spark of this.sparks) {
            const sparkDist = Math.sqrt(
                (this.player.x - spark.x) ** 2 + (this.player.y - spark.y) ** 2
            );
            if (sparkDist < this.player.size + 8) {
                this.loseLife();
                return;
            }
        }
        
        // Check if Qix touches current line
        if (this.player.drawing) {
            for (const point of this.currentLine) {
                const dist = Math.sqrt(
                    (point.x - this.qix.x) ** 2 + (point.y - this.qix.y) ** 2
                );
                if (dist < this.qix.size + 5) {
                    this.loseLife();
                    return;
                }
            }
        }
    }
    
    loseLife() {
        this.lives--;
        this.player.drawing = false;
        this.currentLine = [];
        
        // Reset player position
        this.player.x = 50;
        this.player.y = this.height - 50;
        this.player.onBorder = true;
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalTerritory').textContent = this.territoryPercentage;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('startButton').disabled = false;
        document.getElementById('pauseButton').disabled = true;
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('territory').textContent = this.territoryPercentage;
        document.getElementById('lives').textContent = this.lives;
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw borders
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(50, 50, this.width - 100, this.height - 100);
        
        // Draw territory
        this.ctx.fillStyle = 'rgba(76, 205, 196, 0.3)';
        this.territory.forEach(area => {
            this.ctx.fillRect(area.x, area.y, area.width, area.height);
        });
        
        // Draw completed lines
        this.ctx.strokeStyle = '#4ecdc4';
        this.ctx.lineWidth = 2;
        this.drawnLines.forEach(line => {
            if (line.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(line[0].x, line[0].y);
                for (let i = 1; i < line.length; i++) {
                    this.ctx.lineTo(line[i].x, line[i].y);
                }
                this.ctx.stroke();
            }
        });
        
        // Draw current line
        if (this.currentLine.length > 1) {
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentLine[0].x, this.currentLine[0].y);
            for (let i = 1; i < this.currentLine.length; i++) {
                this.ctx.lineTo(this.currentLine[i].x, this.currentLine[i].y);
            }
            this.ctx.stroke();
        }
        
        // Draw Qix trail
        this.ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
        this.ctx.lineWidth = 2;
        if (this.qix.trail.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.qix.trail[0].x, this.qix.trail[0].y);
            for (let i = 1; i < this.qix.trail.length; i++) {
                this.ctx.lineTo(this.qix.trail[i].x, this.qix.trail[i].y);
            }
            this.ctx.stroke();
        }
        
        // Draw Qix
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.qix.x, this.qix.y, this.qix.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw Qix glow effect
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(this.qix.x, this.qix.y, this.qix.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw sparks
        this.ctx.fillStyle = '#ffff00';
        this.sparks.forEach(spark => {
            this.ctx.beginPath();
            this.ctx.arc(spark.x, spark.y, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw player
        this.ctx.fillStyle = this.player.onBorder ? '#4ecdc4' : (this.player.drawing ? '#ff6b6b' : '#ffffff');
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player indicator
        if (this.player.drawing) {
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x, this.player.y, this.player.size + 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new QixGame();
    game.draw();
});

// Global function for game over button
function resetGame() {
    if (game) {
        game.resetGame();
    }
}