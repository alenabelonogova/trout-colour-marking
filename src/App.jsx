// src/App.jsx
import { useState, useEffect } from 'react'
import MarkerArea from './MarkerArea' // Импортируем наш новый компонент

function App() {
    const [fileStatus, setFileStatus] = useState('Checking...')
    const [rowCount, setRowCount] = useState(0)
    const [error, setError] = useState(null)
    const [isStarted, setIsStarted] = useState(false)
    const [jsonData, setJsonData] = useState(null); // Добавляем хранение данных


    useEffect(() => {
        import('./data.json')
            .then((module) => {
                const data = module.default
                setRowCount(Object.keys(data).length)
                setJsonData(data); // Сохраняем данные целиком
                setFileStatus('Файл найден и успешно загружен! ✅')
            })
            .catch(() => {
                setFileStatus('Файл data.json не найден в папке src ❌')
                setError('Убедитесь, что файл src/data.json существует.')
            })
    }, [])

    // Если нажали "Начать работу", показываем компонент MarkerArea
    if (isStarted) {
        return <MarkerArea data={jsonData} onBack={() => setIsStarted(false)} />
    }

    // Иначе показываем экран проверки
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl p-8 border border-slate-100 text-center">
                <div className="text-4xl mb-4 text-blue-600 font-black tracking-widest uppercase">Trout Colours</div>

                <div className="space-y-4 mb-8 text-left">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Статус данных</span>
                        <p className={`text-sm font-semibold mt-1 ${error ? 'text-red-500' : 'text-emerald-600'}`}>
                            {fileStatus}
                        </p>
                    </div>

                    {!error && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Строк в базе</span>
                            <p className="text-3xl font-black text-blue-600 mt-1">{rowCount}</p>
                        </div>
                    )}
                </div>

                {!error && rowCount > 0 && (
                    <button
                        onClick={() => setIsStarted(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                        Начать работу
                    </button>
                )}
            </div>
        </div>
    )
}

export default App
