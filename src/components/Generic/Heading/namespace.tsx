import type { FC } from 'react'
import { Heading } from './Heading'
import type { HeadingProps } from './Heading'

/**
 * Extended Heading component interface that provides static methods for each heading level
 *
 * @remarks
 * Allows creating heading components with predefined levels (h1-h6)
 * while maintaining the original Heading component's props
 *
 * @example
 * // Using h2 heading
 * <Heading.h2>Section Title</Heading.h2>
 *
 * @example
 * // Using default heading with additional props
 * <Heading color="blue.500" textAlign="center">Centered Heading</Heading>
 */
interface HeadingComponent extends FC<Omit<HeadingProps, 'as'>> {
  /**
   * Heading level 1 component
   * @param props - Heading properties excluding 'as'
   */
  h1: FC<HeadingProps>

  /**
   * Heading level 2 component
   * @param props - Heading properties excluding 'as'
   */
  h2: FC<HeadingProps>

  /**
   * Heading level 3 component
   * @param props - Heading properties excluding 'as'
   */
  h3: FC<HeadingProps>

  /**
   * Heading level 4 component
   * @param props - Heading properties excluding 'as'
   */
  h4: FC<HeadingProps>

  /**
   * Heading level 5 component
   * @param props - Heading properties excluding 'as'
   */
  h5: FC<HeadingProps>

  /**
   * Heading level 6 component
   * @param props - Heading properties excluding 'as'
   */
  h6: FC<HeadingProps>
}

/**
 * Extends the base Heading component with static methods for each heading level
 */
const HeadingWithNamespace = Heading as HeadingComponent

// Create static methods for each heading level
HeadingWithNamespace.h1 = (props) => <Heading as="h1" {...props} />
HeadingWithNamespace.h2 = (props) => <Heading as="h2" {...props} />
HeadingWithNamespace.h3 = (props) => <Heading as="h3" {...props} />
HeadingWithNamespace.h4 = (props) => <Heading as="h4" {...props} />
HeadingWithNamespace.h5 = (props) => <Heading as="h5" {...props} />
HeadingWithNamespace.h6 = (props) => <Heading as="h6" {...props} />

/**
 * Exported Heading component with namespace-style level-specific components
 */
export { HeadingWithNamespace as Heading }
