import React, { useState } from 'react';

function Tabs() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const tabs = [
        { label: 'Tab 1', content: 'Contenido de la pestaña 1' },
        { label: 'Tab 2', content: 'Contenido de la pestaña 2' },
        { label: 'Tab 3', content: 'Contenido de la pestaña 3' },
    ];

    return (
        <>
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`px-4 py-2 ${activeTab === index
                            ? 'bg-[#6C1D45] text-white'
                            : 'bg-gray-200 text-gray-700'
                            }`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white border border-gray-300">
                {tabs[activeTab].content}
            </div>
        </>
    )
}

export default Tabs
