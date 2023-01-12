import Image from "next/image"

const LoadingSpinner = () => {
  return (
    <div className='w-full h-full flex justify-center items-center mx-auto'>
    <div
      className='spinner-border animate-spin inline-block h-8 w-8 rounded-full mx-auto'
      role='status'
    >
      <span className='hidden'>Loading...</span>
      <Image src='/favicon.ico' alt='carabiner spinning' layout='fill' />
    </div>
</div>
  )
}

export default LoadingSpinner
