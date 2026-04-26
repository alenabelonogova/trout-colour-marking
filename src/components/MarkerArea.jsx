import { useState, useEffect } from 'react'
import { LURE_COLORS } from '../constants/colors';


function MarkerArea({ data, onBack }) {
    const [items] = useState(() => Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeField, setActiveField] = useState('main');

    const [results, setResults] = useState(() => {
        const saved = localStorage.getItem('trout_mapping_data');
        if (saved) return JSON.parse(saved);
        const initialState = {};
        Object.keys(data).forEach(k => { initialState[k] = { main: null, alt: null, glow: 'NO' } });
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('trout_mapping_data', JSON.stringify(results));
    }, [results]);

    const [colorName, imageUrl] = items[currentIndex];

    const selectValue = (val) => {
        setResults(prev => ({
            ...prev,
            [colorName]: { ...prev[colorName], [activeField]: val }
        }));
    };

    // Добавь этот блок внутрь компонента MarkerArea, перед return

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Перелистывание стрелками
            if (e.key === 'ArrowRight') {
                setCurrentIndex(p => Math.min(items.length - 1, p + 1));
            }
            if (e.key === 'ArrowLeft') {
                setCurrentIndex(p => Math.max(0, p - 1));
            }

            // Переключение вкладок цифрами
            if (e.key === '1') setActiveField('main');
            if (e.key === '2') setActiveField('alt');
            if (e.key === '3') setActiveField('glow');
        };

        // Вешаем слушатель
        window.addEventListener('keydown', handleKeyDown);

        // Убираем слушатель при выходе, чтобы не было ошибок
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items.length]); // Следим за длиной массива


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">

                {/* LEFT PANEL */}
                <div className="w-full md:w-1/2 p-8 border-r border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <button onClick={onBack} className="text-slate-400 hover:text-slate-800 text-xs font-black tracking-tighter">← НАЗАД</button>
                        <div className="px-4 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {currentIndex + 1} / {items.length}
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-slate-50 rounded-[2rem] p-6 mb-6">
                        <img key={imageUrl} src={imageUrl} className="max-w-full max-h-[350px] mix-blend-multiply" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight mb-4">{colorName}</h2>
                    <div className="flex gap-3">
                        <button onClick={() => setCurrentIndex(p => Math.max(0, p - 1))} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">←</button>
                        <button onClick={() => setCurrentIndex(p => Math.min(items.length - 1, p + 1))} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold">→</button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="w-full md:w-1/2 p-8 flex flex-col bg-slate-50/30">

                    {/* Field Tabs */}
                    <div className="grid grid-cols-3 gap-2 mb-8 p-1 bg-slate-100 rounded-2xl">
                        {['main', 'alt', 'glow'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveField(f)}
                                className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeField === f ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                            >
                                {f}: {activeField === 'glow' ? results[colorName][f] : (LURE_COLORS[results[colorName][f]]?.label || '—')}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow">
                        {activeField === 'glow' ? (
                            /* GLOW OPTIONS */
                            <div className="flex flex-col gap-4 mt-10">
                                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Выберите тип свечения:</p>
                                {['NO', 'RED', 'GREEN'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => selectValue(val)}
                                        className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all border-4 ${results[colorName].glow === val ? 'bg-blue-600 border-blue-200 text-white scale-105 shadow-xl' : 'bg-white border-transparent text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            /* COLOR PALETTE (for main/alt) */
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 overflow-y-auto pr-2 max-h-[500px]">
                                {Object.entries(LURE_COLORS).map(([key, info]) => (
                                    <button
                                        key={key}
                                        onClick={() => selectValue(key)}
                                        className={`group flex flex-col items-center gap-1.5 p-1 transition-all ${results[colorName][activeField] === key ? 'scale-110' : 'hover:scale-105'}`}
                                    >
                                        <div
                                            className={`w-12 h-12 rounded-2xl shadow-md relative overflow-hidden ${info.isClear ? 'border-2 border-dashed border-slate-300' : 'border-2 border-white'} ${results[colorName][activeField] === key ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}
                                            style={{ background: info.isClear ? 'white' : (info.isMetallic ? `radial-gradient(circle at 35% 35%, ${info.shine}, ${info.hex})` : info.hex) }}
                                        >
                                            {info.isClear && <div className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-slate-400 uppercase">Clear</div>}
                                        </div>
                                        <span className="text-[8px] font-black text-slate-500 text-center leading-none uppercase tracking-tighter">{info.label}</span>
                                    </button>
                                ))}
                                <button onClick={() => selectValue(null)} className="flex flex-col items-center gap-1.5 p-1 opacity-30 hover:opacity-100">
                                    <div className="w-12 h-12 rounded-2xl border-2 border-slate-300 flex items-center justify-center text-slate-400 text-lg">×</div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Сброс</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
                        const a = document.createElement('a'); a.href = dataStr; a.download = "mapping.json"; a.click();
                    }} className="mt-8 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-emerald-600 transition-shadow shadow-lg shadow-emerald-100">
                        Экспортировать JSON
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MarkerArea;
