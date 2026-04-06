'use client';

import { Container, Button } from '@lancebailey26/skyforge-ui';
import { useTitle } from '@/hooks/useTitle';
import { useState } from 'react';
import { LabPageChrome } from '@/components/labs/LabPageChrome';
import { metadata } from './metadata';

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

  const CELL_LINES: Array<Array<[number, number, number, string]>> = [
    [[0, 1, 2, 'won horizontally top row'], [0, 3, 6, 'won vertically left column'], [0, 4, 8, 'won diagonally left to right']],
    [[0, 1, 2, 'won horizontally top row'], [1, 4, 7, 'won vertically middle column']],
    [[0, 1, 2, 'won horizontally top row'], [2, 5, 8, 'won vertically right column'], [2, 4, 6, 'won diagonally right to left']],
    [[3, 4, 5, 'won horizontally middle row'], [0, 3, 6, 'won vertically left column']],
    [
      [3, 4, 5, 'won horizontally middle row'],
      [1, 4, 7, 'won vertically middle column'],
      [0, 4, 8, 'won diagonally left to right'],
      [2, 4, 6, 'won diagonally right to left'],
    ],
    [[3, 4, 5, 'won horizontally middle row'], [2, 5, 8, 'won vertically right column']],
    [[6, 7, 8, 'won horizontally bottom row'], [0, 3, 6, 'won vertically left column'], [2, 4, 6, 'won diagonally right to left']],
    [[6, 7, 8, 'won horizontally bottom row'], [1, 4, 7, 'won vertically middle column']],
    [[6, 7, 8, 'won horizontally bottom row'], [2, 5, 8, 'won vertically right column'], [0, 4, 8, 'won diagonally left to right']],
  ];

  const checkVictory = (index: number, player: 'X' | 'O', boardState: string[]) => {
    let checks = 0;
    const lines = CELL_LINES[index];

    for(let i = 0; i < lines.length; i++) {
      const [a, b, c, msg] = lines[i];
      let other1: number;
      let other2: number;
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

      checks += 2;

      if(boardState[other1] === player && boardState[other2] === player) {
        setGameOverMsg(msg);
        setGameOver(true);
        setWinner(player);
        setCheckCount((prev) => prev + checks);
        return true;
      }
    }

    setCheckCount((prev) => prev + checks);
    return false;
  };

  const onCellClick = (index: number) => {
    if(gameOver) {
      return;
    }
    if(board[index] === '') {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);
      const newTurnCount = turnCount + 1;
      setTurnCount(newTurnCount);

      if(newTurnCount >= 5) {
        const hasWinner = checkVictory(index, currentPlayer, newBoard);
        if(!hasWinner && newBoard.indexOf('') === -1) {
          setGameOverMsg('cats game');
          setGameOver(true);
        }
      }
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  return (
    <LabPageChrome title={metadata.title} subtitle={metadata.description}>
      <div className="tech-marquee-stage">
        <p className="tech-marquee-stage-kicker">Play</p>
        <Container size="medium" padding="md" glass>
          <div className="lab-ttt-wrap">
            <div className="lab-ttt-status">
              {gameOver ?
                (
                  <>
                    <strong>Game over</strong>
                    {winner ?
                      (
                        <span>
                          {' '}
                          — <strong>{winner}</strong> {gameOverMsg}
                        </span>
                      ) :
                      (
                        <span> — {gameOverMsg}</span>
                      )}
                  </>
                ) :
                (
                  <>
                    Turn: <strong>{currentPlayer}</strong>
                  </>
                )}
            </div>
            <p className="lab-ttt-meta">
              Move {turnCount} · Win checks (this game): {checkCount}
            </p>
            <div className="lab-ttt-grid" role="grid" aria-label="Tic tac toe board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  type="button"
                  className="lab-ttt-cell"
                  onClick={() => onCellClick(index)}
                  disabled={gameOver || cell !== ''}
                  aria-label={cell ? `Cell ${index + 1}, ${cell}` : `Cell ${index + 1}, empty`}
                >
                  {cell}
                </button>
              ))}
            </div>
            <Button onClick={handleReset} text="New game" color="secondary" subColor="tonal" />
          </div>
        </Container>
      </div>
    </LabPageChrome>
  );
}