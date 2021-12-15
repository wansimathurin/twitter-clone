import React from 'react'

function SidebarLink({Icon,text,active}) {
    return (
        <div className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${active && "font-bold"}`}>
            <Icon className="h-7 text-white"/>
            <span className="hidden xl:inline text-white">{text}</span>
        </div>
    )
}

export default SidebarLink
