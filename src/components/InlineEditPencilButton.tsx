import { PencilSquareIcon } from '@heroicons/react/24/solid'

type InlineEditPencilButtonProps = {
  openFunction: () => void
}

export const InlineEditPencilButton = ({
  openFunction,
}: InlineEditPencilButtonProps) => {
  return (
    <button
      className={`transition duration-150 ease-in-out hover:opacity-75`}
      onClick={() => {
        openFunction()
      }}
    >
      <PencilSquareIcon className='h-4 w-4' />
    </button>
  )
}
