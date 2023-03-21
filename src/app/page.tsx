"use client"

import Link from 'next/link';
import { useState } from 'react';


export default function Home() {

  const id = Date.now().toString();

  const [roomId, setRoomId] = useState<string>();


  return (
    <div className="isolate bg-white">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9089FC" />
              <stop offset={1} stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="px-6 pt-6 lg:px-8">
      </div>
      <main>
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Real time Whiteboard Application
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Built using NATS and WebSockets
              </p>

              <div className="mt-12 p-4  mx-auto w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 shadow-xl ">
                <form className=" space-y-6" >
                  <div>
                    <label htmlFor="email" className="block mb-2 underline text-sm text-left text-gray-500">Enter Room ID</label>
                    <input type="text" name="id" id="id" value={roomId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Room ID" required 
                    onChange={(e) => setRoomId(e.target.value)}
                    />
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-x-6">
                    <Link
                      href={"/whiteboard/" + id}
                      className="rounded-md bg-indigo-500 items-left px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Create New Session
                    </Link>
                    <Link
                      href={"/whiteboard/" + roomId}
                      className="text-sm font-semibold leading-6 text-gray-900">
                      Join a Room <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </form>
              </div>


            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
