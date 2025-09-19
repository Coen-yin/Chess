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
        this.changeBoardTheme(this.settings.boardTheme);
        this.changePieceSet(this.settings.pieceSet);
        this.toggleCoordinates(this.settings.showCoordinates);
        this.toggleLastMoveHighlight(this.settings.highlightLastMove);
        this.toggleAnimations(this.settings.animatePieces);
        this.toggleSounds(this.settings.playSounds);
        this.changeAnimationSpeed(this.settings.moveSpeed);
    }

    loadUserProfile() {
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        this.profile.load(profile);
    }
}

// Chess Game Engine
class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.gameState = 'playing';
        this.moveCount = 0;
        this.timeControl = { white: 600, black: 600 }; // 10 minutes
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
        
        this.initializeEventListeners();
    }

    initializeBoard() {
        // Standard chess starting position
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

        // Add coordinates if enabled
        if (chessMaster.settings.showCoordinates) {
            if (col === (this.isFlipped ? 0 : 7)) {
                const rankLabel = document.createElement('div');
                rankLabel.className = 'coordinate rank';
                rankLabel.textContent = 8 - row;
                square.appendChild(rankLabel);
            }
            if (row === (this.isFlipped ? 0 : 7)) {
                const fileLabel = document.createElement('div');
                fileLabel.className = 'coordinate file';
                fileLabel.textContent = String.fromCharCode(97 + col);
                square.appendChild(fileLabel);
            }
        }

        // Add piece
        const piece = this.board[row][col];
        if (piece) {
            const pieceElement = this.createPieceElement(piece);
            square.appendChild(pieceElement);
        }

        // Add event listeners
        square.addEventListener('click', () => this.handleSquareClick(row, col));
        square.addEventListener('dragover', (e) => e.preventDefault());
        square.addEventListener('drop', (e) => this.handleDrop(e, row, col));

        // Highlight selected square
        if (this.selectedSquare && this.selectedSquare.row === row && this.selectedSquare.col === col) {
            square.classList.add('selected');
        }

        // Highlight last move
        if (this.lastMove && chessMaster.settings.highlightLastMove) {
            if ((this.lastMove.from.row === row && this.lastMove.from.col === col) ||
                (this.lastMove.to.row === row && this.lastMove.to.col === col)) {
                square.classList.add('last-move');
            }
        }

        // Show legal moves
        if (this.selectedSquare && chessMaster.settings.showLegalMoves) {
            const legalMoves = this.getLegalMoves(this.selectedSquare.row, this.selectedSquare.col);
            if (legalMoves.some(move => move.row === row && move.col === col)) {
                square.classList.add(piece ? 'legal-capture' : 'legal-move');
            }
        }

        // Check highlighting
        if (this.isKingInCheck(row, col)) {
            square.classList.add('check');
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
        
        pieceElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece);
            pieceElement.classList.add('dragging');
        });
        
        pieceElement.addEventListener('dragend', () => {
            pieceElement.classList.remove('dragging');
        });

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
            chessMaster.sounds.play('select');
        } else {
            this.deselectSquare();
        }
    }

    handleDrop(e, row, col) {
        e.preventDefault();
        if (!this.selectedSquare) return;
        
        this.attemptMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
        this.deselectSquare();
    }

    attemptMove(fromRow, fromCol, toRow, toCol) {
        const legalMoves = this.getLegalMoves(fromRow, fromCol);
        const move = legalMoves.find(m => m.row === toRow && m.col === toCol);
        
        if (!move) {
            chessMaster.sounds.play('illegal');
            return false;
        }
        
        // Check for pawn promotion
        const piece = this.board[fromRow][fromCol];
        if (piece?.toLowerCase() === 'p' && (toRow === 0 || toRow === 7)) {
            this.showPromotionModal(fromRow, fromCol, toRow, toCol);
            return true;
        }
        
        this.makeMove(fromRow, fromCol, toRow, toCol);
        return true;
    }

    makeMove(fromRow, fromCol, toRow, toCol, promotion = null) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Store move for history
        const moveData = {
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            piece,
            captured: capturedPiece,
            promotion,
            moveNumber: Math.floor(this.moveCount / 2) + 1,
            isWhiteMove: this.currentPlayer === 'white',
            notation: this.getMoveNotation(fromRow, fromCol, toRow, toCol, piece, capturedPiece, promotion)
        };
        
        // Execute move
        this.board[toRow][toCol] = promotion || piece;
        this.board[fromRow][fromCol] = null;
        
        // Handle captured pieces
        if (capturedPiece) {
            const capturedColor = this.isPieceWhite(capturedPiece) ? 'white' : 'black';
            this.capturedPieces[capturedColor].push(capturedPiece);
        }
        
        // Handle special moves
        this.handleSpecialMoves(fromRow, fromCol, toRow, toCol, piece);
        
        // Update game state
        this.gameHistory.push(moveData);
        this.lastMove = moveData;
        this.moveCount++;
        
        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        
        // Check game end conditions
        this.checkGameEnd();
        
        // AI move if needed
        if (this.gameMode === 'ai' && this.currentPlayer === 'black') {
            setTimeout(() => this.makeAIMove(), 500);
        }
        
        // Play sound and update display
        chessMaster.sounds.play(capturedPiece ? 'capture' : 'move');
        this.renderBoard();
        this.updateTimers();
    }

    handleSpecialMoves(fromRow, fromCol, toRow, toCol, piece) {
        // Castling
        if (piece?.toLowerCase() === 'k' && Math.abs(toCol - fromCol) === 2) {
            const rookFromCol = toCol > fromCol ? 7 : 0;
            const rookToCol = toCol > fromCol ? 5 : 3;
            
            this.board[fromRow][rookToCol] = this.board[fromRow][rookFromCol];
            this.board[fromRow][rookFromCol] = null;
        }
        
        // En passant
        if (piece?.toLowerCase() === 'p' && fromCol !== toCol && !this.board[toRow][toCol]) {
            this.board[fromRow][toCol] = null; // Remove captured pawn
        }
        
        // Update castling rights
        if (piece?.toLowerCase() === 'k') {
            const color = this.isPieceWhite(piece) ? 'white' : 'black';
            this.castlingRights[color].kingside = false;
            this.castlingRights[color].queenside = false;
        }
        
        if (piece?.toLowerCase() === 'r') {
            const color = this.isPieceWhite(piece) ? 'white' : 'black';
            if (fromCol === 0) this.castlingRights[color].queenside = false;
            if (fromCol === 7) this.castlingRights[color].kingside = false;
        }
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
        
        // Filter moves that would leave king in check
        return moves.filter(move => !this.wouldMoveExposeKing(row, col, move.row, move.col));
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
            if (row === startRow && !this.board[row + 2 * direction][col]) {
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
        
        // Castling moves would be added here
        return moves;
    }

    // AI Implementation
    makeAIMove() {
        const bestMove = this.getBestMove(this.aiLevel);
        if (bestMove) {
            this.makeMove(bestMove.from.row, bestMove.from.col, bestMove.to.row, bestMove.to.col, bestMove.promotion);
        }
    }

    getBestMove(depth) {
        const moves = this.getAllLegalMoves('black');
        if (moves.length === 0) return null;
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        for (const move of moves) {
            const score = this.minimax(move, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    minimax(move, depth, alpha, beta, isMaximizing) {
        // Simplified minimax implementation
        if (depth === 0) {
            return this.evaluatePosition();
        }
        
        // Make temporary move
        const originalBoard = JSON.parse(JSON.stringify(this.board));
        this.board[move.to.row][move.to.col] = this.board[move.from.row][move.from.col];
        this.board[move.from.row][move.from.col] = null;
        
        const moves = this.getAllLegalMoves(isMaximizing ? 'black' : 'white');
        let bestScore = isMaximizing ? -Infinity : Infinity;
        
        for (const nextMove of moves) {
            const score = this.minimax(nextMove, depth - 1, alpha, beta, !isMaximizing);
            
            if (isMaximizing) {
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
            } else {
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
            }
            
            if (beta <= alpha) break; // Alpha-beta pruning
        }
        
        // Restore board
        this.board = originalBoard;
        return bestScore;
    }

    evaluatePosition() {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
        let score = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()];
                    score += this.isPieceWhite(piece) ? -value : value;
                }
            }
        }
        
        return score;
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

    isKingInCheck(row, col) {
        const piece = this.board[row][col];
        return piece?.toLowerCase() === 'k' && this.isSquareAttacked(row, col);
    }

    isSquareAttacked(row, col) {
        // Simplified attack detection
        return false; // Would implement full attack detection
    }

    wouldMoveExposeKing(fromRow, fromCol, toRow, toCol) {
        // Simplified king exposure check
        return false; // Would implement full check detection
    }

    checkGameEnd() {
        // Check for checkmate, stalemate, etc.
        const moves = this.getAllLegalMoves(this.currentPlayer);
        if (moves.length === 0) {
            if (this.isKingInCheck()) {
                this.gameState = 'checkmate';
                this.showGameOverModal('checkmate');
            } else {
                this.gameState = 'stalemate';
                this.showGameOverModal('stalemate');
            }
        }
    }

    getMoveNotation(fromRow, fromCol, toRow, toCol, piece, captured, promotion) {
        // Simplified algebraic notation
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        let notation = '';
        
        if (piece.toLowerCase() !== 'p') {
            notation += piece.toUpperCase();
        }
        
        if (captured) notation += 'x';
        
        notation += files[toCol] + ranks[toRow];
        
        if (promotion) {
            notation += '=' + promotion.toUpperCase();
        }
        
        return notation;
    }

    // Game controls
    flipBoard() {
        this.isFlipped = !this.isFlipped;
        this.renderBoard();
    }

    undoMove() {
        if (this.gameHistory.length === 0) return;
        
        const lastMove = this.gameHistory.pop();
        this.board[lastMove.from.row][lastMove.from.col] = lastMove.piece;
        this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
        
        if (lastMove.captured) {
            const capturedColor = this.isPieceWhite(lastMove.captured) ? 'white' : 'black';
            this.capturedPieces[capturedColor].pop();
        }
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.moveCount--;
        this.renderBoard();
    }

    deselectSquare() {
        this.selectedSquare = null;
        this.renderBoard();
    }

    // UI Updates
    updateGameStatus() {
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            let status = `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)} to move`;
            
            if (this.gameState === 'check') status += ' - Check!';
            else if (this.gameState === 'checkmate') status = 'Checkmate!';
            else if (this.gameState === 'stalemate') status = 'Stalemate!';
            
            statusElement.textContent = status;
            statusElement.className = `game-status ${this.gameState}`;
        }
    }

    updateCapturedPieces() {
        const capturedWhite = document.getElementById('capturedWhite');
        const capturedBlack = document.getElementById('capturedBlack');
        
        if (capturedWhite) {
            capturedWhite.innerHTML = this.capturedPieces.white
                .map(piece => `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`)
                .join('');
        }
        
        if (capturedBlack) {
            capturedBlack.innerHTML = this.capturedPieces.black
                .map(piece => `<span class="captured-piece">${this.getPieceSymbol(piece)}</span>`)
                .join('');
        }
    }

    updateMoveHistory() {
        const movesContainer = document.getElementById('movesContainer');
        if (!movesContainer) return;
        
        let html = '';
        for (let i = 0; i < this.gameHistory.length; i += 2) {
            const moveNum = Math.floor(i / 2) + 1;
            const whiteMove = this.gameHistory[i];
            const blackMove = this.gameHistory[i + 1];
            
            html += `<div class="move-pair">`;
            html += `<span class="move-number">${moveNum}.</span>`;
            html += `<span class="move" onclick="chessMaster.game.goToMove(${i})">${whiteMove.notation}</span>`;
            if (blackMove) {
                html += ` <span class="move" onclick="chessMaster.game.goToMove(${i + 1})">${blackMove.notation}</span>`;
            }
            html += `</div>`;
        }
        
        movesContainer.innerHTML = html;
        movesContainer.scrollTop = movesContainer.scrollHeight;
    }

    updateTimers() {
        const whiteTimer = document.getElementById('whiteTimer');
        const blackTimer = document.getElementById('blackTimer');
        
        if (whiteTimer) {
            whiteTimer.textContent = this.formatTime(this.timeControl.white);
            whiteTimer.classList.toggle('active', this.currentPlayer === 'white');
            whiteTimer.classList.toggle('low-time', this.timeControl.white < 60);
        }
        
        if (blackTimer) {
            blackTimer.textContent = this.formatTime(this.timeControl.black);
            blackTimer.classList.toggle('active', this.currentPlayer === 'black');
            blackTimer.classList.toggle('low-time', this.timeControl.black < 60);
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return symbols[piece] || piece;
    }

    // Modal handlers
    showPromotionModal(fromRow, fromCol, toRow, toCol) {
        const modal = document.getElementById('promotionModal');
        modal.classList.add('show');
        
        window.pendingPromotion = { fromRow, fromCol, toRow, toCol };
    }

    showGameOverModal(result) {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('gameOverTitle');
        const icon = document.getElementById('resultIcon');
        const text = document.getElementById('resultText');
        
        switch (result) {
            case 'checkmate':
                title.textContent = 'Checkmate!';
                icon.textContent = this.currentPlayer === 'white' ? '😞' : '🎉';
                text.textContent = this.currentPlayer === 'white' ? 'Black wins!' : 'White wins!';
                break;
            case 'stalemate':
                title.textContent = 'Stalemate!';
                icon.textContent = '🤝';
                text.textContent = "It's a draw!";
                break;
        }
        
        modal.classList.add('show');
    }
}

// Lesson Manager
class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.currentStep = 0;
        this.lessons = this.initializeLessons();
    }

    initializeLessons() {
        return {
            'board-setup': {
                title: 'Board Setup & Notation',
                steps: [
                    {
                        title: 'Welcome to Chess!',
                        content: 'Let\'s start by learning about the chess board.',
                        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        highlights: [],
                        tips: 'The chess board has 64 squares arranged in an 8x8 grid.'
                    },
                    {
                        title: 'Files and Ranks',
                        content: 'Files are columns (a-h) and ranks are rows (1-8).',
                        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        highlights: [{ row: 0, col: 0 }, { row: 7, col: 7 }],
                        tips: 'Square a1 is bottom-left for White, h8 is top-right.'
                    }
                ]
            },
            'piece-movement': {
                title: 'How Pieces Move',
                steps: [
                    {
                        title: 'The Pawn',
                        content: 'Pawns move forward one square, capture diagonally.',
                        position: '8/8/8/8/3P4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'Pawns can move two squares on their first move.'
                    }
                ]
            }
        };
    }

    startLesson(lessonId) {
        this.currentLesson = lessonId;
        this.currentStep = 0;
        
        document.querySelector('.learning-path').style.display = 'none';
        document.getElementById('lessonInterface').style.display = 'grid';
        
        this.renderLesson();
    }

    renderLesson() {
        const lesson = this.lessons[this.currentLesson];
        const step = lesson.steps[this.currentStep];
        
        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('stepTitle').textContent = step.title;
        document.getElementById('stepContent').innerHTML = `<p>${step.content}</p>`;
        document.getElementById('lessonTips').innerHTML = step.tips ? `<h5>💡 Tip</h5><p>${step.tips}</p>` : '';
        document.getElementById('lessonStep').textContent = `Step ${this.currentStep + 1} of ${lesson.steps.length}`;
        
        const progressPercent = ((this.currentStep + 1) / lesson.steps.length) * 100;
        document.getElementById('lessonProgressFill').style.width = `${progressPercent}%`;
        
        this.renderLessonBoard(step);
    }

    renderLessonBoard(step) {
        const board = document.getElementById('lessonBoard');
        if (!board) return;
        
        board.innerHTML = '';
        
        // Create board from position (simplified FEN)
        const position = step.position || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
        const rows = position.split('/');
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                
                // Add highlighting
                if (step.highlights?.some(h => h.row === row && h.col === col)) {
                    square.classList.add('highlight');
                }
                
                board.appendChild(square);
            }
        }
    }

    nextStep() {
        const lesson = this.lessons[this.currentLesson];
        if (this.currentStep < lesson.steps.length - 1) {
            this.currentStep++;
            this.renderLesson();
        } else {
            this.completeLesson();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderLesson();
        }
    }

    completeLesson() {
        // Update progress
        const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
        progress[this.currentLesson] = 100;
        localStorage.setItem('lessonProgress', JSON.stringify(progress));
        
        this.exitLesson();
    }

    exitLesson() {
        document.getElementById('lessonInterface').style.display = 'none';
        document.querySelector('.learning-path').style.display = 'block';
        this.updateLessonProgress();
    }

    updateLessonProgress() {
        const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{}');
        
        document.querySelectorAll('.lesson-progress').forEach(element => {
            const lesson = element.closest('.lesson');
            const lessonId = lesson.getAttribute('data-lesson-id');
            const percent = progress[lessonId] || 0;
            element.textContent = `${percent}%`;
        });
    }
}

// Puzzle Manager
class PuzzleManager {
    constructor() {
        this.currentPuzzle = 0;
        this.puzzles = this.initializePuzzles();
        this.stats = this.loadStats();
        this.solved = new Set();
    }

    initializePuzzles() {
        return [
            {
                id: 1,
                title: 'Knight Fork',
                rating: 1450,
                theme: 'Tactical - Fork',
                instruction: 'White to move and win material',
                position: '8/8/8/8/8/8/8/8', // Simplified
                solution: ['Nc7+'],
                explanation: 'The knight forks the king and rook!'
            },
            {
                id: 2,
                title: 'Pin Attack',
                rating: 1380,
                theme: 'Tactical - Pin',
                instruction: 'White to move and win the queen',
                position: '8/8/8/8/8/8/8/8',
                solution: ['Bb5'],
                explanation: 'The bishop pins the queen to the king!'
            }
        ];
    }

    loadStats() {
        return JSON.parse(localStorage.getItem('puzzleStats') || JSON.stringify({
            solved: 0,
            rating: 1200,
            successRate: 0,
            streak: 0
        }));
    }

    renderCurrentPuzzle() {
        const puzzle = this.puzzles[this.currentPuzzle];
        
        document.getElementById('puzzleTitle').textContent = `Daily Puzzle #${puzzle.id}`;
        document.getElementById('currentPuzzleRating').textContent = `★★★ (${puzzle.rating})`;
        document.getElementById('puzzleTheme').textContent = puzzle.theme;
        document.getElementById('puzzleInstruction').textContent = puzzle.instruction;
        
        this.renderPuzzleBoard(puzzle);
        this.updatePuzzleStats();
    }

    renderPuzzleBoard(puzzle) {
        const board = document.getElementById('puzzleBoard');
        if (!board) return;
        
        board.innerHTML = '';
        
        // Create puzzle position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.addEventListener('click', () => this.handlePuzzleMove(row, col));
                board.appendChild(square);
            }
        }
    }

    handlePuzzleMove(row, col) {
        // Simplified puzzle move handling
        console.log(`Puzzle move: ${row}, ${col}`);
    }

    showHint() {
        const puzzle = this.puzzles[this.currentPuzzle];
        const hintElement = document.getElementById('puzzleHint');
        const hintText = document.getElementById('hintText');
        
        hintText.textContent = `Look for a ${puzzle.theme.split(' - ')[1].toLowerCase()}!`;
        hintElement.style.display = 'block';
    }

    solvePuzzle() {
        const puzzle = this.puzzles[this.currentPuzzle];
        
        document.getElementById('solutionMoves').textContent = puzzle.solution.join(' ');
        document.getElementById('solutionExplanation').textContent = puzzle.explanation;
        document.getElementById('puzzleSolution').style.display = 'block';
        
        this.stats.solved++;
        this.solved.add(puzzle.id);
        this.updatePuzzleStats();
        this.saveStats();
    }

    nextPuzzle() {
        this.currentPuzzle = (this.currentPuzzle + 1) % this.puzzles.length;
        document.getElementById('puzzleSolution').style.display = 'none';
        document.getElementById('puzzleHint').style.display = 'none';
        this.renderCurrentPuzzle();
    }

    updatePuzzleStats() {
        document.getElementById('puzzlesSolved').textContent = this.stats.solved;
        document.getElementById('puzzleRating').textContent = this.stats.rating;
        document.getElementById('successRate').textContent = `${this.stats.successRate}%`;
    }

    saveStats() {
        localStorage.setItem('puzzleStats', JSON.stringify(this.stats));
    }
}

// Analysis Manager
class AnalysisManager {
    constructor() {
        this.currentGame = null;
        this.currentMove = 0;
        this.engine = new SimpleEngine();
    }

    openPositionEditor() {
        document.querySelector('.analysis-tools').style.display = 'none';
        document.getElementById('analysisInterface').style.display = 'grid';
        this.renderAnalysisBoard();
    }

    renderAnalysisBoard() {
        const board = document.getElementById('analysisBoard');
        if (!board) return;
        
        board.innerHTML = '';
        
        // Create empty board for editing
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                board.appendChild(square);
            }
        }
    }

    analyzePosition() {
        const evaluation = this.engine.evaluate();
        document.getElementById('engineEval').textContent = evaluation > 0 ? `+${evaluation.toFixed(2)}` : evaluation.toFixed(2);
        document.getElementById('pvMoves').textContent = '1. e4 e5 2. Nf3 Nc6 3. Bb5';
        document.getElementById('engineStatus').textContent = 'Analyzing...';
        
        setTimeout(() => {
            document.getElementById('engineStatus').textContent = 'Analysis complete';
        }, 2000);
    }
}

// Simple Chess Engine
class SimpleEngine {
    evaluate() {
        // Random evaluation for demo
        return (Math.random() - 0.5) * 4;
    }
}

// Profile Manager
class ProfileManager {
    constructor() {
        this.data = this.loadProfile();
    }

    loadProfile() {
        return JSON.parse(localStorage.getItem('userProfile') || JSON.stringify({
            name: 'Chess Enthusiast',
            rating: 1247,
            gamesPlayed: 156,
            winRate: 73,
            achievements: ['first-victory', 'win-streak', 'puzzle-solver'],
            stats: {
                bullet: { rating: 1180, games: 23 },
                blitz: { rating: 1247, games: 89 },
                rapid: { rating: 1289, games: 44 }
            }
        }));
    }

    load(profileData) {
        this.data = { ...this.data, ...profileData };
        this.updateProfileDisplay();
    }

    updateProfileDisplay() {
        document.getElementById('profileName').textContent = this.data.name;
        // Update other profile elements
    }

    save() {
        localStorage.setItem('userProfile', JSON.stringify(this.data));
    }
}

// Sound Manager
class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = this.createSounds();
    }

    createSounds() {
        return {
            move: this.createSound(440, 0.1, 'sine'),
            capture: this.createSound(330, 0.2, 'square'),
            check: this.createSound(880, 0.3, 'sawtooth'),
            select: this.createSound(550, 0.05, 'sine'),
            illegal: this.createSound(200, 0.1, 'square')
        };
    }

    createSound(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Global Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    document.getElementById(sectionName)?.classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    document.querySelector(`[onclick="showSection('${sectionName}')"]`)?.classList.add('active');
    
    chessMaster.currentSection = sectionName;
    
    // Initialize section-specific content
    if (sectionName === 'puzzles') {
        chessMaster.puzzles.renderCurrentPuzzle();
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
    chessMaster.game = new ChessGame();
    chessMaster.game.gameMode = window.selectedGameMode;
    chessMaster.game.aiLevel = aiDifficulty;
    
    // Show game interface
    document.querySelector('.game-modes').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'grid';
    
    chessMaster.game.renderBoard();
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('show');
}

function selectPromotion(piece) {
    if (window.pendingPromotion) {
        const { fromRow, fromCol, toRow, toCol } = window.pendingPromotion;
        chessMaster.game.makeMove(fromRow, fromCol, toRow, toCol, piece);
        closeModal('promotionModal');
        delete window.pendingPromotion;
    }
}

function flipBoard() {
    chessMaster.game?.flipBoard();
}

function undoMove() {
    chessMaster.game?.undoMove();
}

function offerDraw() {
    if (confirm('Offer a draw?')) {
        chessMaster.game.gameState = 'draw';
        chessMaster.game.showGameOverModal('draw');
    }
}

function resign() {
    if (confirm('Are you sure you want to resign?')) {
        chessMaster.game.gameState = 'resignation';
        chessMaster.game.showGameOverModal('resignation');
    }
}

function startNewGame() {
    closeModal('gameOverModal');
    startGame(chessMaster.game.gameMode);
}

function analyzeGame() {
    closeModal('gameOverModal');
    showSection('analysis');
    chessMaster.analysis.openPositionEditor();
}

// Lesson Functions
function toggleCategory(categoryId) {
    const header = document.querySelector(`[onclick="toggleCategory('${categoryId}')"]`);
    const list = document.getElementById(categoryId);
    
    header?.classList.toggle('active');
    list?.classList.toggle('active');
}

function startLesson(lessonId) {
    chessMaster.lessons.startLesson(lessonId);
}

function exitLesson() {
    chessMaster.lessons.exitLesson();
}

function nextLessonStep() {
    chessMaster.lessons.nextStep();
}

function previousLessonStep() {
    chessMaster.lessons.previousStep();
}

// Puzzle Functions
function showPuzzleHint() {
    chessMaster.puzzles.showHint();
}

function resetPuzzle() {
    chessMaster.puzzles.renderCurrentPuzzle();
}

function nextPuzzle() {
    chessMaster.puzzles.nextPuzzle();
}

function filterPuzzles(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="filterPuzzles('${category}')"]`)?.classList.add('active');
}

// Analysis Functions
function openPositionEditor() {
    chessMaster.analysis.openPositionEditor();
}

function openGameDatabase() {
    alert('Game database feature coming soon!');
}

function openOpeningExplorer() {
    alert('Opening explorer feature coming soon!');
}

function goToStart() {
    chessMaster.analysis.currentMove = 0;
    chessMaster.analysis.renderAnalysisBoard();
}

function previousMove() {
    if (chessMaster.analysis.currentMove > 0) {
        chessMaster.analysis.currentMove--;
        chessMaster.analysis.renderAnalysisBoard();
    }
}

function nextMove() {
    chessMaster.analysis.currentMove++;
    chessMaster.analysis.renderAnalysisBoard();
}

function goToEnd() {
    chessMaster.analysis.currentMove = chessMaster.analysis.currentGame?.moves.length || 0;
    chessMaster.analysis.renderAnalysisBoard();
}

function analyzePosition() {
    chessMaster.analysis.analyzePosition();
}

// Profile Functions
function showProfileTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelector(`[onclick="showProfileTab('${tabName}')"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
}

function changeAvatar() {
    alert('Avatar change feature coming soon!');
}

function reviewGame(gameId) {
    showSection('analysis');
    alert(`Reviewing game ${gameId}`);
}

// Settings Functions
function changeBoardTheme() {
    const theme = document.getElementById('boardTheme').value;
    chessMaster.settings.boardTheme = theme;
    chessMaster.changeBoardTheme(theme);
    saveSettings();
}

function changePieceSet() {
    const pieceSet = document.getElementById('pieceSet').value;
    chessMaster.settings.pieceSet = pieceSet;
    chessMaster.changePieceSet(pieceSet);
    saveSettings();
}

function toggleCoordinates() {
    const show = document.getElementById('showCoordinates').checked;
    chessMaster.settings.showCoordinates = show;
    chessMaster.toggleCoordinates(show);
    saveSettings();
}

function toggleLastMoveHighlight() {
    const show = document.getElementById('highlightLastMove').checked;
    chessMaster.settings.highlightLastMove = show;
    saveSettings();
}

function toggleAnimations() {
    const animate = document.getElementById('animatePieces').checked;
    chessMaster.settings.animatePieces = animate;
    saveSettings();
}

function toggleSounds() {
    const play = document.getElementById('playSounds').checked;
    chessMaster.settings.playSounds = play;
    chessMaster.sounds.enabled = play;
    saveSettings();
}

function changeAnimationSpeed() {
    const speed = document.getElementById('moveSpeed').value;
    chessMaster.settings.moveSpeed = speed;
    saveSettings();
}

function saveSettings() {
    Object.keys(chessMaster.settings).forEach(key => {
        localStorage.setItem(key, chessMaster.settings[key]);
    });
    
    alert('Settings saved successfully!');
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes float {
        from { 
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        to { 
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes legalMovePulse {
        0%, 100% { opacity: 0.7; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes captureHighlight {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
    
    @keyframes checkPulse {
        0%, 100% { background-color: rgba(231, 76, 60, 0.6); }
        50% { background-color: rgba(231, 76, 60, 0.9); }
    }
    
    @keyframes statusPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
    }
    
    @keyframes timerPulse {
        0%, 100% { background: var(--danger-color); }
        50% { background: #c0392b; }
    }
    
    .demo-highlight {
        background: rgba(74, 144, 226, 0.3) !important;
        transform: scale(1.05);
        transition: all 0.2s ease;
    }
    
    .highlight {
        background: rgba(243, 156, 18, 0.4) !important;
        box-shadow: inset 0 0 0 2px var(--secondary-color);
    }
`;
document.head.appendChild(style);

// Initialize the application
let chessMaster;
document.addEventListener('DOMContentLoaded', () => {
    chessMaster = new ChessMasterPro();
    console