import { useEffect, useRef, useState } from "react";
import "./MainGame.css";

import starPng from "../../src/assets/Symbols/star.png";
import diamondPng from "../../src/assets/Symbols/diamond.png";
import coinsPng from "../../src/assets/Symbols/coins.png";
import chestPng from "../../src/assets/Symbols/chest.png";
import bellPng from "../../src/assets/Symbols/bell.png";

type SymbolIcon = { id: string; src: string; label?: string };

const AVAILABLE_SYMBOLS: SymbolIcon[] = [
	{ id: "star", src: starPng, label: "Star" },
	{ id: "diamond", src: diamondPng, label: "Diamond" },
	{ id: "coins", src: coinsPng, label: "Coins" },
	{ id: "chest", src: chestPng, label: "Chest" },
	{ id: "bell", src: bellPng, label: "Bell" },
];

function randomSymbol(): SymbolIcon {
	return AVAILABLE_SYMBOLS[Math.floor(Math.random() * AVAILABLE_SYMBOLS.length)];
}
const SPIN_DURATION_MS = 1500; // duração total do giro em ms (menor = mais rápido)
const SPIN_ANIMATION_DURATION_MS = 1500; // duração da animação CSS por loop em ms

function createRandomBoard(rows = 3, cols = 3): SymbolIcon[][] {
	const board: SymbolIcon[][] = [];
	for (let r = 0; r < rows; r++) {
		const row: SymbolIcon[] = [];
		for (let c = 0; c < cols; c++) row.push(randomSymbol());
		board.push(row);
	}
	return board;
}

type Board = SymbolIcon[][];

function evaluateBoard(board: Board) {
	// Vitória só se a linha do meio (middle row) tiver todos os símbolos iguais
	const rows = board.length;
	const cols = board[0]?.length ?? 0;
	const winners: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

	if (rows === 0 || cols === 0) return { winners, isWin: false, symbol: null };

	const middleRow = Math.floor(rows / 2); // para 3x3 -> 1
	const first = board[middleRow][0];
	const isWin = Boolean(first && board[middleRow].every((s) => s.id === first.id));
	if (isWin) {
		for (let c = 0; c < cols; c++) winners[middleRow][c] = true;
		return { winners, isWin: true, symbol: first };
	}

	return { winners, isWin: false, symbol: null };
}

export default function MainGame() {
	const ROWS = 3;
	const COLS = 3;

	const [board] = useState<Board>(() => createRandomBoard(ROWS, COLS));
	const [displayedBoard, setDisplayedBoard] = useState<Board>(() => createRandomBoard(ROWS, COLS));
	const [spinning, setSpinning] = useState(false);
	const [winners, setWinners] = useState<boolean[][]>(() =>
		Array.from({ length: ROWS }, () => Array(COLS).fill(false))
	);
	const [isWin, setIsWin] = useState(false);
	const [winSymbol, setWinSymbol] = useState<SymbolIcon | null>(null);
	const [hasSpun, setHasSpun] = useState(false);
	const [displayBet, setDisplayBet] = useState(10);
	const [winnings, setWinnings] = useState(0);

	const intervalsRef = useRef<number[]>([]);

	function handleSpin() {
		if (spinning) return;
		// duração fixa do giro (configurável acima com SPIN_DURATION_MS)
		setSpinning(true);
		setHasSpun(true);

		const total = SPIN_DURATION_MS;
		// visual-only spin: não altera o board; avalia o board atual após o tempo total
		setTimeout(() => {
			// ensure spinning flag is cleared first so UI becomes responsive even if evaluation fails
			setSpinning(false);
			try {
				const result = evaluateBoard(board);
				setWinners(result.winners);
				setIsWin(result.isWin);
				setWinSymbol(result.symbol ?? null);
			} catch (err) {
				console.error("Error evaluating board after spin:", err);
			}
		}, total);
	}

	useEffect(() => {
		const result = evaluateBoard(board);
		setWinners(result.winners);
		setIsWin(result.isWin);
		setWinSymbol(result.symbol ?? null);
	}, [board]);

	// mantém displayedBoard sincronizado quando não está girando
	useEffect(() => {
		if (!spinning) setDisplayedBoard(board.map((r) => r.slice()));
	}, [board, spinning]);

	// limpa os intervalos ao desmontar o componente
	useEffect(() => {
		return () => {
			intervalsRef.current.forEach((id) => clearInterval(id));
		};
	}, []);

	return (
		<div className="slot-root">
			<div className="slot-frame">
				<div className={"slot-grid" + (isWin ? " win" : "")}>
				{/* renderiza as colunas para permitir um painel de fundo contínuo */}
				{Array.from({ length: 3 }, (_, col) => {
					const isColSpinning = spinning; 
					return (
						<div key={col} className={`slot-column ${isColSpinning ? 'spinning' : ''}`}>
							<div
								className={`reel-track ${isColSpinning ? 'spinning' : ''}`}
										style={isColSpinning ? { animationDuration: `${SPIN_ANIMATION_DURATION_MS}ms` } : undefined}
							>
								{Array.from({ length: 3 }, (_, row) => {
									const sym = (spinning ? displayedBoard : board)?.[row]?.[col];
									const isMiddleCell = row === 1;
									const winnerClass = isWin && isMiddleCell ? ' winner' : '';
									return (
										<div key={`${row}-${col}`} className={`cell${spinning ? ' spinning' : ''}${winnerClass}`}>
											<img src={sym?.src} alt={sym?.id ?? 'symbol'} className="symbol" />
										</div>
									);
								})}
								{isColSpinning && (
									// duplica para criar um giro contínuo sem corte
									Array.from({ length: 3 }, (_, row) => {
										const sym = (spinning ? displayedBoard : board)?.[row]?.[col];
										return (
											<div key={`dup-${row}-${col}`} className={`cell${spinning ? ' spinning' : ''}`}>
												<img src={sym?.src} alt={sym?.id ?? 'symbol'} className="symbol" />
											</div>
										);
									})
								)}
							</div>
						</div>
					);
				})}
				</div>

				<div className="controls-wrapper">
					<div className="controls-center">
						<div className="bet-label">{displayBet} MOEDAS</div>
						<div className="main-pill">
							<div className="coin-box" id="coin-box" data-role="coin-box">
								<div className="coin-line">
									<span className="coin-ico">🪙</span>
								</div>
								<span className="coin-value" id="display-bet" data-role="display-bet">{displayBet}</span>
							</div>
							<button
								id="btn-decrease-bet"
								data-role="decrease-bet"
								aria-label="Diminuir aposta"
								className="pill-btn"
								onClick={() => setDisplayBet((v) => Math.max(1, v - 1))}
								>
								-
								</button>
							<button
								id="btn-spin"
								data-role="spin"
								aria-label="Girar roleta"
								className="pill-play"
								onClick={handleSpin}
								disabled={spinning}
								>
								{spinning ? '...' : 'GIRAR ROLETA'}
							</button>
							<button
								id="btn-increase-bet"
								data-role="increase-bet"
								aria-label="Aumentar aposta"
								className="pill-btn"
								onClick={() => setDisplayBet((v) => v + 1)}
								>
								+
								</button>
							<div className="gain-box" id="gain-box" data-role="gain-box">
								<span className="coin-ico">🪙</span>
								<span className="gain-label">GANHOS</span>
								<span className="gain-value" id="display-winnings" data-role="display-winnings">{winnings}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}