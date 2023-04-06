import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

type InlineEditButtonsProps = {
  onRequestClose: () => void
}

export const InlineEditButtons = ({
  onRequestClose,
}: InlineEditButtonsProps) => {
  return (
    <div className='inline p-2 align-middle'>
      <button
        type='submit'
        className='transition duration-150 ease-in-out hover:opacity-75'
      >
        <CheckIcon className='h-6 w-6 text-green-600' />
      </button>
      <button
        onClick={() => onRequestClose()}
        className='transition duration-150 ease-in-out hover:opacity-75'
      >
        <XMarkIcon className='h-6 w-6 text-red-700' />
      </button>
    </div>
  )
}
