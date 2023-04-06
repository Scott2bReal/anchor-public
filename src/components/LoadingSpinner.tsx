import Image from 'next/image'

const LoadingSpinner = () => {
  return (
    <div className='mx-auto flex h-full w-full items-center justify-center'>
      <div
        className='spinner-border mx-auto inline-block h-8 w-8 animate-spin rounded-full'
        role='status'
      >
        <span className='hidden'>Loading...</span>
        <Image src='/favicon.ico' alt='carabiner spinning' fill={true} />
      </div>
    </div>
  )
}

export default LoadingSpinner
