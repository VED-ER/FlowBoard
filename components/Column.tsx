import { PlusCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import TodoCard from './TodoCard'
import { useBoardStore } from '@/store/BoardStore'
import { useModalStore } from '@/store/ModalStore'

type ColumnProps = {
    id: TypedColumn,
    todos: Todo[],
    index: number
}

const idToColumnText: {
    [key in TypedColumn]: string
} = {
    todo: 'To Do',
    inprogress: 'In Progress',
    done: 'Done'
}

function Column({ id, todos, index }: ColumnProps) {
    const [searchString, setNewTaskType] = useBoardStore(state => [state.searchString, state.setNewTaskType])
    const [openModal] = useModalStore(state => [state.openModal])

    const onAddTaskClick = () => {
        setNewTaskType(id)
        openModal()
    }

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Droppable droppableId={index.toString()} type='card'>
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'}`}
                            >
                                <h2 className='flex justify-between items-center font-bold text-xl p-2'>
                                    {idToColumnText[id]}
                                    <span
                                        className='text-gray-500 bg-gray-200 p-2 rounded-full text-sm font-normal py-1'
                                    >
                                        {!searchString
                                            ?
                                            todos.length
                                            :
                                            todos.filter(todo => todo.title.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())).length
                                        }
                                    </span>
                                </h2>

                                <div className='space-y-2'>
                                    {todos.map((todo, index) => {
                                        if (searchString && !todo.title.toLocaleLowerCase().includes(searchString)) return null

                                        return (
                                            <Draggable key={todo.$id} draggableId={todo.$id} index={index}>
                                                {(provided) => (
                                                    <TodoCard
                                                        draggableProps={provided.draggableProps}
                                                        dragHandleProps={provided.dragHandleProps}
                                                        innerRef={provided.innerRef}
                                                        id={id}
                                                        index={index}
                                                        todo={todo}
                                                    />
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}

                                    <div className='flex items-end justify-end p-2'>
                                        <button onClick={onAddTaskClick} className='text-green-500 hover:text-green-600'>
                                            <PlusCircleIcon className='h-10 w-10' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    )
}

export default Column