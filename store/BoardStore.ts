import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/util/getTodosGroupedByColumn';
import uploadImage from '@/util/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void,
    setBoard: (board: Board) => void,
    updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void,
    searchString: string,
    setSearchString: (value: string) => void,
    deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void,
    newTaskInput: string,
    setNewTaskInput: (value: string) => void,
    newTaskType: TypedColumn,
    setNewTaskType: (value: TypedColumn) => void,
    image: File | null,
    setImage: (image: File | null) => void,
    addTask: (task: string, columnId: TypedColumn, image?: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn()
        set({ board })
    },
    setBoard: (board) => set({ board }),
    updateTodoInDb: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },
    searchString: "",
    // TODO: debounce for search
    setSearchString: (value) => set({ searchString: value }),
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns)

        newColumns.get(id)?.todos.splice(taskIndex, 1)

        set({ board: { columns: newColumns } })

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )
    },
    newTaskInput: "",
    setNewTaskInput: (value: string) => set({ newTaskInput: value }),
    newTaskType: "todo",
    setNewTaskType: (value: TypedColumn) => set({ newTaskType: value }),
    image: null,
    setImage: (image: File | null) => set({ image }),
    addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
        let file: Image | undefined
        if (image) {
            const fileUploaded = await uploadImage(image)
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                }
            }
        }

        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && { image: JSON.stringify(file) })
            }
        )

        set({ newTaskInput: "" })

        set(state => {
            const newColumns = new Map(state.board.columns)

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                status: columnId,
                title: todo,
                ...(file && { image: file })
            }

            const col = newColumns.get(columnId)

            if (col) {
                newColumns.get(columnId)?.todos.push(newTodo)
            } else {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                })
            }

            return {
                board: {
                    columns: newColumns
                }
            }
        })
    }
}))