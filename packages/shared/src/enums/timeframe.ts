export enum TimeframeFilter {
  /**
   * Any data that is upcoming (excludes past data)
   */
  UPCOMING = "upcoming",
  /**
   * Any data that is past (excludes upcoming data)
   */
  PAST = "past",
  /**
   * Any data that is current (excludes past data, or data that aren't open yet)
   */
  CURRENT = "current",
  /**
   * All of the data
   */
  DEFAULT = "default",
}
