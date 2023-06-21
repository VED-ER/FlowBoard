'use client'
import { useBoardStore } from '@/store/BoardStore';
import React, { useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

function Board() {
    const [board, getBoard, setBoard, updateTodoInDb] = useBoardStore((state) => [state.board, state.getBoard, state.setBoard, state.updateTodoInDb])

    useEffect(() => {
        getBoard()
    }, [])

    const handleOnDragEnd = (result: DropResult) => {
        const { destination, source, type } = result

        if (!destination) return

        if (type === 'column') {
            const entries = Array.from(board.columns.entries())
            const [removed] = entries.splice(source.index, 1)
            entries.splice(destination.index, 0, removed)
            const rearrangedColumns = new Map(entries)
            // TODO: save order of columns in DB
            setBoard({ ...board, columns: rearrangedColumns })
            return
        }

        const columns = Array.from(board.columns)
        const startColIndex = columns[Number(source.droppableId)]
        const endColIndex = columns[Number(destination.droppableId)]

        const startCol: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos
        }

        const endCol: Column = {
            id: endColIndex[0],
            todos: endColIndex[1].todos
        }


        if (!startCol || !endCol) return

        if (source.index === destination.index && startCol === endCol) return

        const newTodos = startCol.todos
        const [movedTodo] = newTodos.splice(source.index, 1)

        if (startCol.id === endCol.id) {
            // same col
            newTodos.splice(destination.index, 0, movedTodo)
            const newCol = {
                id: startCol.id,
                todos: newTodos
            }

            const newColumns = new Map(board.columns)
            newColumns.set(startCol.id, newCol)

            // TODO: save order to db on column level

            setBoard({ ...board, columns: newColumns })
        } else {
            // diff col

            const newStartCol = {
                id: startCol.id,
                todos: newTodos
            }

            const endColTodos = endCol.todos
            endColTodos.splice(destination.index, 0, movedTodo)

            const newEndCol = {
                id: endCol.id,
                todos: endColTodos
            }

            const newColumns = new Map(board.columns)
            newColumns.set(startCol.id, newStartCol)
            newColumns.set(endCol.id, newEndCol)

            updateTodoInDb(movedTodo, endCol.id)

            setBoard({ ...board, columns: newColumns })
        }




    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='board' direction='horizontal' type='column'>
                {(provided) => (
                    <div
                        className='grid grid-cols-1 md:grid-cols-3 gap-5 mx-auto p-5'
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {Array.from(board.columns.entries()).map(([id, column], index) => (
                            <Column
                                key={id}
                                id={id}
                                todos={column.todos}
                                index={index}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Board