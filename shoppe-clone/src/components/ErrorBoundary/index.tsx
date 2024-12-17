import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <section className='h-screen flex items-center bg-white dark:bg-gray-900'>
          <div className='py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6'>
            <div className='mx-auto max-w-screen-sm text-center'>
              <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-white text-primary-600'>
                500
              </h1>
              <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
                Errors happened!
              </p>

              <a
                href='/'
                className='inline-flex text-white bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center border-2 border-white'
              >
                Back to Homepage
              </a>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
