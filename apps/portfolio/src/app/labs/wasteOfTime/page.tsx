'use client';
import { Container, Button } from '@lancebailey26/skyforge-ui';
import { useTitle } from '@/hooks/useTitle';
import { useState } from 'react';
export default function WasteOfTimePage() {
    useTitle('Waste of Time');

    const [board, setBoard] = useState<string[]>(['', '', '', '', '', '', '', '', '']);
    const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
    const [winner, setWinner] = useState<string | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameOverMsg, setGameOverMsg] = useState('');
    const [turnCount, setTurnCount] = useState(0);
    const [checkCount, setCheckCount] = useState(0);
    const handleReset = () => {
        setBoard(['', '', '', '', '', '', '', '', '']);
        setCurrentPlayer('X');
        setWinner(null);
        setGameOver(false);
        setGameOverMsg('');
        setTurnCount(0);
        setCheckCount(0);
    };

    // Pre-computed lookup: maps cell index to its relevant win lines and win messages
    // Each entry: [line1, line2, line3, ...] where each line is [cell1, cell2, cell3, message]
    const CELL_LINES: Array<Array<[number, number, number, string]>> = [
        [[0, 1, 2, 'won horizontally top row'], [0, 3, 6, 'won vertically left column'], [0, 4, 8, 'won diagonally left to right']], // 0
        [[0, 1, 2, 'won horizontally top row'], [1, 4, 7, 'won vertically middle column']], // 1
        [[0, 1, 2, 'won horizontally top row'], [2, 5, 8, 'won vertically right column'], [2, 4, 6, 'won diagonally right to left']], // 2
        [[3, 4, 5, 'won horizontally middle row'], [0, 3, 6, 'won vertically left column']], // 3
        [[3, 4, 5, 'won horizontally middle row'], [1, 4, 7, 'won vertically middle column'], [0, 4, 8, 'won diagonally left to right'], [2, 4, 6, 'won diagonally right to left']], // 4
        [[3, 4, 5, 'won horizontally middle row'], [2, 5, 8, 'won vertically right column']], // 5
        [[6, 7, 8, 'won horizontally bottom row'], [0, 3, 6, 'won vertically left column'], [2, 4, 6, 'won diagonally right to left']], // 6
        [[6, 7, 8, 'won horizontally bottom row'], [1, 4, 7, 'won vertically middle column']], // 7
        [[6, 7, 8, 'won horizontally bottom row'], [2, 5, 8, 'won vertically right column'], [0, 4, 8, 'won diagonally left to right']], // 8
    ];

    // Ultra-optimized victory check: pre-computed lines, skips checking the played cell
    const checkVictory = (index: number, player: 'X' | 'O', boardState: string[]) => {
        let checks = 0;
        const lines = CELL_LINES[index];
        
        // Check only the relevant lines for this cell
        for(let i = 0; i < lines.length; i++) {
            const [a, b, c, msg] = lines[i];
            
            // Skip checking the cell we just played (we know it matches)
            // Only check the other 2 cells in the line
            let other1, other2;
            if(a === index) {
                other1 = b;
                other2 = c;
            } else if(b === index) {
                other1 = a;
                other2 = c;
            } else {
                other1 = a;
                other2 = b;
            }
            
            checks += 2; // Only 2 cells checked (skipping the one we just played)
            
            // Early exit: if either other cell doesn't match, this line can't win
            if(boardState[other1] === player && boardState[other2] === player) {
                setGameOverMsg(msg);
                setGameOver(true);
                setWinner(player);
                setCheckCount(prev => prev + checks);
                return true;
            }
        }
        
        setCheckCount(prev => prev + checks);
        return false;
    };
    const onCellClick = (index: number) => {
        if(gameOver)return;
        if(board[index] === '') {
            // Fix: properly clone the board array instead of mutating it
            const newBoard = [...board];
            newBoard[index] = currentPlayer;
            setBoard(newBoard);
            const newTurnCount = turnCount + 1;
            setTurnCount(newTurnCount);
            
            // only check victory when its possible for a player to win
            if(newTurnCount >= 5){
                // Check victory with the new board state and current player
                const hasWinner = checkVictory(index, currentPlayer, newBoard);
                
                // Check for tie game (no winner and board is full)
                if(!hasWinner && newBoard.indexOf('') === -1) {
                    setGameOverMsg('cats game');
                    setGameOver(true);
                }
            }
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };
    return (
        <div>
            <Container size="large" padding="lg" glass={true}>
                <h1>Waste of Time</h1>
                <Container size="medium" padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        {gameOver ? <p>Game Over!</p> : <p>Player {currentPlayer}'s turn</p>}
                        {gameOver && <p>{winner} {gameOverMsg}</p>}
                        <p>Turn #{turnCount}</p>
                        <p>Checks: {checkCount}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {board.map((cell, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid var(--color-border)',
                                borderRadius: '0.5rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '6rem',
                                fontWeight: 'bold',
                                minHeight: '10rem'
                            }}
                                onClick={() => onCellClick(index)}
                            >
                                {cell}

                            </div>
                        ))}
                    </div>
                    <Button onClick={handleReset} text='Reset' />
                </Container>
            </Container>
        </div>
    );
}