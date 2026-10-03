import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between items-end border-b-2 border-murkoff-dark pb-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold text-murkoff-paper tracking-widest uppercase animate-pulse">
          Archivo Confidencial
        </h1>
        <p className="text-murkoff-blood text-xl mt-2 font-bold tracking-widest">
          ESTATUS: CLASIFICADO - MURKOFF CORP.
        </p>
      </div>
      <div className="text-right">
        <p className="text-murkoff-glitch text-sm flex items-center justify-end gap-2">
          <span className="w-2 h-2 rounded-full bg-murkoff-glitch animate-ping"></span>
          SIS.REC: ONLINE
        </p>
        <p className="text-xs text-gray-500 mt-1 font-mono">{time}</p>
        <p className="text-xs text-gray-400 mt-1 uppercase">Sujeto: Cristobal Antonio Rojas Perez</p>
      </div>
    </div>
  );
}
