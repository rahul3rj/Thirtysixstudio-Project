import React, { useState } from 'react'

const Toggle = ({name, darkMode}) => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div className={`w-full h-[8vh] border-b-[1px] ${darkMode ? 'border-white' : 'border-black'} flex justify-between items-center`}>
          <h6 className={`${darkMode ? 'text-white' : 'text-black'} text-[2vh] font-[king] ml-[25%]`}>{name}</h6>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`border-2 ${darkMode ? 'border-white hover:border-white' : 'border-zinc-600 hover:border-black'} text-[2vh] font-[king] w-[5vh] h-[3vh] rounded-full mr-[30%] hover:border-b-[1px] transition-all duration-300 ${isOpen ? `${darkMode ? 'bg-white text-black' : 'bg-black text-white'}` : `${darkMode ? 'text-white' : 'text-black'}`} cursor-pointer`}
          >
            {isOpen ? '-' : '+'}
          </button>
      </div>
      <div className={`w-full h-[8vh] border-b-[1px] ${darkMode ? 'border-zinc-700' : 'border-zinc-300'} flex justify-between items-center transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 max-h-[8vh]' : 'opacity-0 max-h-0'}`}>
          <h6 className={`${darkMode ? 'text-white group-hover:text-black' : 'text-black group-hover:text-white'} text-[2vh] font-[king] ml-[25%] relative z-10 transition-colors duration-300`}>ART DIRECTION</h6>
      </div>
    </div>
  )
}

export default Toggle