'use client'
import React, { useEffect, useState } from 'react'
import { Draggable, DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useBoardStore } from '@/store/BoardStore'
import Image from 'next/image'
import getImageUrl from '@/util/getImageUrl'

type TodoCardProps = {
    todo: Todo,
    index: number,
    id: TypedColumn,
    innerRef: (element: HTMLElement | null) => void,
    draggableProps: DraggableProvidedDraggableProps,
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

function TodoCard({ id, index, todo, innerRef, dragHandleProps, draggableProps }: TodoCardProps) {
    const [deleteTask] = useBoardStore(state => [state.deleteTask])
    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        if (todo.image) {
            const url = getImageUrl(todo.image)
            setImage(url.toString())
        }
    }, [todo])

    return (
        <div
            className='bg-white rounded-lg drop-shadow-md space-y-2'
            {...dragHandleProps}
            {...draggableProps}
            ref={innerRef}
        >
            <div className='flex justify-between items-center p-5'>
                <p>{todo.title}</p>
                <button onClick={() => deleteTask(index, todo, id)} className='text-red-500 hover:text-red-600'><XCircleIcon className='h-8 w-8 ml-5' /></button>
            </div>
            {image && (
                <div className='w-full h-full'>
                    <Image
                        alt='todo image'
                        width={400}
                        height={200}
                        src={image}
                        className='w-full object-contain rounded-lg'
                    />
                </div>
            )}
        </div>
    )
}

export default TodoCard