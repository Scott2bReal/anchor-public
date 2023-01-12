import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

type InlineEditButtonsProps = {
  onRequestClose: () => void;
}

export const InlineEditButtons = ({ onRequestClose }: InlineEditButtonsProps) => {
  return (
    <div className='inline align-middle p-2'>
      <button type='submit' className='hover:opacity-75 transition duration-150 ease-in-out'>
        <CheckIcon className='h-6 w-6 text-green-600' />
      </button>
      <button onClick={() => onRequestClose()} className='hover:opacity-75 transition duration-150 ease-in-out'>
        <XMarkIcon className='h-6 w-6 text-red-700' />
      </button>
    </div>
  )
}
