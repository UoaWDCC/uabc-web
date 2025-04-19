import type { FC } from 'react'
import { Heading } from './Heading'
import type { HeadingProps } from './Heading'

interface HeadingComponent extends FC<Omit<HeadingProps, 'as'>> {
  h1: FC<HeadingProps>
  h2: FC<HeadingProps>
  h3: FC<HeadingProps>
  h4: FC<HeadingProps>
  h5: FC<HeadingProps>
  h6: FC<HeadingProps>
}

const HeadingWithNamespace = Heading as HeadingComponent

HeadingWithNamespace.h1 = (props) => <Heading as="h1" {...props} />
HeadingWithNamespace.h2 = (props) => <Heading as="h2" {...props} />
HeadingWithNamespace.h3 = (props) => <Heading as="h3" {...props} />
HeadingWithNamespace.h4 = (props) => <Heading as="h4" {...props} />
HeadingWithNamespace.h5 = (props) => <Heading as="h5" {...props} />
HeadingWithNamespace.h6 = (props) => <Heading as="h6" {...props} />

export { HeadingWithNamespace as Heading }
