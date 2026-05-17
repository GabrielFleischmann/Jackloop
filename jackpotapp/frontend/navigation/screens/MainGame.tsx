import { useEffect, useRef, useState } from "react";
import "./MainGame.css";
import api from "../../src/services/api";

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
	// quantas linhas invisíveis (cópias) renderizar por coluna para criar o efeito de reel longo
	const DUPLICATE_COPIES = 25;

	// array de durações (ms) usadas para o inline animationDuration de cada coluna
	const [animationDurations, setAnimationDurations] = useState<number[]>(() => Array.from({ length: COLS }, () => 600));

	const [board, setBoard] = useState<Board>(() => createRandomBoard(ROWS, COLS));
	const [displayedBoard, setDisplayedBoard] = useState<Board>(() => createRandomBoard(ROWS, COLS));
	const [spinning, setSpinning] = useState(false);
	const [winners, setWinners] = useState<boolean[][]>(() =>
		Array.from({ length: ROWS }, () => Array(COLS).fill(false))
	);
	const [isWin, setIsWin] = useState(false);
	const [winSymbol, setWinSymbol] = useState<SymbolIcon | null>(null);
	const [hasSpun, setHasSpun] = useState(false);
	const [displayBet, setDisplayBet] = useState(10);
	const [displayCredit, setDisplayCredit] = useState<number | null>(null);
	const [winnings, setWinnings] = useState(0);
	const [user, setUser] = useState<any | null>(null);

	const intervalsRef = useRef<number[]>([]);

	useEffect(() => {
		const saved = localStorage.getItem("user");
		if (saved) {
			try {
				const userData = JSON.parse(saved);
				setUser(userData);
				api.get(`/coins/balance/${userData.id}/`)
					.then((response: any) => {
						setDisplayCredit(response.data.balance);
					})
					.catch((err: any) => console.error(err));
			} catch {
				localStorage.removeItem("user");
			}
		}
	}, []);

	function handleSpin() {
		if (spinning) return;
		// gera durações randômicas por coluna (ms) e também animações por-loop randômicas
		if (displayCredit === null || displayBet > displayCredit) return;

		const durations = Array.from({ length: COLS }, (_, c) => 1800 + c * 200 + Math.floor(Math.random() * 800));
		const anims = Array.from({ length: COLS }, () => 2500 + Math.floor(Math.random() * 400));
		setAnimationDurations(anims);

		// gerar o novo board que será o resultado final do giro
		const newBoard = createRandomBoard(ROWS, COLS);
		setBoard(newBoard);

		setSpinning(true);

		// iniciar animação visual: atualizar displayedBoard constantemente durante o spin
		intervalsRef.current.forEach((id) => clearInterval(id));
		intervalsRef.current = [];

		const intervalId = window.setInterval(() => {
			setDisplayedBoard(createRandomBoard(ROWS, COLS));
		}, 90);
		intervalsRef.current.push(intervalId);

		setHasSpun(true);

		const total = Math.max(...durations);
		// ao terminar a animação, parar o spin e avaliar o novo board
		setTimeout(() => {
			setSpinning(false);
			// parar animação visual
			intervalsRef.current.forEach((id) => clearInterval(id));
			intervalsRef.current = [];
			// mostrar o resultado real
			setDisplayedBoard(newBoard);
			try {
				const result = evaluateBoard(newBoard);
				setWinners(result.winners);
				setIsWin(result.isWin);
				setWinSymbol(result.symbol ?? null);

				if (user) {
					if (result.isWin) {
						const winAmount = displayBet * 2;
						const newBalance = (displayCredit ?? 0) + winAmount;
						setWinnings(prev => prev + winAmount);
						setDisplayCredit(newBalance);

						api.post('/coins/transactions/', {
							user: user.id,
							amount: winAmount,
							transaction_type: 'win',
							description: 'Ganhou na roleta'
						}).then(() => {
							window.dispatchEvent(new Event('balanceUpdated'));
						}).catch((err: any) => console.error(err));
					} else {
						setWinnings(prev => prev);
						const newBalance = (displayCredit ?? 0) - displayBet;
						setDisplayCredit(newBalance);

						api.post('/coins/transactions/', {
							user: user.id,
							amount: -displayBet,
							transaction_type: 'purchase',
							description: 'Perdeu na roleta'
						}).then(() => {
							window.dispatchEvent(new Event('balanceUpdated'));
						}).catch((err: any) => console.error(err));
					}
				}
			} catch (err) {
				console.error(err);
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

	// garante que a aposta nunca seja maior que o crédito quando o crédito mudar
	useEffect(() => {
		if (displayCredit !== null && displayBet > displayCredit) setDisplayBet(Math.max(1, displayCredit));
	}, [displayCredit]);

	return (
		<div className="slot-root">
			<div className="slot-frame">
				<div className={"slot-grid" + (isWin ? " win" : "")}>
					{Array.from({ length: 3 }, (_, col) => {
						const isColSpinning = spinning;
						return (
							<div key={col} className={`slot-column ${isColSpinning ? 'spinning' : ''}`}>
								<div
									className={`reel-track ${isColSpinning ? 'spinning' : ''}`}
									style={isColSpinning ? { animationDuration: `${animationDurations[col]}ms` } : undefined}
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
										// duplica para criar um giro contínuo sem corte (usa módulo para índices válidos)
										Array.from({ length: DUPLICATE_COPIES }, (_, row) => {
											const idx = row % ROWS;
											const sym = (spinning ? displayedBoard : board)?.[idx]?.[col];
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
						<div className="bet-label">APOSTA: R${displayBet}</div>
						<div className="main-pill">
							<div className="coin-box" id="coin-box" data-role="coin-box">
								<div className="coin-line">
									<span className="coin-ico">🪙</span>
								</div>
								<span className="coin-value" id="display-bet" data-role="display-bet">{displayCredit === null ? "---" : displayCredit}</span>
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
								disabled={displayCredit === null || spinning || (displayCredit !== null && displayBet > displayCredit)}

							>
								{spinning ? '...' : 'GIRAR ROLETA'}
							</button>
							<button
								id="btn-increase-bet"
								data-role="increase-bet"
								aria-label="Aumentar aposta"
								className="pill-btn"
								onClick={() => setDisplayBet((v) => Math.min(displayCredit ?? 0, v + 1))}
								disabled={displayCredit === null || displayBet >= displayCredit}
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




