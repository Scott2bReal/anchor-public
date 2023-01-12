import { useRouter } from 'next/router'

const GoBackButton = () => {
  const back = useRouter().back

  return (
    <div className='p-6 align-top'>
      <button
        onClick={() => back()}
        className='p-4 transition duration-150 ease-in-out hover:scale-105 hover:cursor-pointer'
      >
        Back
      </button>
    </div>
  )
}

export default GoBackButton
