import React from 'react'

function Button({text}) {
    return (
        <>
            <button
                className="flex w-full justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {text}
              </button>

            
        </>
    )
}

export default Button