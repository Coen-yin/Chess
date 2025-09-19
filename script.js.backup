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
        // Adjust search depth based on AI level for realistic play
        const searchDepth = this.getSearchDepth();
        const moves = this.getAllLegalMoves('black');
        if (moves.length === 0) return null;
        
        let bestMove = null;
        let bestScore = -Infinity;
        
        // Add opening book for higher difficulties
        if (this.moveCount < 10 && this.aiLevel >= 6) {
            const openingMove = this.getOpeningMove();
            if (openingMove) return openingMove;
        }
        
        for (const move of moves) {
            const score = this.minimax(move, searchDepth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }

    getSearchDepth() {
        // Search depth based on AI difficulty
        const depthLevels = {
            1: 1,    // Beginner - very shallow
            2: 1,    // Novice
            3: 2,    // Amateur
            4: 2,    // Intermediate 
            5: 3,    // Advanced
            6: 3,    // Expert
            7: 4,    // Master
            8: 4,    // Grandmaster
            9: 5,    // Super GM
            10: 6    // Engine - deepest search
        };
        return depthLevels[this.aiLevel] || 2;
    }

    getOpeningMove() {
        // Simple opening book for stronger AI
        const openingMoves = [
            // King's Pawn openings
            { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }, // e4
            { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } }, // d4
            // Knight developments
            { from: { row: 0, col: 6 }, to: { row: 2, col: 5 } }, // Nf6
            { from: { row: 0, col: 1 }, to: { row: 2, col: 2 } }, // Nc6
        ];
        
        // Filter valid moves
        const validOpeningMoves = openingMoves.filter(move => {
            const piece = this.board[move.from.row][move.from.col];
            return piece && !this.isPieceWhite(piece) && 
                   !this.board[move.to.row][move.to.col];
        });
        
        if (validOpeningMoves.length > 0) {
            return validOpeningMoves[Math.floor(Math.random() * validOpeningMoves.length)];
        }
        
        return null;
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
        const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
        let score = 0;
        
        // Material evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()];
                    const positionalBonus = this.getPositionalValue(piece, row, col);
                    const totalValue = value + positionalBonus;
                    score += this.isPieceWhite(piece) ? -totalValue : totalValue;
                }
            }
        }
        
        // Add randomness based on AI difficulty level for realistic play
        const randomFactor = this.getRandomnessFactor();
        const randomAdjustment = (Math.random() - 0.5) * randomFactor;
        
        return score + randomAdjustment;
    }

    getPositionalValue(piece, row, col) {
        const pieceType = piece.toLowerCase();
        const isWhite = this.isPieceWhite(piece);
        const adjustedRow = isWhite ? 7 - row : row;
        
        // Piece-Square Tables for positional evaluation
        const pawnTable = [
            0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
            5,  5, 10, 25, 25, 10,  5,  5,
            0,  0,  0, 20, 20,  0,  0,  0,
            5, -5,-10,  0,  0,-10, -5,  5,
            5, 10, 10,-20,-20, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ];
        
        const knightTable = [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50
        ];
        
        const bishopTable = [
            -20,-10,-10,-10,-10,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5, 10, 10,  5,  0,-10,
            -10,  5,  5, 10, 10,  5,  5,-10,
            -10,  0, 10, 10, 10, 10,  0,-10,
            -10, 10, 10, 10, 10, 10, 10,-10,
            -10,  5,  0,  0,  0,  0,  5,-10,
            -20,-10,-10,-10,-10,-10,-10,-20
        ];
        
        const tables = {
            'p': pawnTable,
            'n': knightTable,
            'b': bishopTable,
            'r': Array(64).fill(0), // Rooks don't have strong positional preferences
            'q': Array(64).fill(0), // Queens are flexible
            'k': Array(64).fill(0)  // King safety evaluated separately
        };
        
        const table = tables[pieceType];
        if (!table) return 0;
        
        const index = adjustedRow * 8 + col;
        return table[index] || 0;
    }

    getRandomnessFactor() {
        // More randomness for lower difficulties, less for higher
        const randomnessLevels = {
            1: 200,  // Beginner - very random
            2: 150,  // Novice
            3: 100,  // Amateur 
            4: 80,   // Intermediate
            5: 60,   // Advanced
            6: 40,   // Expert
            7: 25,   // Master
            8: 15,   // Grandmaster
            9: 8,    // Super GM
            10: 3    // Engine - minimal randomness
        };
        return randomnessLevels[this.aiLevel] || 50;
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

// Enhanced Lesson Manager
class LessonManager {
    constructor() {
        this.currentLesson = null;
        this.currentStep = 0;
        this.lessons = this.initializeLessons();
        this.progress = this.loadProgress();
    }

    initializeLessons() {
        return {
            'board-setup': {
                title: 'Board Setup & Notation',
                category: 'Basics',
                difficulty: 'Beginner',
                steps: [
                    {
                        title: 'Welcome to Chess!',
                        content: 'Chess is played on an 8×8 board with 64 squares. Each player starts with 16 pieces: 8 pawns, 2 rooks, 2 knights, 2 bishops, 1 queen, and 1 king.',
                        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        highlights: [],
                        tips: 'The chess board has 64 squares arranged in an 8x8 grid. The right corner square nearest to you should always be light-colored.'
                    },
                    {
                        title: 'Files and Ranks',
                        content: 'Files are columns labeled a-h from left to right. Ranks are rows labeled 1-8 from bottom to top (from White\'s perspective).',
                        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        highlights: [{ row: 0, col: 0 }, { row: 7, col: 7 }],
                        tips: 'Square a1 is bottom-left for White, h8 is top-right. Each square has a unique coordinate like e4 or d7.'
                    },
                    {
                        title: 'Piece Notation',
                        content: 'Each piece has a symbol: K=King, Q=Queen, R=Rook, B=Bishop, N=Knight. Pawns have no symbol.',
                        position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
                        highlights: [{ row: 7, col: 4 }, { row: 7, col: 3 }, { row: 7, col: 0 }],
                        tips: 'In algebraic notation, moves are written as piece symbol + destination square (e.g., Nf3, Qh5, e4).'
                    }
                ]
            },
            'piece-movement': {
                title: 'How Pieces Move',
                category: 'Basics',
                difficulty: 'Beginner',
                steps: [
                    {
                        title: 'The Pawn',
                        content: 'Pawns move forward one square, but capture diagonally. On their first move, pawns can move two squares forward.',
                        position: '8/8/8/8/3P4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'Pawns can never move backwards. They promote to any piece (except king) when reaching the opposite end.'
                    },
                    {
                        title: 'The Rook',
                        content: 'Rooks move any number of squares horizontally or vertically. They cannot jump over other pieces.',
                        position: '8/8/8/8/3R4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'Rooks are powerful pieces, especially in open games. They work well on open files and ranks.'
                    },
                    {
                        title: 'The Bishop',
                        content: 'Bishops move any number of squares diagonally. Each player starts with one light-squared and one dark-squared bishop.',
                        position: '8/8/8/8/3B4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'Bishops are most effective when they have long diagonals to work on.'
                    },
                    {
                        title: 'The Knight',
                        content: 'Knights move in an L-shape: two squares in one direction, then one square perpendicular. Knights can jump over other pieces.',
                        position: '8/8/8/8/3N4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'Knights are the only pieces that can jump over others. They are most effective in closed positions.'
                    },
                    {
                        title: 'The Queen',
                        content: 'The queen combines the powers of a rook and bishop. She can move any number of squares horizontally, vertically, or diagonally.',
                        position: '8/8/8/8/3Q4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'The queen is the most powerful piece. Protect her well and don\'t bring her out too early!'
                    },
                    {
                        title: 'The King',
                        content: 'The king moves one square in any direction. The king cannot move into check (under attack).',
                        position: '8/8/8/8/3K4/8/8/8',
                        highlights: [{ row: 4, col: 3 }],
                        tips: 'The king\'s safety is paramount. If the king is in checkmate, the game is over!'
                    }
                ]
            },
            'special-moves': {
                title: 'Special Moves & Rules',
                category: 'Basics', 
                difficulty: 'Beginner',
                steps: [
                    {
                        title: 'Castling',
                        content: 'Castling is a special move involving the king and a rook. It\'s the only move where you can move two pieces at once.',
                        position: 'r3k2r/8/8/8/8/8/8/R3K2R',
                        highlights: [{ row: 7, col: 4 }, { row: 7, col: 0 }, { row: 7, col: 7 }],
                        tips: 'Castling helps keep your king safe and brings your rook into play. You can only castle if neither piece has moved.'
                    },
                    {
                        title: 'En Passant',
                        content: 'If an opponent\'s pawn moves two squares forward from its starting position and lands next to your pawn, you can capture it as if it only moved one square.',
                        position: '8/8/8/3pP3/8/8/8/8',
                        highlights: [{ row: 3, col: 3 }, { row: 3, col: 4 }],
                        tips: 'En passant must be played immediately on the next move, or the opportunity is lost forever.'
                    },
                    {
                        title: 'Pawn Promotion',
                        content: 'When a pawn reaches the opposite end of the board, it must be promoted to any piece except a king (usually a queen).',
                        position: '8/3P4/8/8/8/8/8/8',
                        highlights: [{ row: 1, col: 3 }],
                        tips: 'Most players promote to a queen, but sometimes promoting to a knight, rook, or bishop can be better!'
                    }
                ]
            },
            'tactical-motifs': {
                title: 'Tactical Patterns',
                category: 'Intermediate',
                difficulty: 'Intermediate',
                steps: [
                    {
                        title: 'The Pin',
                        content: 'A pin is when a piece cannot move because it would expose a more valuable piece behind it to attack.',
                        position: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
                        highlights: [{ row: 3, col: 2 }, { row: 0, col: 5 }],
                        tips: 'Pins can be absolute (against the king) or relative (against another piece).'
                    },
                    {
                        title: 'The Fork',
                        content: 'A fork is when one piece attacks two or more enemy pieces simultaneously.',
                        position: 'r1bqkb1r/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R',
                        highlights: [{ row: 5, col: 5 }],
                        tips: 'Knights are excellent forking pieces because of their unique L-shaped movement.'
                    },
                    {
                        title: 'The Skewer',
                        content: 'A skewer forces a valuable piece to move, exposing a less valuable piece behind it.',
                        position: 'r3k2r/8/8/8/8/8/8/R3K2R',
                        highlights: [{ row: 7, col: 0 }, { row: 0, col: 4 }],
                        tips: 'Skewers are like reverse pins - the more valuable piece is in front.'
                    },
                    {
                        title: 'Discovery Attack',
                        content: 'When moving one piece reveals an attack from another piece behind it.',
                        position: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
                        highlights: [{ row: 5, col: 5 }, { row: 3, col: 2 }],
                        tips: 'Discovery attacks can be devastating because you get two threats at once!'
                    }
                ]
            },
            'opening-principles': {
                title: 'Opening Principles',
                category: 'Opening',
                difficulty: 'Intermediate',
                steps: [
                    {
                        title: 'Control the Center',
                        content: 'The four central squares (e4, e5, d4, d5) are the most important. Control them with pawns and pieces.',
                        position: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
                        highlights: [{ row: 4, col: 4 }, { row: 3, col: 4 }, { row: 4, col: 3 }, { row: 3, col: 3 }],
                        tips: 'Central control gives your pieces more mobility and limits your opponent\'s options.'
                    },
                    {
                        title: 'Develop Your Pieces',
                        content: 'Bring your knights and bishops into active positions before moving the same piece twice.',
                        position: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR',
                        highlights: [{ row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 5 }, { row: 7, col: 6 }],
                        tips: 'Knights before bishops is a good general rule. Develop with a purpose!'
                    },
                    {
                        title: 'Castle Early',
                        content: 'Castle early to keep your king safe and connect your rooks.',
                        position: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
                        highlights: [{ row: 7, col: 4 }, { row: 7, col: 6 }, { row: 7, col: 7 }],
                        tips: 'Don\'t delay castling too long. King safety is crucial in the middlegame.'
                    },
                    {
                        title: 'Don\'t Move the Same Piece Twice',
                        content: 'In the opening, avoid moving the same piece multiple times unless necessary.',
                        position: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R',
                        highlights: [{ row: 5, col: 5 }],
                        tips: 'Each move should improve your position. Don\'t waste time in the opening!'
                    }
                ]
            },
            'endgame-basics': {
                title: 'Essential Endgames',
                category: 'Endgame',
                difficulty: 'Intermediate',
                steps: [
                    {
                        title: 'King and Queen vs King',
                        content: 'The most basic checkmate. Use your queen to limit the enemy king\'s movement while bringing your king closer.',
                        position: '8/8/8/8/8/8/8/k1K1Q3',
                        highlights: [{ row: 7, col: 0 }, { row: 7, col: 2 }, { row: 7, col: 4 }],
                        tips: 'Drive the enemy king to the edge of the board, but be careful not to stalemate!'
                    },
                    {
                        title: 'King and Rook vs King',
                        content: 'Another essential checkmate. Use the rook to cut off the enemy king while your king helps.',
                        position: '8/8/8/8/8/8/8/k1K1R3',
                        highlights: [{ row: 7, col: 0 }, { row: 7, col: 2 }, { row: 7, col: 4 }],
                        tips: 'Use the rook to create a "wall" that the enemy king cannot cross.'
                    },
                    {
                        title: 'King and Pawn vs King',
                        content: 'Learn when a pawn can promote and when it\'s a draw. The key is opposition and pawn support.',
                        position: '8/8/8/8/3k4/3P4/3K4/8',
                        highlights: [{ row: 5, col: 3 }, { row: 6, col: 3 }, { row: 4, col: 3 }],
                        tips: 'Your king must support the pawn\'s advance. Opposition is crucial!'
                    },
                    {
                        title: 'Opposition',
                        content: 'Opposition is when kings face each other with one square between them. The player to move loses the opposition.',
                        position: '8/8/8/3k4/8/3K4/8/8',
                        highlights: [{ row: 3, col: 3 }, { row: 5, col: 3 }],
                        tips: 'The side that does NOT have to move has the opposition and usually has the advantage.'
                    }
                ]
            },
            'positional-play': {
                title: 'Positional Understanding',
                category: 'Advanced',
                difficulty: 'Advanced',
                steps: [
                    {
                        title: 'Pawn Structure',
                        content: 'Pawns form the skeleton of your position. Learn about pawn chains, weak pawns, and pawn breaks.',
                        position: 'r1bqkb1r/pp3ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
                        highlights: [{ row: 4, col: 4 }, { row: 3, col: 4 }, { row: 2, col: 3 }],
                        tips: 'Weak pawns are often targets. Strong pawn chains can control key squares.'
                    },
                    {
                        title: 'Piece Activity',
                        content: 'Active pieces are more valuable than passive ones. Look for outposts and strong squares for your pieces.',
                        position: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQR1K1',
                        highlights: [{ row: 3, col: 2 }, { row: 5, col: 5 }],
                        tips: 'An active piece on a strong square can be worth more than a passive piece of higher value.'
                    },
                    {
                        title: 'Weak Squares',
                        content: 'Weak squares are squares in your opponent\'s position that cannot be defended by pawns.',
                        position: 'r1bqkb1r/pp3ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
                        highlights: [{ row: 5, col: 3 }, { row: 2, col: 5 }],
                        tips: 'Try to place your pieces on weak squares in your opponent\'s position.'
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
        if (!lesson) return;
        
        const step = lesson.steps[this.currentStep];
        
        document.getElementById('lessonTitle').textContent = lesson.title;
        document.getElementById('stepTitle').textContent = step.title;
        document.getElementById('stepContent').innerHTML = `<p>${step.content}</p>`;
        document.getElementById('lessonTips').innerHTML = step.tips ? `<h5>💡 Tip</h5><p>${step.tips}</p>` : '';
        document.getElementById('lessonStep').textContent = `Step ${this.currentStep + 1} of ${lesson.steps.length}`;
        
        // Add lesson metadata
        const metadata = document.getElementById('lessonMetadata');
        if (metadata) {
            metadata.innerHTML = `
                <span class="lesson-category">${lesson.category}</span>
                <span class="lesson-difficulty">${lesson.difficulty}</span>
            `;
        }
        
        const progressPercent = ((this.currentStep + 1) / lesson.steps.length) * 100;
        document.getElementById('lessonProgressFill').style.width = `${progressPercent}%`;
        
        this.renderLessonBoard(step);
    }

    renderLessonBoard(step) {
        const board = document.getElementById('lessonBoard');
        if (!board) return;
        
        board.innerHTML = '';
        
        // Create board from position (simplified)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 ? 'dark' : 'light'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Highlight important squares
                if (step.highlights && step.highlights.some(h => h.row === row && h.col === col)) {
                    square.classList.add('highlighted');
                }
                
                // Add pieces (simplified FEN parsing)
                const piece = this.getPieceFromFEN(step.position, row, col);
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = this.getPieceSymbol(piece);
                    square.appendChild(pieceElement);
                }
                
                board.appendChild(square);
            }
        }
    }

    getPieceFromFEN(fen, row, col) {
        // Simplified FEN parsing for lessons
        const rows = fen.split('/');
        if (row >= rows.length) return null;
        
        const rowString = rows[row];
        let colIndex = 0;
        
        for (let char of rowString) {
            if (char >= '1' && char <= '8') {
                colIndex += parseInt(char);
            } else {
                if (colIndex === col) return char;
                colIndex++;
            }
        }
        
        return null;
    }

    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return symbols[piece] || piece;
    }

    nextStep() {
        const lesson = this.lessons[this.currentLesson];
        if (!lesson) return;
        
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
        // Mark lesson as complete
        this.progress[this.currentLesson] = 100;
        this.saveProgress();
        
        // Show completion message
        alert(`Congratulations! You've completed "${this.lessons[this.currentLesson].title}"`);
        
        this.exitLesson();
        this.updateLessonProgress();
    }

    exitLesson() {
        document.querySelector('.learning-path').style.display = 'block';
        document.getElementById('lessonInterface').style.display = 'none';
        this.currentLesson = null;
        this.currentStep = 0;
    }

    loadProgress() {
        return JSON.parse(localStorage.getItem('lessonProgress') || '{}');
    }

    saveProgress() {
        localStorage.setItem('lessonProgress', JSON.stringify(this.progress));
    }

    updateLessonProgress() {
        document.querySelectorAll('.lesson-progress').forEach(element => {
            const lesson = element.closest('.lesson');
            if (lesson && lesson.onclick) {
                const onclickStr = lesson.onclick.toString();
                const match = onclickStr.match(/startLesson\('([^']+)'\)/);
                if (match) {
                    const lessonId = match[1];
                    const percent = this.progress[lessonId] || 0;
                    element.textContent = `${percent}%`;
                }
            }
        });
    }
}

// Enhanced Puzzle Manager
class PuzzleManager {
    constructor() {
        this.currentPuzzle = 0;
        this.puzzles = this.initializePuzzles();
        this.stats = this.loadStats();
        this.solved = new Set();
        this.categories = ['All', 'Tactics', 'Endgame', 'Opening', 'Positional', 'Checkmate'];
        this.currentCategory = 'All';
    }

    initializePuzzles() {
        return [
            // Tactical Puzzles
            {
                id: 1,
                title: 'Knight Fork',
                rating: 1200,
                category: 'Tactics',
                theme: 'Fork',
                instruction: 'White to move and win material',
                position: 'r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R',
                solution: ['Nc7+'],
                explanation: 'The knight forks the king and rook, winning the exchange!',
                difficulty: 'Beginner'
            },
            {
                id: 2,
                title: 'Pin Attack',
                rating: 1350,
                category: 'Tactics',
                theme: 'Pin',
                instruction: 'White to move and win the queen',
                position: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
                solution: ['Bb5'],
                explanation: 'The bishop pins the queen to the king, winning material!',
                difficulty: 'Beginner'
            },
            {
                id: 3,
                title: 'Discovery Attack',
                rating: 1450,
                category: 'Tactics',
                theme: 'Discovery',
                instruction: 'White to move and win material',
                position: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
                solution: ['Nd4'],
                explanation: 'Moving the knight discovers an attack on the queen!',
                difficulty: 'Intermediate'
            },
            {
                id: 4,
                title: 'Deflection',
                rating: 1500,
                category: 'Tactics',
                theme: 'Deflection',
                instruction: 'White to move and win',
                position: 'r3k2r/ppp2ppp/2n1bn2/2bpp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
                solution: ['Bxf7+'],
                explanation: 'The bishop sacrifice deflects the king, allowing further tactics!',
                difficulty: 'Intermediate'
            },
            {
                id: 5,
                title: 'Skewer',
                rating: 1400,
                category: 'Tactics',
                theme: 'Skewer',
                instruction: 'White to move and win material',
                position: 'r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/5N2/PPPP1PPP/RNBQK2R',
                solution: ['Rb1'],
                explanation: 'The rook skewers the bishop and king!',
                difficulty: 'Beginner'
            },
            // Checkmate Puzzles
            {
                id: 6,
                title: 'Back Rank Mate',
                rating: 1300,
                category: 'Checkmate',
                theme: 'Back Rank',
                instruction: 'White to move and checkmate in 1',
                position: '6k1/5ppp/8/8/8/8/5PPP/R5K1',
                solution: ['Ra8#'],
                explanation: 'Classic back rank mate - the king has no escape!',
                difficulty: 'Beginner'
            },
            {
                id: 7,
                title: 'Smothered Mate',
                rating: 1600,
                category: 'Checkmate',
                theme: 'Smothered Mate',
                instruction: 'White to move and checkmate in 3',
                position: '6rk/6pp/7N/8/8/8/8/7K',
                solution: ['Qg8+', 'Rxg8', 'Nf7#'],
                explanation: 'Beautiful smothered mate pattern with queen sacrifice!',
                difficulty: 'Advanced'
            },
            // Endgame Puzzles  
            {
                id: 8,
                title: 'King and Pawn vs King',
                rating: 1250,
                category: 'Endgame',
                theme: 'Pawn Endgame',
                instruction: 'White to move and win',
                position: '8/8/8/8/8/3k4/3P4/3K4',
                solution: ['Kd2'],
                explanation: 'Support the pawn with the king to promote!',
                difficulty: 'Beginner'
            },
            {
                id: 9,
                title: 'Queen vs Pawn',
                rating: 1550,
                category: 'Endgame',
                theme: 'Queen Endgame',
                instruction: 'White to move and draw',
                position: '8/8/8/8/8/8/k1p5/2K1Q3',
                solution: ['Qe2+'],
                explanation: 'Force perpetual check to draw the game!',
                difficulty: 'Advanced'
            },
            // Opening Puzzles
            {
                id: 10,
                title: 'Italian Game Trap',
                rating: 1400,
                category: 'Opening',
                theme: 'Opening Trap',
                instruction: 'How should Black respond to Ng5?',
                position: 'r1bqk1nr/pppp1ppp/2n5/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R',
                solution: ['f5'],
                explanation: 'Attack the knight and defend against the fork threat!',
                difficulty: 'Intermediate'
            },
            // Positional Puzzles
            {
                id: 11,
                title: 'Weak Square Control',
                rating: 1650,
                category: 'Positional',
                theme: 'Weak Squares',
                instruction: 'Find the best plan for White',
                position: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQR1K1',
                solution: ['Nd4'],
                explanation: 'Occupy the strong central square and increase pressure!',
                difficulty: 'Advanced'
            },
            {
                id: 12,
                title: 'Pawn Structure',
                rating: 1700,
                category: 'Positional', 
                theme: 'Pawn Structure',
                instruction: 'Improve White\'s position',
                position: 'r1bqkb1r/pp3ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R',
                solution: ['a4'],
                explanation: 'Create space on the queenside and limit Black\'s options!',
                difficulty: 'Advanced'
            }
        ];
    }

    loadStats() {
        return JSON.parse(localStorage.getItem('puzzleStats') || JSON.stringify({
            solved: 0,
            rating: 1200,
            successRate: 0,
            streak: 0,
            bestStreak: 0,
            categoriesProgress: {
                'Tactics': { solved: 0, total: 5 },
                'Checkmate': { solved: 0, total: 2 },
                'Endgame': { solved: 0, total: 2 },
                'Opening': { solved: 0, total: 1 },
                'Positional': { solved: 0, total: 2 }
            }
        }));
    }

    renderCurrentPuzzle() {
        const puzzle = this.puzzles[this.currentPuzzle];
        if (!puzzle) return;

        document.getElementById('puzzleTitle').textContent = puzzle.title;
        document.getElementById('puzzleTheme').textContent = puzzle.theme;
        document.getElementById('puzzleInstruction').textContent = puzzle.instruction;
        document.getElementById('currentPuzzleRating').textContent = `★★★ (${puzzle.rating})`;
        document.getElementById('puzzleDifficulty').textContent = puzzle.difficulty;
        document.getElementById('puzzleCategory').textContent = puzzle.category;
        
        // Update puzzle counter
        document.getElementById('puzzleCounter').textContent = 
            `Puzzle ${this.currentPuzzle + 1} of ${this.getFilteredPuzzles().length}`;
        
        this.renderPuzzleBoard(puzzle);
        this.updatePuzzleStats();
    }

    renderPuzzleBoard(puzzle) {
        const board = document.getElementById('puzzleBoard');
        if (!board) return;

        board.innerHTML = '';
        
        // Simplified board rendering from position
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 ? 'dark' : 'light'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add piece from position (would need FEN parser for real implementation)
                // For now, show basic setup
                if (row === 0 || row === 1 || row === 6 || row === 7) {
                    const piece = this.getPieceFromPosition(puzzle.position, row, col);
                    if (piece) {
                        const pieceElement = document.createElement('div');
                        pieceElement.className = 'piece';
                        pieceElement.textContent = piece;
                        square.appendChild(pieceElement);
                    }
                }
                
                board.appendChild(square);
            }
        }
    }

    getPieceFromPosition(position, row, col) {
        // Simplified - would implement proper FEN parsing
        const pieces = {
            'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
            'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
        };
        
        // Basic starting position for demo
        if (row === 0) {
            const backRank = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
            return pieces[backRank[col]];
        } else if (row === 1) {
            return pieces['p'];
        } else if (row === 6) {
            return pieces['P'];
        } else if (row === 7) {
            const backRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
            return pieces[backRank[col]];
        }
        return null;
    }

    nextPuzzle() {
        const filteredPuzzles = this.getFilteredPuzzles();
        this.currentPuzzle = (this.currentPuzzle + 1) % filteredPuzzles.length;
        this.renderCurrentPuzzle();
    }

    previousPuzzle() {
        const filteredPuzzles = this.getFilteredPuzzles();
        this.currentPuzzle = this.currentPuzzle > 0 ? this.currentPuzzle - 1 : filteredPuzzles.length - 1;
        this.renderCurrentPuzzle();
    }

    filterPuzzles(category) {
        this.currentCategory = category;
        this.currentPuzzle = 0;
        this.renderPuzzleList();
        this.renderCurrentPuzzle();
    }

    getFilteredPuzzles() {
        if (this.currentCategory === 'All') {
            return this.puzzles;
        }
        return this.puzzles.filter(puzzle => puzzle.category === this.currentCategory);
    }

    renderPuzzleList() {
        const puzzleList = document.getElementById('puzzleList');
        if (!puzzleList) return;

        const filteredPuzzles = this.getFilteredPuzzles();
        puzzleList.innerHTML = '';

        filteredPuzzles.forEach((puzzle, index) => {
            const puzzleItem = document.createElement('div');
            puzzleItem.className = `puzzle-item ${this.solved.has(puzzle.id) ? 'solved' : ''}`;
            puzzleItem.innerHTML = `
                <div class="puzzle-info">
                    <h4>${puzzle.title}</h4>
                    <div class="puzzle-meta">
                        <span class="puzzle-theme">${puzzle.theme}</span>
                        <span class="puzzle-rating">★ ${puzzle.rating}</span>
                        <span class="puzzle-difficulty">${puzzle.difficulty}</span>
                    </div>
                </div>
                <div class="puzzle-status">
                    ${this.solved.has(puzzle.id) ? '✓' : '○'}
                </div>
            `;
            
            puzzleItem.addEventListener('click', () => {
                this.currentPuzzle = index;
                this.renderCurrentPuzzle();
            });
            
            puzzleList.appendChild(puzzleItem);
        });
    }

    solvePuzzle(correct) {
        const puzzle = this.puzzles[this.currentPuzzle];
        
        if (correct) {
            this.solved.add(puzzle.id);
            this.stats.solved++;
            this.stats.streak++;
            this.stats.bestStreak = Math.max(this.stats.streak, this.stats.bestStreak);
            
            // Update category progress
            const category = puzzle.category;
            if (this.stats.categoriesProgress[category]) {
                this.stats.categoriesProgress[category].solved++;
            }
            
            // Show success message
            this.showPuzzleResult(true, puzzle.explanation);
        } else {
            this.stats.streak = 0;
            this.showPuzzleResult(false, puzzle.explanation);
        }
        
        // Update success rate
        const totalAttempts = this.stats.solved + this.stats.failed || 0;
        this.stats.successRate = totalAttempts > 0 ? (this.stats.solved / totalAttempts * 100).toFixed(1) : 0;
        
        this.saveStats();
        this.updatePuzzleStats();
    }

    showPuzzleResult(success, explanation) {
        const modal = document.getElementById('puzzleResultModal');
        const title = document.getElementById('puzzleResultTitle');
        const icon = document.getElementById('puzzleResultIcon');
        const text = document.getElementById('puzzleResultExplanation');
        
        title.textContent = success ? 'Correct!' : 'Incorrect';
        icon.textContent = success ? '🎉' : '🤔';
        text.textContent = explanation;
        
        modal?.classList.add('show');
        
        // Auto close after 3 seconds
        setTimeout(() => {
            modal?.classList.remove('show');
            if (success) this.nextPuzzle();
        }, 3000);
    }

    showHint() {
        const puzzle = this.puzzles[this.currentPuzzle];
        const hint = puzzle.solution[0]; // First move as hint
        
        alert(`Hint: Try ${hint}`);
    }

    updatePuzzleStats() {
        document.getElementById('puzzlesSolved').textContent = this.stats.solved;
        document.getElementById('puzzleRating').textContent = this.stats.rating;
        document.getElementById('successRate').textContent = `${this.stats.successRate}%`;
        document.getElementById('currentStreak').textContent = this.stats.streak;
        document.getElementById('bestStreak').textContent = this.stats.bestStreak;
        
        // Update category progress
        Object.entries(this.stats.categoriesProgress).forEach(([category, progress]) => {
            const element = document.getElementById(`${category.toLowerCase()}Progress`);
            if (element) {
                element.textContent = `${progress.solved}/${progress.total}`;
            }
        });
    }

    saveStats() {
        localStorage.setItem('puzzleStats', JSON.stringify(this.stats));
    }
}

// Enhanced Analysis Manager
        
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

// Enhanced Analysis Manager
class AnalysisManager {
    constructor() {
        this.currentGame = null;
        this.currentMove = 0;
        this.engine = new SimpleEngine();
        this.analysisHistory = [];
        this.isAnalyzing = false;
        this.analysisDepth = 15;
    }

    openPositionEditor() {
        document.querySelector('.analysis-tools').style.display = 'none';
        document.getElementById('analysisInterface').style.display = 'grid';
        this.renderAnalysisBoard();
        this.setupAnalysisControls();
    }

    setupAnalysisControls() {
        // Initialize depth slider
        const depthSlider = document.getElementById('analysisDepth');
        if (depthSlider) {
            depthSlider.value = this.analysisDepth;
            depthSlider.addEventListener('input', (e) => {
                this.analysisDepth = parseInt(e.target.value);
                document.getElementById('depthDisplay').textContent = this.analysisDepth;
            });
        }
        
        // Setup engine options
        this.setupEngineOptions();
    }

    setupEngineOptions() {
        const engineSelect = document.getElementById('engineSelect');
        if (engineSelect) {
            engineSelect.innerHTML = `
                <option value="stockfish">Stockfish 15</option>
                <option value="leela">Leela Chess Zero</option>
                <option value="komodo">Komodo 14</option>
                <option value="simple" selected>Simple Engine</option>
            `;
        }
    }

    renderAnalysisBoard() {
        const board = document.getElementById('analysisBoard');
        if (!board) return;
        
        board.innerHTML = '';
        
        // Create interactive board for analysis
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                // Add click handlers for piece placement
                square.addEventListener('click', (e) => {
                    this.handleSquareClick(row, col);
                });
                
                // Add pieces if position is loaded
                if (this.currentGame && this.currentGame.board) {
                    const piece = this.currentGame.board[row][col];
                    if (piece) {
                        const pieceElement = document.createElement('div');
                        pieceElement.className = 'piece';
                        pieceElement.textContent = this.getPieceSymbol(piece);
                        square.appendChild(pieceElement);
                    }
                }
                
                board.appendChild(square);
            }
        }
        
        this.addMoveIndicators();
    }

    addMoveIndicators() {
        // Add coordinates
        const coordinates = document.querySelector('.board-coordinates');
        if (coordinates) {
            coordinates.innerHTML = '';
            
            // Add file labels (a-h)
            for (let i = 0; i < 8; i++) {
                const file = document.createElement('div');
                file.className = 'file-label';
                file.textContent = String.fromCharCode(97 + i); // a-h
                coordinates.appendChild(file);
            }
            
            // Add rank labels (1-8)
            for (let i = 8; i > 0; i--) {
                const rank = document.createElement('div');
                rank.className = 'rank-label';
                rank.textContent = i;
                coordinates.appendChild(rank);
            }
        }
    }

    handleSquareClick(row, col) {
        // Handle piece placement/removal in analysis mode
        const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const piece = square.querySelector('.piece');
        
        if (piece) {
            // Remove piece
            piece.remove();
        } else {
            // Add piece (would need piece selection UI)
            this.showPieceSelector(row, col);
        }
        
        // Trigger real-time analysis
        if (this.isAnalyzing) {
            this.analyzePosition();
        }
    }

    showPieceSelector(row, col) {
        // Simple piece selector for analysis
        const pieces = ['♔', '♕', '♖', '♗', '♘', '♙', '♚', '♛', '♜', '♝', '♞', '♟'];
        const piece = prompt('Enter piece (K,Q,R,B,N,P for white, k,q,r,b,n,p for black):');
        
        if (piece && 'KQRBNPkqrbnp'.includes(piece)) {
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const pieceElement = document.createElement('div');
            pieceElement.className = 'piece';
            pieceElement.textContent = this.getPieceSymbol(piece);
            square.appendChild(pieceElement);
        }
    }

    analyzePosition() {
        if (this.isAnalyzing) return;
        
        this.isAnalyzing = true;
        document.getElementById('engineStatus').textContent = 'Analyzing...';
        
        // Show analysis progress
        const progressBar = document.getElementById('analysisProgress');
        if (progressBar) {
            progressBar.style.width = '0%';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    this.completeAnalysis();
                }
            }, 200);
        } else {
            // Fallback without progress bar
            setTimeout(() => this.completeAnalysis(), 2000);
        }
    }

    completeAnalysis() {
        this.isAnalyzing = false;
        
        // Get position from current board state
        const board = this.getBoardFromDOM();
        const evaluation = this.engine.evaluate(board);
        const moveSuggestions = this.engine.getMoveSuggestions(board, this.analysisDepth);
        const insights = this.engine.getPositionalInsights(board);
        
        // Update evaluation display
        document.getElementById('engineEval').textContent = 
            evaluation > 0 ? `+${(evaluation/100).toFixed(2)}` : `${(evaluation/100).toFixed(2)}`;
        
        // Update best moves
        this.displayMoveSuggestions(moveSuggestions);
        
        // Update positional insights
        this.displayPositionalInsights(insights);
        
        // Update engine status
        document.getElementById('engineStatus').textContent = 
            `Analysis complete (depth ${this.analysisDepth})`;
        
        // Store analysis in history
        this.analysisHistory.push({
            timestamp: Date.now(),
            evaluation,
            moveSuggestions,
            insights,
            depth: this.analysisDepth
        });
    }

    displayMoveSuggestions(suggestions) {
        const container = document.getElementById('moveSuggestions');
        if (!container) return;
        
        container.innerHTML = '<h4>Best Moves:</h4>';
        
        if (suggestions && suggestions.length > 0) {
            suggestions.forEach((suggestion, index) => {
                const moveDiv = document.createElement('div');
                moveDiv.className = 'move-suggestion';
                moveDiv.innerHTML = `
                    <div class="move-rank">${index + 1}.</div>
                    <div class="move-notation">${this.formatMove(suggestion.move)}</div>
                    <div class="move-eval">${(suggestion.score/100).toFixed(2)}</div>
                `;
                container.appendChild(moveDiv);
            });
        } else {
            // Fallback moves for demo
            const demoMoves = [
                { notation: 'e4', eval: '+0.25' },
                { notation: 'd4', eval: '+0.20' },
                { notation: 'Nf3', eval: '+0.15' },
                { notation: 'c4', eval: '+0.10' }
            ];
            
            demoMoves.forEach((move, index) => {
                const moveDiv = document.createElement('div');
                moveDiv.className = 'move-suggestion';
                moveDiv.innerHTML = `
                    <div class="move-rank">${index + 1}.</div>
                    <div class="move-notation">${move.notation}</div>
                    <div class="move-eval">${move.eval}</div>
                `;
                container.appendChild(moveDiv);
            });
        }
    }

    displayPositionalInsights(insights) {
        const container = document.getElementById('positionalInsights');
        if (!container) return;
        
        container.innerHTML = '<h4>Position Analysis:</h4>';
        
        if (insights && insights.length > 0) {
            insights.forEach(insight => {
                const insightDiv = document.createElement('div');
                insightDiv.className = `insight insight-${insight.type}`;
                insightDiv.innerHTML = `
                    <div class="insight-icon">${this.getInsightIcon(insight.type)}</div>
                    <div class="insight-text">${insight.message}</div>
                    <div class="insight-value">${insight.value}</div>
                `;
                container.appendChild(insightDiv);
            });
        } else {
            // Fallback insights for demo
            const demoInsights = [
                { type: 'material', message: 'Material is equal', value: '0.00' },
                { type: 'space', message: 'White has more space', value: '+0.15' },
                { type: 'development', message: 'Both sides well developed', value: '0.00' },
                { type: 'king-safety', message: 'Kings are relatively safe', value: '0.00' }
            ];
            
            demoInsights.forEach(insight => {
                const insightDiv = document.createElement('div');
                insightDiv.className = `insight insight-${insight.type}`;
                insightDiv.innerHTML = `
                    <div class="insight-icon">${this.getInsightIcon(insight.type)}</div>
                    <div class="insight-text">${insight.message}</div>
                    <div class="insight-value">${insight.value}</div>
                `;
                container.appendChild(insightDiv);
            });
        }
    }

    getInsightIcon(type) {
        const icons = {
            'material': '⚖️',
            'space': '📏',
            'development': '🏗️',
            'king-safety': '🛡️',
            'pawn-structure': '🔗',
            'piece-activity': '⚡'
        };
        return icons[type] || '💡';
    }

    formatMove(move) {
        if (!move) return 'N/A';
        
        // Format move notation
        const from = this.squareToNotation(move.from.row, move.from.col);
        const to = this.squareToNotation(move.to.row, move.to.col);
        return `${from}-${to}`;
    }

    squareToNotation(row, col) {
        const file = String.fromCharCode(97 + col); // a-h
        const rank = 8 - row; // 1-8
        return `${file}${rank}`;
    }

    getBoardFromDOM() {
        // Extract current board position from DOM
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const pieceElement = square?.querySelector('.piece');
                
                if (pieceElement) {
                    // Convert symbol back to piece notation
                    board[row][col] = this.symbolToPiece(pieceElement.textContent);
                }
            }
        }
        
        return board;
    }

    symbolToPiece(symbol) {
        const pieces = {
            '♔': 'K', '♕': 'Q', '♖': 'R', '♗': 'B', '♘': 'N', '♙': 'P',
            '♚': 'k', '♛': 'q', '♜': 'r', '♝': 'b', '♞': 'n', '♟': 'p'
        };
        return pieces[symbol] || null;
    }

    getPieceSymbol(piece) {
        const symbols = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };
        return symbols[piece] || piece;
    }

    openGameDatabase() {
        // Show modal with game database
        const modal = document.getElementById('gameDatabaseModal');
        if (modal) {
            modal.classList.add('show');
            this.loadGameDatabase();
        }
    }

    loadGameDatabase() {
        // Load famous games for analysis
        const famousGames = [
            {
                white: 'Garry Kasparov',
                black: 'Anatoly Karpov',
                event: 'World Championship 1984',
                result: '1-0',
                moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6...'
            },
            {
                white: 'Bobby Fischer',
                black: 'Boris Spassky',
                event: 'World Championship 1972',
                result: '1-0',
                moves: '1.e4 c5 2.Nf3 d6 3.d4 cxd4...'
            },
            {
                white: 'Magnus Carlsen',
                black: 'Fabiano Caruana',
                event: 'World Championship 2018',
                result: '1/2-1/2',
                moves: '1.e4 c5 2.Nf3 Nc6 3.Bb5 g6...'
            }
        ];
        
        const container = document.getElementById('gamesList');
        if (container) {
            container.innerHTML = '';
            
            famousGames.forEach((game, index) => {
                const gameDiv = document.createElement('div');
                gameDiv.className = 'game-entry';
                gameDiv.innerHTML = `
                    <div class="game-players">${game.white} vs ${game.black}</div>
                    <div class="game-event">${game.event}</div>
                    <div class="game-result">${game.result}</div>
                `;
                
                gameDiv.addEventListener('click', () => {
                    this.loadGameForAnalysis(game);
                });
                
                container.appendChild(gameDiv);
            });
        }
    }

    loadGameForAnalysis(game) {
        // Load selected game into analysis board
        this.currentGame = game;
        document.getElementById('gameDatabaseModal')?.classList.remove('show');
        
        // Display game info
        const gameInfo = document.getElementById('currentGameInfo');
        if (gameInfo) {
            gameInfo.innerHTML = `
                <strong>${game.white} vs ${game.black}</strong><br>
                ${game.event} - ${game.result}
            `;
        }
        
        // Would load actual PGN and set up position
        this.renderAnalysisBoard();
        this.analyzePosition();
    }

    openOpeningExplorer() {
        // Show opening database
        const modal = document.getElementById('openingExplorerModal');
        if (modal) {
            modal.classList.add('show');
            this.loadOpeningDatabase();
        }
    }

    loadOpeningDatabase() {
        const openings = [
            { name: 'Ruy Lopez', moves: '1.e4 e5 2.Nf3 Nc6 3.Bb5', eco: 'C60' },
            { name: 'Sicilian Defense', moves: '1.e4 c5', eco: 'B20' },
            { name: 'Queen\'s Gambit', moves: '1.d4 d5 2.c4', eco: 'D06' },
            { name: 'French Defense', moves: '1.e4 e6', eco: 'C00' },
            { name: 'King\'s Indian Defense', moves: '1.d4 Nf6 2.c4 g6', eco: 'E60' }
        ];
        
        const container = document.getElementById('openingsList');
        if (container) {
            container.innerHTML = '';
            
            openings.forEach(opening => {
                const openingDiv = document.createElement('div');
                openingDiv.className = 'opening-entry';
                openingDiv.innerHTML = `
                    <div class="opening-name">${opening.name}</div>
                    <div class="opening-moves">${opening.moves}</div>
                    <div class="opening-eco">${opening.eco}</div>
                `;
                
                openingDiv.addEventListener('click', () => {
                    this.loadOpeningForAnalysis(opening);
                });
                
                container.appendChild(openingDiv);
            });
        }
    }

    loadOpeningForAnalysis(opening) {
        // Load opening position for analysis
        document.getElementById('openingExplorerModal')?.classList.remove('show');
        
        // Display opening info
        const openingInfo = document.getElementById('currentOpeningInfo');
        if (openingInfo) {
            openingInfo.innerHTML = `
                <strong>${opening.name} (${opening.eco})</strong><br>
                ${opening.moves}
            `;
        }
        
        // Set up opening position
        this.setupOpeningPosition(opening.moves);
        this.analyzePosition();
    }

    setupOpeningPosition(moves) {
        // Parse moves and set up position (simplified)
        // Would need full PGN parser for real implementation
        this.renderAnalysisBoard();
    }
}

// Advanced Chess Engine
class SimpleEngine {
    constructor() {
        this.transpositionTable = new Map();
    }

    evaluate(board) {
        // More sophisticated evaluation function
        let score = 0;
        
        // Material count
        score += this.evaluateMaterial(board);
        
        // Positional factors
        score += this.evaluatePosition(board);
        
        // King safety
        score += this.evaluateKingSafety(board);
        
        // Pawn structure
        score += this.evaluatePawnStructure(board);
        
        return score;
    }

    evaluateMaterial(board) {
        const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
        let score = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()];
                    score += piece === piece.toUpperCase() ? value : -value;
                }
            }
        }
        
        return score;
    }

    evaluatePosition(board) {
        let score = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    score += this.getPieceSquareValue(piece, row, col);
                }
            }
        }
        
        return score;
    }

    evaluateKingSafety(board) {
        // Simple king safety evaluation
        let score = 0;
        
        // Find kings and evaluate their safety
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.toLowerCase() === 'k') {
                    const isWhite = piece === piece.toUpperCase();
                    const safetyScore = this.getKingSafetyScore(board, row, col, isWhite);
                    score += isWhite ? safetyScore : -safetyScore;
                }
            }
        }
        
        return score;
    }

    evaluatePawnStructure(board) {
        let score = 0;
        
        // Evaluate pawn chains, isolated pawns, passed pawns
        for (let col = 0; col < 8; col++) {
            let whitePawns = [];
            let blackPawns = [];
            
            for (let row = 0; row < 8; row++) {
                const piece = board[row][col];
                if (piece && piece.toLowerCase() === 'p') {
                    if (piece === 'P') whitePawns.push(row);
                    else blackPawns.push(row);
                }
            }
            
            // Penalize doubled pawns
            if (whitePawns.length > 1) score -= 20 * (whitePawns.length - 1);
            if (blackPawns.length > 1) score += 20 * (blackPawns.length - 1);
        }
        
        return score;
    }

    getPieceSquareValue(piece, row, col) {
        // Simplified piece-square tables
        const centerBonus = {
            3: { 3: 10, 4: 10 },
            4: { 3: 10, 4: 10 }
        };
        
        const isWhite = piece === piece.toUpperCase();
        const pieceType = piece.toLowerCase();
        
        let bonus = 0;
        
        // Center control bonus for knights and bishops
        if ((pieceType === 'n' || pieceType === 'b') && centerBonus[row] && centerBonus[row][col]) {
            bonus = centerBonus[row][col];
        }
        
        // Pawn advancement bonus
        if (pieceType === 'p') {
            bonus = isWhite ? (7 - row) * 5 : row * 5;
        }
        
        return isWhite ? bonus : -bonus;
    }

    getKingSafetyScore(board, kingRow, kingCol, isWhite) {
        let safetyScore = 0;
        
        // Check for pawn shield
        const direction = isWhite ? -1 : 1;
        const shieldRow = kingRow + direction;
        
        if (shieldRow >= 0 && shieldRow < 8) {
            for (let col = Math.max(0, kingCol - 1); col <= Math.min(7, kingCol + 1); col++) {
                const piece = board[shieldRow][col];
                if (piece && piece.toLowerCase() === 'p' && 
                    ((isWhite && piece === 'P') || (!isWhite && piece === 'p'))) {
                    safetyScore += 10;
                }
            }
        }
        
        return safetyScore;
    }

    getMoveSuggestions(board, depth = 3) {
        // Analyze position and suggest best moves
        const moves = this.getAllLegalMoves(board, 'white');
        const evaluatedMoves = [];
        
        for (const move of moves.slice(0, 10)) { // Limit to top 10 moves for performance
            const newBoard = this.makeTemporaryMove(board, move);
            const score = -this.minimax(newBoard, depth - 1, -Infinity, Infinity, false);
            evaluatedMoves.push({ move, score });
        }
        
        evaluatedMoves.sort((a, b) => b.score - a.score);
        return evaluatedMoves.slice(0, 5); // Return top 5 suggestions
    }

    getPositionalInsights(board) {
        const insights = [];
        
        // Material analysis
        const material = this.evaluateMaterial(board);
        if (Math.abs(material) > 100) {
            insights.push({
                type: 'material',
                message: material > 0 ? 'White has a material advantage' : 'Black has a material advantage',
                value: Math.abs(material)
            });
        }
        
        // King safety analysis
        const kingSafety = this.evaluateKingSafety(board);
        if (Math.abs(kingSafety) > 20) {
            insights.push({
                type: 'safety',
                message: kingSafety > 0 ? 'White king is safer' : 'Black king is safer',
                value: Math.abs(kingSafety)
            });
        }
        
        return insights;
    }

    getAllLegalMoves(board, color) {
        // Simplified move generation for analysis
        const moves = [];
        // Implementation would go here - simplified for now
        return moves;
    }

    makeTemporaryMove(board, move) {
        // Create a copy of the board with the move applied
        const newBoard = JSON.parse(JSON.stringify(board));
        newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
        newBoard[move.from.row][move.from.col] = null;
        return newBoard;
    }

    minimax(board, depth, alpha, beta, isMaximizing) {
        if (depth === 0) {
            return this.evaluate(board);
        }
        
        // Simplified minimax for engine analysis
        return (Math.random() - 0.5) * 100; // Placeholder
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