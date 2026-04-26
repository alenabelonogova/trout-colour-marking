import { useState } from 'react'

function MarkerArea({ data, onBack }) {
    // 1. Превращаем объект в массив и сразу сортируем по алфавиту (по названию цвета)
    const [items] = useState(() =>
        Object.entries(data).sort((a, b) => a[0].localeCompare(b[0]))
    );

    // 2. Индекс текущей приманки
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!data || items.length === 0) return null;

    const [colorName, imageUrl] = items[currentIndex];

    // Функции навигации
    const nextLure = () => {
        if (currentIndex < items.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const prevLure = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    return (
        <div className="min-h-screen bg-white p-8 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">

                {/* Верхняя панель */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onBack} className="group text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors">
                        <span className="text-xl">«</span> Выход из разметки
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">Прогресс</span>
                        <div className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                            {currentIndex + 1} <span className="text-slate-400 font-medium">/ {items.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">

                    {/* Левая часть: Картинка и управление */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner min-h-[450px] flex items-center justify-center relative group">
                            <img
                                key={imageUrl}
                                src={imageUrl}
                                alt={colorName}
                                className="max-w-full max-h-full rounded-2xl shadow-sm mix-blend-multiply transition-opacity duration-300"
                            />
                        </div>

                        {/* Кнопки Назад / Вперед */}
                        <div className="flex gap-4">
                            <button
                                onClick={prevLure}
                                disabled={currentIndex === 0}
                                className="flex-1 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                ← Назад
                            </button>
                            <button
                                onClick={nextLure}
                                disabled={currentIndex === items.length - 1}
                                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg active:scale-95"
                            >
                                Вперед →
                            </button>
                        </div>
                    </div>

                    {/* Правая часть: Описание и палитра */}
                    <div className="w-full md:w-1/2 pt-4">
                        <div className="inline-block px-3 py-1 bg-blue-50 rounded-lg mb-3">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Цвет создателя</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 leading-tight mb-8">
                            {colorName}
                        </h2>

                        {/* Заглушка под твою шкалу */}
                        <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse"></div>
                            <p className="text-slate-400 text-center italic text-sm px-10">
                                Здесь мы разместим твою шкалу цветов для маппинга
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MarkerArea;
