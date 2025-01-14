import React from 'react';

export default function Message() {
  return (
    <div
      className="flex-1 bg-gray-700 bg-blend-multiply"
      style={{ backgroundImage: 'url(/message-bg.jpg)' }} // Correct inline style for background image
    >
      {
        [1,2,4,5,6].map((message, index)=> {
            return(
                <div key={index}>
                    <p className="text-white text-xl ">{message}</p>
                </div>
            )
        })
      }
    </div>
  );
}
