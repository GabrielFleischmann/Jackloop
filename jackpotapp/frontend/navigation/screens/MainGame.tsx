import React, { useEffect, useRef, useState } from "react";
import "./MainGame.css";

type SymbolDef = { id: string; src: string; payout: number };

// import.meta.glob (assíncrono) — compatível com Vite
const modules = import.meta.glob("../../src/assets/Symbols/*.{png,jpg,jpeg,svg}");

function randIndexForLength(len: number) {
  return Math.floor(Math.random() * len);
}

export default function MainGame() {
  const [symbols, setSymbols] = useState<SymbolDef[] | null>(null);
  // grid como matriz 3x3: grid[row][col]
  const [grid, setGrid] = useState<number[][]>([]);
  const gridRef = useRef<number[][]>([]);
  useEffect(() => { gridRef.current = grid; }, [grid]);

  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(1);

  const [middleWin, setMiddleWin] = useState(false);

  const intervalsRef = useRef<number[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  // mapa de payout por id para evitar depender de índices
  const payoutMapRef = useRef<Map<string, number>>(new Map());

  // carregar símbolos dinamicamente (apenas uma vez)
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      const paths = Object.keys(modules);
      const promises = paths.map((p) =>
        (modules[p] as () => Promise<any>)().then((m) => ({ path: p, src: m.default }))
      );
      const results = await Promise.all(promises);

      if (!mounted) return;

      const loaded: SymbolDef[] = results.map(({ path, src }) => {
        const fileName = path.split("/").pop() || path;
        const id = fileName.replace(/\.(png|jpg|jpeg|svg)$/i, "");
        // ajusta payout conforme nome (ou personalize manualmente)
        let payout = 3;
        if (/star/i.test(id)) payout = 100;
        else if (/diamond/i.test(id)) payout = 50;
        else if (/chest/i.test(id)) payout = 25;
        else if (/coins/i.test(id)) payout = 10;
        else if (/bell/i.test(id)) payout = 5;
        return { id, src, payout };
      });

      // popular payoutMap por id (estável)
      const map = new Map<string, number>();
      loaded.forEach((s) => map.set(s.id, s.payout));
      payoutMapRef.current = map;

      setSymbols(loaded);
      // inicializa 3x3
      const initial = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => randIndexForLength(loaded.length)));
      setGrid(initial);
    }

    loadAll();
    return () => { mounted = false; };
  }, []);

  // cleanup para timers caso o componente desmonte
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((id) => clearInterval(id));
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      intervalsRef.current = [];
      timeoutsRef.current = [];
    };
  }, []);

  // retorna payout por id (usa mapa estável)
  const payoutForId = (id?: string) => {
    if (!id) return 3;
    return payoutMapRef.current.get(id) ?? 3;
  };

  // checkWin: varre linhas em busca de três simbolos iguais.
  // Retorna { isWin, line, index, winnerIndex, payout, gain } quando houver vitória.
  // Exibe `alert` com o ganho (comportamento pedido) e aceita `betParam`.
  const checkWin = (g: number[][], betParam = 1) => {
    if (!g || g.length < 3 || g.some((r) => !Array.isArray(r) || r.length < 3))
      return { isWin: false } as const;

    // Checa linhas
    for (let r = 0; r < 3; r++) {
      if (g[1][0] === g[1][1] && g[1][1] === g[1][2]) {
        const winnerIndex = g[1][0];
        const id = symbols?.[winnerIndex]?.id;
        const payout = payoutForId(id);
        const gain = payout * betParam;
        alert(`JACKPOT! Você ganhou ${gain} créditos!`);
        return { isWin: true, line: "row", index: r, winnerIndex, payout, gain } as const;
      }
    }
    return { isWin: false } as const;
  };

  const spin = async () => {
    if (spinning) return;
    if (!symbols || symbols.length === 0) return alert("Símbolos não carregados ainda.");
    if (bet > credits) return alert("Créditos insuficientes.");

    setSpinning(true);
    setCredits((c) => c - bet);
    const currentBet = bet;

    // limpa timers anteriores
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];

    const durations = [800, 1200, 1600];

    const columnPromises = durations.map((duration, col) => {
      return new Promise<void>((resolve) => {
        const intervalId = window.setInterval(() => {
          setGrid((prev) => {
            // garantir que 'prev' seja uma matriz 3x3 válida antes de copiar
            const next: number[][] = Array.from({ length: 3 }, (_, r) =>
              Array.isArray(prev?.[r])
                ? (prev![r] as number[]).slice()
                : Array.from({ length: 3 }, () => randIndexForLength(symbols.length))
            );
            for (let row = 0; row < 3; row++) {
              next[row][col] = randIndexForLength(symbols.length);
            }
            gridRef.current = next;
            return next;
          });
        }, 80);
        intervalsRef.current.push(intervalId);

        const timeoutId = window.setTimeout(() => {
          clearInterval(intervalId);
          setGrid((prev) => {
            const next: number[][] = Array.from({ length: 3 }, (_, r) =>
              Array.isArray(prev?.[r])
                ? (prev![r] as number[]).slice()
                : Array.from({ length: 3 }, () => randIndexForLength(symbols.length))
            );
            for (let row = 0; row < 3; row++) {
              next[row][col] = randIndexForLength(symbols.length);
            }
            gridRef.current = next;
            return next;
          });
          resolve();
        }, duration);
        timeoutsRef.current.push(timeoutId);
      });
    });

    await Promise.all(columnPromises);
    setSpinning(false);

    // após todos as colunas pararem, verificar vitória na linha do meio
    const result = checkWin(gridRef.current, currentBet);
    if (result.isWin) {
      setMiddleWin(true);
      const winResult = result as { isWin: true; gain?: number; payout?: number };
      const gain = winResult.gain ?? (winResult.payout ?? 3) * currentBet;
      setCredits((c) => c + gain);
      const clearId = window.setTimeout(() => setMiddleWin(false), 1500);
      timeoutsRef.current.push(clearId);
    }
  };

  if (!symbols) {
    return (
      <div className="slot-root">
        <h1>Caça-níqueis</h1>
        <div>Carregando símbolos...</div>
      </div>
    );
  }

  return (
    <div className="slot-root">
      <div className={"slot-grid" + (middleWin ? " win" : "")}>
        {grid.flat().map((symIndex, i) => {
          const sym = symbols?.[symIndex];
          const isMiddleCell = Math.floor(i / 3) === 1; // row 1
          const winnerClass = middleWin && isMiddleCell ? " winner" : "";
          return (
            <div
              key={i}
              className={"cell" + (spinning ? " spinning" : "") + winnerClass}
            >
              <img src={sym?.src} alt={sym?.id ?? "symbol"} className="symbol" />
            </div>
          );
        })}
      </div>

      <div className="slot-controls">
        <button onClick={spin} disabled={spinning || bet > credits}>JOGAR</button>
      </div>
    </div>
  );
}