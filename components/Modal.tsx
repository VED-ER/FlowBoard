'use client'
import { FormEvent, Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore'
import { useBoardStore } from '@/store/BoardStore'
import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'

function Modal() {
    const imagePickerRef = useRef<HTMLInputElement>(null)
    const [isOpen, closeModal] = useModalStore(state => [state.isOpen, state.closeModal])
    const [newTaskInput, setNewTaskInput, image, setImage, addTask, newTaskType] = useBoardStore(state => [
        state.newTaskInput,
        state.setNewTaskInput,
        state.image,
        state.setImage,
        state.addTask,
        state.newTaskType
    ])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        addTask(newTaskInput, newTaskType, image)
        setImage(null)
        closeModal()
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='form' onSubmit={handleSubmit} className={'relative z-10'} onClose={closeModal}>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={'w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'}>
                                <Dialog.Title
                                    as='h3'
                                    className={'text-lg font-medium leading-6 text-gray-900 pb-2'}
                                >
                                    Add Task
                                </Dialog.Title>

                                <div className="mt-2">
                                    <input
                                        type="text"
                                        value={newTaskInput}
                                        onChange={e => setNewTaskInput(e.target.value)}
                                        placeholder='Enter task name here...'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>
                                <TaskTypeRadioGroup />
                                <div className='mt-2'>
                                    <button
                                        type='button'
                                        onClick={() => imagePickerRef.current?.click()}
                                        className='flex w-full justify-center border p-5 rounded-lg shadow-md outline-none border-gray-300 focus-visible:ring-2
                                    focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                                    >
                                        <PhotoIcon
                                            className='w-6 h-6 mr-2'
                                        />
                                        Upload Image
                                    </button>
                                    {image && (
                                        <Image
                                            alt='preview task image '
                                            width={200}
                                            height={200}
                                            className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed'
                                            src={URL.createObjectURL(image)}
                                            onClick={() => setImage(null)}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        ref={imagePickerRef}
                                        hidden
                                        onChange={e => {
                                            if (!e.target.files![0].type.startsWith("image/")) return
                                            setImage(e.target.files![0])
                                        }}
                                    />
                                </div>
                                <div className='mt-4'>
                                    <button
                                        type='submit'
                                        disabled={!newTaskInput}
                                        className='inline-flex w-full justify-center rounded-lg border border-transparent bg-green-300 p-4 text-md font-medium
                                    text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                    disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition >
    )
}

export default Modal