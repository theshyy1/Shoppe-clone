import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <section className='h-screen flex items-center bg-white dark:bg-gray-900'>
      <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
        <div className='mx-auto max-w-screen-sm text-center'>
          <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white text-primary-600'>404</h1>
          <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
            This page is not found.
          </p>
          <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
            Sorry, we can't find that page. You'll find lots to explore on the home page.
          </p>
          <Link
            to='/'
            className='inline-flex text-white bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-white'
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Notfound
