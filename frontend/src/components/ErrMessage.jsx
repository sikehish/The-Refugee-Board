import React from 'react'

function ErrMessage({ children }) {
    return (
        <div className="p-2 mt-7 text-sm w-[60%] mx-auto text-red-800 rounded-lg bg-red-50 dark:text-red-600" role="alert">
            <span className="font-medium">{children}</span></div>
    )
}

export default ErrMessage