'use client'
import Image from 'next/image'
import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '@/store/BoardStore'

function Header() {
    const [searchString, setSearchString] = useBoardStore((state) => [state.searchString, state.setSearchString])

    return (
        <header>
            <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>

                <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br rounded-md
                 from-pink-500 to-[#0055D1] filter blur-3xl opacity-50 -z-50'>
                </div>

                <Image
                    src={'/logo.png'}
                    alt='logo'
                    width={300}
                    height={100}
                    className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
                />

                <div className='flex space-x-5 w-full flex-1 justify-end'>
                    <form className='flex items-center space-x-5 bg-white rounded-md p-2 flex-1 md:flex-initial shadow-md'>
                        <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
                        <input
                            type="text"
                            placeholder='Search'
                            className='flex-1 outline-none'
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                        />
                        <button hidden>Search</button>
                    </form>

                    <Avatar name='Vedran Erak' size='50' color='#0055D1' round />
                </div>
            </div>

        </header>
    )
}

export default Header