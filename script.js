// Chess Master Pro - Complete JavaScript Implementation
class ChessMasterPro {
    constructor() {
        this.currentSection = 'home';
        this.game = null;
        this.lessons = new LessonManager();
        this.puzzles = new PuzzleManager();
        this.analysis = new AnalysisManager();
        this.profile = new ProfileManager();
        this.settings = this.loadSettings();
        this.sounds = new SoundManager();
        
        this.init();
    }

    init() {
        this.initNavigation();
        this.initDemoBoard();
        this.loadUserProfile();
        this.applySettings();
        this.startBackgroundAnimation();
    }

    initNavigation() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger?.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });
    }

    initDemoBoard() {
        const demoBoard = document.getElementById('demoBoard');
        if (!demoBoard) return;

        const pieces = ['♜','♞','♝','♛','♚','♝','♞','♜'];
        const pawns = ['♟','♟','♟','♟','♟','♟','♟','♟'];

        // Create demo position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                
                // Add pieces for demo
                if (row === 0) square.textContent = pieces[col];
                else if (row === 1) square.textContent = pawns[col];
                else if (row === 6) square.textContent = pawns[col].replace('♟', '♙');
                else if (row === 7) square.textContent = pieces[col].replace(/♜|♞|♝|♛|♚/g, (match) => {
                    const whiteMap = {'♜':'♖','♞':'♘','♝':'♗','♛':'♕','♚':'♔'};
                    return whiteMap[match];
                });

                demoBoard.appendChild(square);
            }
        }

        // Animate demo pieces
        this.animateDemoBoard(demoBoard);
    }

    animateDemoBoard(board) {
        const squares = board.querySelectorAll('.square');
        let animationIndex = 0;

        setInterval(() => {
            squares.forEach(square => square.classList.remove('demo-highlight'));
            
            if (squares[animationIndex]) {
                squares[animationIndex].classList.add('demo-highlight');
                animationIndex = (animationIndex + 1) % squares.length;
            }
        }, 200);
    }

    startBackgroundAnimation() {
        // Add subtle animations and effects
        this.createFloatingChessPieces();
        this.initParallaxEffects();
    }

    createFloatingChessPieces() {
        const pieces = ['♔', '♕', '♖', '♗', '♘', '♙'];
        const container = document.body;

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const piece = document.createElement('div');
                piece.className = 'floating-piece';
                piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
                piece.style.cssText = `
                    position: fixed;
                    font-size: 2rem;
                    color: rgba(74, 144, 226, 0.1);
                    pointer-events: none;
                    z-index: -1;
                    left: ${Math.random() * 100}vw;
                    animation: float ${5 + Math.random() * 5}s linear infinite;
                `;
                
                container.appendChild(piece);
                
                setTimeout(() => piece.remove(), 10000);
            }, i * 2000);
        }
    }

    initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.parallax-element');
            
            parallax.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    loadSettings() {
        return {
            boardTheme: localStorage.getItem('boardTheme') || 'classic',
            pieceSet: localStorage.getItem('pieceSet') || 'classic',
            showCoordinates: localStorage.getItem('showCoordinates') !== 'false',
            highlightLastMove: localStorage.getItem('highlightLastMove') !== 'false',
            animatePieces: localStorage.getItem('animatePieces') !== 'false',
            playSounds: localStorage.getItem('playSounds') !== 'false',
            moveSpeed: parseInt(localStorage.getItem('moveSpeed')) || 3,
            showLegalMoves: localStorage.getItem('showLegalMoves') !== 'false',
            autoQueen: localStorage.getItem('autoQueen') !== 'false'
        };
    }

    applySettings() {
        // Apply all saved settings
        if (this.changeBoardTheme) this.changeBoardTheme(this.settings.boardTheme);
        if (this.changePieceSet) this.changePieceSet(this.settings.pieceSet);
        if (this.toggleCoordinates) this.toggleCoordinates(this.settings.showCoordinates);
        if (this.toggleLastMoveHighlight) this.toggleLastMoveHighlight(this.settings.highlightLastMove);
        if (this.toggleAnimations) this.toggleAnimations(this.settings.animatePieces);
        if (this.toggleSounds) this.toggleSounds(this.settings.playSounds);
        if (this.changeAnimationSpeed) this.changeAnimationSpeed(this.settings.moveSpeed);
    }

    loadUserProfile() {
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        this.profile.load(profile);
    }

    // Settings Methods
    changeBoardTheme(theme = 'classic') {
        this.settings.boardTheme = theme;
        localStorage.setItem('boardTheme', theme);
        // Apply theme to board if it exists
        const board = document.getElementById('chessBoard');
        if (board) {
            board.className = `chess-board theme-${theme}`;
        }
    }

    changePieceSet(pieceSet = 'classic') {
        this.settings.pieceSet = pieceSet;
        localStorage.setItem('pieceSet', pieceSet);
    }

    toggleCoordinates(show = true) {
        this.settings.showCoordinates = show;
        localStorage.setItem('showCoordinates', show.toString());
        const coords = document.querySelector('.board-coords');
        if (coords) {
            coords.style.display = show ? 'block' : 'none';
        }
    }

    toggleLastMoveHighlight(show = true) {
        this.settings.highlightLastMove = show;
        localStorage.setItem('highlightLastMove', show.toString());
    }

    toggleAnimations(enable = true) {
        this.settings.animatePieces = enable;
        localStorage.setItem('animatePieces', enable.toString());
    }

    toggleSounds(enable = true) {
        this.settings.playSounds = enable;
        localStorage.setItem('playSounds', enable.toString());
        if (this.sounds) {
            this.sounds.enabled = enable;
        }
    }

    changeAnimationSpeed(speed = 3) {
        this.settings.moveSpeed = speed;
        localStorage.setItem('moveSpeed', speed.toString());
    }
}

// Enhanced Chess Game Engine
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing';
        this.moveCount = 0;
        this.timeControl = { white: 600, black: 600 };
        this.timers = { white: null, black: null };
        this.gameMode = 'human';
        this.aiLevel = 4;
        this.lastMove = null;
        this.castlingRights = {
            white: { kingside: true, queenside: true },
            black: { kingside: true, queenside: true }
        };
        this.enPassantTarget = null;
        this.isFlipped = false;
        this.puterAI = new PuterAI();
        
        this.initializeEventListeners();
    }

    initializeBoard() {
        return [
            ['r','n','b','q','k','b','n','r'],
            ['p','p','p','p','p','p','p','p'],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            ['P','P','P','P','P','P','P','P'],
            ['R','N','B','Q','K','B','N','R']
        ];
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.deselectSquare();
            if (e.key === 'f') this.flipBoard();
            if (e.key === 'u' && e.ctrlKey) {
                e.preventDefault();
                this.undoMove();
            }
        });
    }

    renderBoard() {
        const boardElement = document.getElementById('chessBoard');
        if (!boardElement) return;

        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = this.createSquare(row, col);
                boardElement.appendChild(square);
            }
        }

        // Show legal moves for selected piece after board is rendered
        if (this.selectedSquare && document.getElementById('showLegalMoves')?.checked) {
            const legalMoves = this.getLegalMoves(this.selectedSquare.row, this.selectedSquare.col);
            legalMoves.forEach(move => {
                const targetSquare = boardElement.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
                if (targetSquare) {
                    targetSquare.classList.add('legal-move');
                }
            });
        }

        this.updateGameStatus();
        this.updateCapturedPieces();
        this.updateMoveHistory();
    }

    createSquare(row, col) {
        const displayRow = this.isFlipped ? 7 - row : row;
        const displayCol = this.isFlipped ? 7 - col : col;
        
        const square = document.createElement('div');
        square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;

        // Add piece
        const piece = this.board[row][col];
        if (piece) {
            const pieceElement = this.createPieceElement(piece);
            square.appendChild(pieceElement);
        }

        // Add event listeners
        square.addEventListener('click', () => this.handleSquareClick(row, col));

        // Highlight selected square
        if (this.selectedSquare && this.selectedSquare.row === row && this.selectedSquare.col === col) {
            square.classList.add('selected');
        }

        // Highlight last move
        if (this.lastMove) {
            if ((this.lastMove.from.row === row && this.lastMove.from.col === col) ||
                (this.lastMove.to.row === row && this.lastMove.to.col === col)) {
                square.classList.add('last-move');
            }
        }

        return square;
    }

    createPieceElement(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.draggable = true;
        
        // Unicode chess pieces
        const pieceSymbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        
        pieceElement.textContent = pieceSymbols[piece] || piece;
        return pieceElement;
    }

    handleSquareClick(row, col) {
        const piece = this.board[row][col];
        
        if (this.selectedSquare) {
            if (this.selectedSquare.row === row && this.selectedSquare.col === col) {
                this.deselectSquare();
                return;
            }
            
            if (this.attemptMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
                this.deselectSquare();
                return;
            }
        }
        
        if (piece && this.isPieceOwnedByCurrentPlayer(piece)) {
            this.selectedSquare = { row, col };
            this.renderBoard();
            if (window.chessMaster && window.chessMaster.sounds) {
                window.chessMaster.sounds.play('select');
            }
        } else {
            this.deselectSquare();
        }
    }

    attemptMove(fromRow, fromCol, toRow, toCol) {
        const legalMoves = this.getLegalMoves(fromRow, fromCol);
        const move = legalMoves.find(m => m.row === toRow && m.col === toCol);
        
        if (!move) {
            if (window.chessMaster && window.chessMaster.sounds) {
                window.chessMaster.sounds.play('illegal');
            }
            return false;
        }
        
        this.makeMove(fromRow, fromCol, toRow, toCol);
        return true;
    }

    makeMove(fromRow, fromCol, toRow, toCol, promotion = null) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Check for pawn promotion
        let finalPiece = piece;
        if (piece && piece.toLowerCase() === 'p') {
            const isWhite = this.isPieceWhite(piece);
            const promotionRow = isWhite ? 0 : 7;
            if (toRow === promotionRow) {
                // Auto-promote to queen for now (can be enhanced later)
                finalPiece = isWhite ? 'Q' : 'q';
            }
        }
        
        // Execute move
        this.board[toRow][toCol] = promotion || finalPiece;
        this.board[fromRow][fromCol] = null;
        
        // Handle captured pieces
        if (capturedPiece) {
            const capturedColor = this.isPieceWhite(capturedPiece) ? 'white' : 'black';
            this.capturedPieces[capturedColor].push(capturedPiece);
        }
        
        // Store last move for highlighting
        this.lastMove = { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } };
        
        // Update game state
        this.moveCount++;
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Check for game over conditions
        if (this.isGameOver()) {
            this.gameState = this.isKingInCheckmate(this.currentPlayer) ? 'checkmate' : 'stalemate';
        }
        
        // AI move if needed with improved timing
        if (this.gameMode === 'ai' && this.currentPlayer === 'black' && this.gameState === 'playing') {
            // Variable delay based on AI level for more realistic thinking time
            const thinkingTime = this.aiLevel <= 3 ? 300 + Math.random() * 200 : // Fast for beginners
                                 this.aiLevel <= 6 ? 600 + Math.random() * 400 : // Medium for intermediate
                                 1000 + Math.random() * 800; // Longer for advanced
            setTimeout(async () => await this.makeAIMove(), thinkingTime);
        }
        
        // Play sound and update display
        if (window.chessMaster && window.chessMaster.sounds) {
            window.chessMaster.sounds.play(capturedPiece ? 'capture' : 'move');
        }
        this.renderBoard();
    }

    getLegalMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece || !this.isPieceOwnedByCurrentPlayer(piece)) return [];
        
        let moves = [];
        const pieceType = piece.toLowerCase();
        
        switch (pieceType) {
            case 'p': moves = this.getPawnMoves(row, col); break;
            case 'r': moves = this.getRookMoves(row, col); break;
            case 'n': moves = this.getKnightMoves(row, col); break;
            case 'b': moves = this.getBishopMoves(row, col); break;
            case 'q': moves = this.getQueenMoves(row, col); break;
            case 'k': moves = this.getKingMoves(row, col); break;
        }
        
        return moves;
    }

    getPawnMoves(row, col) {
        const moves = [];
        const piece = this.board[row][col];
        const isWhite = this.isPieceWhite(piece);
        const direction = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        
        // Forward moves
        if (this.isValidSquare(row + direction, col) && !this.board[row + direction][col]) {
            moves.push({ row: row + direction, col });
            
            // Double move from starting position
            if (row === startRow && this.isValidSquare(row + 2 * direction, col) && !this.board[row + 2 * direction][col]) {
                moves.push({ row: row + 2 * direction, col });
            }
        }
        
        // Captures
        for (const colOffset of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + colOffset;
            
            if (this.isValidSquare(newRow, newCol)) {
                const targetPiece = this.board[newRow][newCol];
                if (targetPiece && this.isPieceWhite(targetPiece) !== isWhite) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
        
        return moves;
    }

    getRookMoves(row, col) {
        const moves = [];
        const directions = [[0,1], [0,-1], [1,0], [-1,0]];
        
        for (const [dRow, dCol] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;
                
                if (!this.isValidSquare(newRow, newCol)) break;
                
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (!this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        
        return moves;
    }

    getKnightMoves(row, col) {
        const moves = [];
        const knightMoves = [
            [-2,-1], [-2,1], [-1,-2], [-1,2],
            [1,-2], [1,2], [2,-1], [2,1]
        ];
        
        for (const [dRow, dCol] of knightMoves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidSquare(newRow, newCol)) {
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece || !this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
        
        return moves;
    }

    getBishopMoves(row, col) {
        const moves = [];
        const directions = [[1,1], [1,-1], [-1,1], [-1,-1]];
        
        for (const [dRow, dCol] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;
                
                if (!this.isValidSquare(newRow, newCol)) break;
                
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece) {
                    moves.push({ row: newRow, col: newCol });
                } else {
                    if (!this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                        moves.push({ row: newRow, col: newCol });
                    }
                    break;
                }
            }
        }
        
        return moves;
    }

    getQueenMoves(row, col) {
        return [...this.getRookMoves(row, col), ...this.getBishopMoves(row, col)];
    }

    getKingMoves(row, col) {
        const moves = [];
        const directions = [
            [-1,-1], [-1,0], [-1,1],
            [0,-1],          [0,1],
            [1,-1],  [1,0],  [1,1]
        ];
        
        for (const [dRow, dCol] of directions) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (this.isValidSquare(newRow, newCol)) {
                const targetPiece = this.board[newRow][newCol];
                if (!targetPiece || !this.isPieceOwnedByCurrentPlayer(targetPiece)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
        }
        
        return moves;
    }

    // Enhanced AI Implementation using Puter AI
    async makeAIMove() {
        const moves = this.getAllLegalMoves('black');
        if (moves.length === 0) return;

        try {
            const bestMove = await this.puterAI.getBestMove(
                this.board, 
                'black', 
                moves, 
                this.aiLevel
            );
            
            if (bestMove) {
                this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col, bestMove.promotion);
            }
        } catch (error) {
            console.error('Error in AI move generation:', error);
            // Fallback to random move
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            this.makeMove(randomMove.from.row, randomMove.from.col, randomMove.to.row, randomMove.to.col, randomMove.promotion);
        }
    }

    async getBestMove() {
        const moves = this.getAllLegalMoves('black');
        if (moves.length === 0) return null;
        
        try {
            return await this.puterAI.getBestMove(
                this.board, 
                'black', 
                moves, 
                this.aiLevel
            );
        } catch (error) {
            console.error('Error getting best move:', error);
            // Fallback to random move selection
            return moves[Math.floor(Math.random() * moves.length)];
        }
    }

    findKing(color) {
        const kingPiece = color === 'white' ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingPiece) {
                    return { row, col };
                }
            }
        }
        return null;
    }



    getAllLegalMoves(color) {
        const moves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && ((color === 'white' && this.isPieceWhite(piece)) || 
                             (color === 'black' && !this.isPieceWhite(piece)))) {
                    const pieceMoves = this.getLegalMoves(row, col);
                    for (const move of pieceMoves) {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col }
                        });
                    }
                }
            }
        }
        return moves;
    }

    // Utility methods
    isPieceWhite(piece) {
        return piece === piece.toUpperCase();
    }

    isPieceOwnedByCurrentPlayer(piece) {
        return (this.currentPlayer === 'white' && this.isPieceWhite(piece)) ||
               (this.currentPlayer === 'black' && !this.isPieceWhite(piece));
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    flipBoard() {
        this.isFlipped = !this.isFlipped;
        this.renderBoard();
    }

    undoMove() {
        // Simplified undo
        if (this.moveCount > 0) {
            this.board = this.initializeBoard();
            this.moveCount = 0;
            this.currentPlayer = 'white';
            this.gameState = 'playing';
            this.capturedPieces = { white: [], black: [] };
            this.lastMove = null;
            this.renderBoard();
        }
    }

    isGameOver() {
        return this.getAllLegalMoves(this.currentPlayer).length === 0;
    }

    isKingInCheckmate(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;
        
        return this.isSquareUnderAttack(kingPos.row, kingPos.col, color) && 
               this.getAllLegalMoves(color).length === 0;
    }

    findKing(color) {
        const kingPiece = color === 'white' ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingPiece) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    isSquareUnderAttack(row, col, defendingColor) {
        const attackingColor = defendingColor === 'white' ? 'black' : 'white';
        
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c];
                if (piece && ((attackingColor === 'white' && this.isPieceWhite(piece)) || 
                             (attackingColor === 'black' && !this.isPieceWhite(piece)))) {
                    const moves = this.getPieceMoves(r, c, piece);
                    if (moves.some(move => move.row === row && move.col === col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getPieceMoves(row, col, piece) {
        // Similar to getLegalMoves but without current player restriction
        let moves = [];
        const pieceType = piece.toLowerCase();
        
        switch (pieceType) {
            case 'p': moves = this.getPawnMoves(row, col); break;
            case 'r': moves = this.getRookMoves(row, col); break;
            case 'n': moves = this.getKnightMoves(row, col); break;
            case 'b': moves = this.getBishopMoves(row, col); break;
            case 'q': moves = this.getQueenMoves(row, col); break;
            case 'k': moves = this.getKingMoves(row, col); break;
        }
        
        return moves;
    }

    deselectSquare() {
        this.selectedSquare = null;
        this.renderBoard();
    }

    updateGameStatus() {
        const statusElement = document.getElementById('gameStatus');
        if (!statusElement) return;

        if (this.gameState === 'checkmate') {
            const winner = this.currentPlayer === 'white' ? 'Black' : 'White';
            statusElement.textContent = `Checkmate! ${winner} wins!`;
            statusElement.className = 'game-status game-over';
        } else if (this.gameState === 'stalemate') {
            statusElement.textContent = 'Stalemate! It\'s a draw!';
            statusElement.className = 'game-status game-over';
        } else {
            const kingPos = this.findKing(this.currentPlayer);
            const inCheck = kingPos && this.isSquareUnderAttack(kingPos.row, kingPos.col, this.currentPlayer);
            const checkText = inCheck ? ' (Check!)' : '';
            statusElement.textContent = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} to move${checkText}`;
            statusElement.className = inCheck ? 'game-status in-check' : 'game-status';
        }
    }

    updateCapturedPieces() {
        const capturedWhiteElement = document.getElementById('capturedWhite');
        const capturedBlackElement = document.getElementById('capturedBlack');
        
        if (capturedWhiteElement) {
            capturedWhiteElement.innerHTML = '';
            this.capturedPieces.white.forEach(piece => {
                const pieceElement = this.createPieceElement(piece);
                pieceElement.className = 'captured-piece';
                capturedWhiteElement.appendChild(pieceElement);
            });
        }
        
        if (capturedBlackElement) {
            capturedBlackElement.innerHTML = '';
            this.capturedPieces.black.forEach(piece => {
                const pieceElement = this.createPieceElement(piece);
                pieceElement.className = 'captured-piece';
                capturedBlackElement.appendChild(pieceElement);
            });
        }
    }

    updateMoveHistory() {
        const movesContainer = document.getElementById('movesContainer');
        if (!movesContainer) return;
        
        // Show the actual move count properly
        const moveNumber = Math.ceil(this.moveCount / 2);
        let moveText = `<div class="move-entry">Move ${moveNumber}</div>`;
        
        // Add last move notation if available
        if (this.lastMove) {
            const piece = this.board[this.lastMove.to.row][this.lastMove.to.col];
            if (piece) {
                const from = String.fromCharCode(97 + this.lastMove.from.col) + (8 - this.lastMove.from.row);
                const to = String.fromCharCode(97 + this.lastMove.to.col) + (8 - this.lastMove.to.row);
                const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
                moveText += `<div class="last-move-notation">${pieceSymbol}${from}-${to}</div>`;
            }
        }
        
        movesContainer.innerHTML = moveText;
    }
}

// Simple implementations for other managers
class LessonManager {
    constructor() {}
    startLesson() {}
    exitLesson() {}
    nextStep() {}
    previousStep() {}
}

class PuzzleManager {
    constructor() {}
    renderCurrentPuzzle() {}
    showHint() {}
    nextPuzzle() {}
}

class AnalysisManager {
    constructor() {}
    openPositionEditor() {}
    analyzePosition() {}
}

class PuterAI {
    constructor() {
        this.isInitialized = false;
        this.initializePuter();
    }

    async initializePuter() {
        try {
            // Check if Puter is available
            if (typeof puter !== 'undefined') {
                this.isInitialized = true;
                console.log('Puter AI initialized successfully');
            } else {
                console.warn('Puter AI not available, falling back to simple evaluation');
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('Error initializing Puter AI:', error);
            this.isInitialized = false;
        }
    }

    async evaluatePosition(boardState, currentPlayer, moveHistory = []) {
        if (!this.isInitialized || typeof puter === 'undefined') {
            // Fallback to simple evaluation
            return (Math.random() - 0.5) * 4;
        }

        try {
            const boardFEN = this.boardToFEN(boardState, currentPlayer);
            const prompt = `As a chess master, analyze this position in FEN notation: ${boardFEN}

Current position analysis needed:
- Evaluate the position from ${currentPlayer}'s perspective 
- Consider piece values, position, tactics, and strategy
- Rate the position from -10 (very bad for ${currentPlayer}) to +10 (very good for ${currentPlayer})
- Focus on concrete evaluation factors like:
  * Material balance
  * King safety  
  * Piece activity and development
  * Pawn structure
  * Tactical opportunities

Please respond with just a numerical evaluation between -10 and +10, followed by a brief explanation.`;

            const response = await puter.ai.chat(prompt, {
                model: 'claude',
                stream: false
            });

            // Extract numerical evaluation from response
            const evaluation = this.parseEvaluation(response);
            return evaluation;

        } catch (error) {
            console.error('Error getting AI evaluation:', error);
            // Fallback to random evaluation
            return (Math.random() - 0.5) * 4;
        }
    }

    async getBestMove(boardState, currentPlayer, legalMoves, difficulty = 5) {
        if (!this.isInitialized || typeof puter === 'undefined' || legalMoves.length === 0) {
            // Fallback to random move selection
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];
        }

        try {
            const boardFEN = this.boardToFEN(boardState, currentPlayer);
            const movesText = legalMoves.map(move => 
                `${this.squareToAlgebraic(move.from.row, move.from.col)}${this.squareToAlgebraic(move.to.row, move.to.col)}`
            ).join(', ');

            const difficultyDescriptions = {
                1: 'beginner (make some obvious mistakes)',
                2: 'novice (play simply, avoid complex tactics)', 
                3: 'amateur (basic tactics, some strategic understanding)',
                4: 'intermediate (good tactical vision, developing strategy)',
                5: 'advanced (strong tactics and positional play)',
                6: 'expert (excellent tactical and strategic skills)',
                7: 'master (deep understanding, complex planning)',
                8: 'grandmaster (exceptional skill in all areas)',
                9: 'super grandmaster (world-class level)',
                10: 'engine-like (near perfect play)'
            };

            const prompt = `You are a chess engine playing at ${difficultyDescriptions[difficulty]} level.

Current position (FEN): ${boardFEN}
It's ${currentPlayer}'s turn to move.

Legal moves available: ${movesText}

As a ${difficultyDescriptions[difficulty]} player, choose the best move from the available options. Consider:
- Tactical opportunities (captures, checks, threats)
- Positional factors (piece development, center control, king safety)
- Strategic plans appropriate for this skill level
- Opening principles if in opening phase
- Endgame technique if in endgame

Please respond with just the move in algebraic notation (like e2e4 or Ng1f3), followed by a brief explanation of why this move is good at this skill level.`;

            const response = await puter.ai.chat(prompt, {
                model: 'claude',
                stream: false
            });

            // Parse the move from the response
            const selectedMove = this.parseMove(response, legalMoves);
            return selectedMove || legalMoves[Math.floor(Math.random() * legalMoves.length)];

        } catch (error) {
            console.error('Error getting AI move:', error);
            // Fallback to random move
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];
        }
    }

    boardToFEN(board, currentPlayer) {
        // Convert board array to FEN notation
        let fen = '';
        
        for (let row = 0; row < 8; row++) {
            let emptyCount = 0;
            let rowStr = '';
            
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece === null) {
                    emptyCount++;
                } else {
                    if (emptyCount > 0) {
                        rowStr += emptyCount;
                        emptyCount = 0;
                    }
                    rowStr += piece;
                }
            }
            
            if (emptyCount > 0) {
                rowStr += emptyCount;
            }
            
            fen += rowStr;
            if (row < 7) fen += '/';
        }
        
        // Add turn, castling, en passant, halfmove, fullmove (simplified)
        fen += ` ${currentPlayer === 'white' ? 'w' : 'b'} - - 0 1`;
        
        return fen;
    }

    squareToAlgebraic(row, col) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        return files[col] + ranks[row];
    }

    parseEvaluation(response) {
        // Extract numerical evaluation from AI response
        const match = response.match(/-?\d+(\.\d+)?/);
        if (match) {
            let evaluation = parseFloat(match[0]);
            // Clamp between -10 and 10
            evaluation = Math.max(-10, Math.min(10, evaluation));
            return evaluation;
        }
        return 0; // Default neutral evaluation
    }

    parseMove(response, legalMoves) {
        // Extract move from AI response and match it to legal moves
        const movePattern = /([a-h][1-8][a-h][1-8])/g;
        const matches = response.match(movePattern);
        
        if (matches) {
            for (const moveStr of matches) {
                const fromSquare = moveStr.substring(0, 2);
                const toSquare = moveStr.substring(2, 4);
                
                const fromCol = fromSquare.charCodeAt(0) - 97; // a=0, b=1, etc.
                const fromRow = 8 - parseInt(fromSquare[1]); // 8=0, 7=1, etc.
                const toCol = toSquare.charCodeAt(0) - 97;
                const toRow = 8 - parseInt(toSquare[1]);
                
                // Find matching legal move
                const move = legalMoves.find(m => 
                    m.from.row === fromRow && m.from.col === fromCol &&
                    m.to.row === toRow && m.to.col === toCol
                );
                
                if (move) {
                    return move;
                }
            }
        }
        
        return null; // No valid move found
    }

    // Simple evaluation fallback
    evaluate() {
        return (Math.random() - 0.5) * 4;
    }
}

class ProfileManager {
    constructor() {
        this.data = {};
    }
    load() {}
    save() {}
}

class SoundManager {
    constructor() {
        this.enabled = true;
    }
    
    play(soundName) {
        if (!this.enabled) return;
        
        // Simple beep sounds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            move: 440,
            capture: 330,
            select: 550,
            illegal: 200
        };
        
        oscillator.frequency.value = frequencies[soundName] || 440;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Global Functions
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionName)?.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
    
    if (window.chessMaster) {
        window.chessMaster.currentSection = sectionName;
    }
}

function toggleMobileMenu() {
    document.querySelector('.hamburger')?.classList.toggle('active');
    document.querySelector('.nav-menu')?.classList.toggle('active');
}

function startQuickGame() {
    showSection('play');
    setTimeout(() => startGame('ai'), 300);
}

function startGame(mode) {
    const modal = document.getElementById('gameSetupModal');
    modal.classList.add('show');
    window.selectedGameMode = mode;
}

function confirmGameStart() {
    const timeControl = document.getElementById('timeControl').value;
    const aiDifficulty = parseInt(document.getElementById('aiDifficulty').value);
    const playerColor = document.getElementById('playerColor').value;
    
    closeModal('gameSetupModal');
    
    // Initialize game
    if (window.chessMaster) {
        window.chessMaster.game = new ChessGame();
        window.chessMaster.game.gameMode = window.selectedGameMode;
        window.chessMaster.game.aiLevel = aiDifficulty;
        
        // Show game interface
        document.querySelector('.game-modes').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'grid';
        
        window.chessMaster.game.renderBoard();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('show');
}

function selectPromotion(piece) {
    closeModal('promotionModal');
}

function flipBoard() {
    if (window.chessMaster && window.chessMaster.game) {
        window.chessMaster.game.flipBoard();
    }
}

function undoMove() {
    if (window.chessMaster && window.chessMaster.game) {
        window.chessMaster.game.undoMove();
    }
}

function offerDraw() {
    if (confirm('Offer a draw?')) {
        alert('Draw offered');
    }
}

function resign() {
    if (confirm('Are you sure you want to resign?')) {
        alert('Game resigned');
    }
}

function startNewGame() {
    if (window.chessMaster && window.chessMaster.game) {
        startGame(window.chessMaster.game.gameMode);
    }
}

function analyzeGame() {
    showSection('analysis');
}

// Lesson Functions (simplified)
function toggleCategory(categoryId) {}
function startLesson(lessonId) {}
function exitLesson() {}
function nextLessonStep() {}
function previousLessonStep() {}

// Puzzle Functions (simplified)
function showPuzzleHint() {}
function resetPuzzle() {}
function nextPuzzle() {}
function filterPuzzles(category) {}

// Analysis Functions (simplified)
function openPositionEditor() {}
function openGameDatabase() {}
function openOpeningExplorer() {}
function goToStart() {}
function previousMove() {}
function nextMove() {}
function goToEnd() {}
function analyzePosition() {}

// Profile Functions (simplified)
function showProfileTab(tabName) {}
function changeAvatar() {}
function reviewGame(gameId) {}

// Settings Functions (simplified)
function changeBoardTheme() {}
function changePieceSet() {}
function toggleCoordinates() {}
function toggleLastMoveHighlight() {}
function toggleAnimations() {}
function toggleSounds() {}
function changeAnimationSpeed() {}
function saveSettings() {}

// Initialize the application
let chessMaster;
document.addEventListener('DOMContentLoaded', () => {
    chessMaster = new ChessMasterPro();
    window.chessMaster = chessMaster; // Make it globally accessible
    console.log('Chess Master Pro initialized successfully!');
});